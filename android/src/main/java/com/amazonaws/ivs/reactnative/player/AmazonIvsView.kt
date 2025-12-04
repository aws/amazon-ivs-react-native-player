package com.amazonaws.ivs.reactnative.player

import android.Manifest
import android.app.Activity
import android.app.PictureInPictureParams
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Log
import android.view.View
import android.widget.FrameLayout
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.amazonaws.ivs.player.Cue
import com.amazonaws.ivs.player.MediaPlayer
import com.amazonaws.ivs.player.Player
import com.amazonaws.ivs.player.PlayerException
import com.amazonaws.ivs.player.PlayerView
import com.amazonaws.ivs.player.Quality
import com.amazonaws.ivs.player.ResizeMode
import com.amazonaws.ivs.player.Source
import com.amazonaws.ivs.player.TextCue
import com.amazonaws.ivs.player.TextMetadataCue
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper.getEventDispatcherForReactTag
import com.facebook.react.uimanager.UIManagerHelper.getSurfaceId
import com.facebook.react.uimanager.events.EventDispatcher
import java.util.Timer
import kotlin.concurrent.timerTask


class AmazonIvsView(private val context: ThemedReactContext) : FrameLayout(context),
  LifecycleEventListener {
  private var playerView: PlayerView? = null
  private var player: Player? = null
  private var streamUri: Uri? = null
  private val playerListener: Player.Listener?
  private var controlReceiver: BroadcastReceiver? = null

  var playerObserver: Timer? = null
  private var lastLiveLatency: Long? = null
  private var lastBitrate: Long? = null
  private var lastDuration: Long? = null
  private var lastPipState: Boolean = false;
  private var finishedLoading: Boolean = false
  private var pipEnabled: Boolean = false
  private var isInBackground: Boolean = false
  private var preloadSourceMap: HashMap<Int, Source> = hashMapOf()

  private var breakpoints: List<Long> = emptyList()
  private var lastPosition: Long = 0

  private var progressInterval: Long = 1000
  private var wasPlayingBeforeBackground: Boolean = false
  private var playInBackground: Boolean = false
  private var notificationTitle: String = ""
  private var notificationText: String = ""


  private val eventDispatcher: EventDispatcher

  enum class Events(private val mName: String) {
    STATE_CHANGED("onPlayerStateChange"),
    DURATION_CHANGED("onDurationChange"),
    ERROR("onError"),
    QUALITY_CHANGED("onQualityChange"),
    PIP_CHANGED("onPipChange"),
    CUE("onTextCue"),
    METADATA_CUE("onTextMetadataCue"),
    LOAD("onLoad"),
    LOAD_START("onLoadStart"),
    REBUFFERING("onRebuffering"),
    SEEK("onSeek"),
    SEEK_COMPLETE("onSeekComplete"),
    DATA("onData"),
    LIVE_LATENCY_CHANGED("onLiveLatencyChange"),
    VIDEO_STATISTICS("onVideoStatistics"),
    PROGRESS("onProgress"),
    TIME_POINT("onTimePoint"),
    VIDEO_SIZE_CHANGE("onVideoSizeChange");

    override fun toString(): String {
      return mName
    }
  }

  init {
    playerView = PlayerView(context)
    player = playerView?.player
    playerView?.controlsEnabled = false
    eventDispatcher = getEventDispatcherForReactTag(context, id)!!

    context.addLifecycleEventListener(this)

    playerView?.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
      override fun onViewAttachedToWindow(v: View) {
      }

      override fun onViewDetachedFromWindow(v: View) {
        if (!playInBackground) {
          playerView?.player?.pause()
        }
      }
    })

    playerListener = object : Player.Listener() {
      override fun onStateChanged(state: Player.State) {
        onPlayerStateChange(state)
      }

      override fun onDurationChanged(duration: Long) {
        onDurationChange(duration)
      }

      override fun onRebuffering() {
        onPlayerRebuffering()
      }

      override fun onSeekCompleted(position: Long) {
        onSeek(position)
        onSeekComplete(true)
      }

      override fun onQualityChanged(quality: Quality) {
        onQualityChange(quality)
      }

      override fun onVideoSizeChanged(p0: Int, p1: Int) {
        onVideoSizeChange(p0, p1)

        post(mLayoutRunnable)
      }

      override fun onCue(cue: Cue) {
        if (cue is TextCue) {
          onTextCue(cue)
        } else if (cue is TextMetadataCue) {
          onTextMetadataCue(cue)
        }
      }

      override fun onError(e: PlayerException) {
        onError(e.getErrorMessage())
      }
    }

    controlReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        val action = intent?.getStringExtra("action")
        if (action == "pause") {
          player?.pause()
          if (playInBackground) startBackgroundService(false)
        } else if (action == "play") {
          player?.play()
          if (playInBackground) startBackgroundService(true)
        }
      }
    }

    val filter = IntentFilter("IVS_PLAYER_CONTROL")
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      context.registerReceiver(controlReceiver, filter, Context.RECEIVER_EXPORTED)
    } else {
      context.registerReceiver(controlReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
    }

    player?.addListener(playerListener);
    addView(playerView)

    playerObserver = Timer("observerInterval", false)
    playerObserver?.schedule(timerTask {
      intervalHandler()
    }, 0, progressInterval)
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    super.onLayout(changed, left, top, right, bottom)
    if (changed) {
      post(mLayoutRunnable)
    }
  }

  private fun startBackgroundService(isPlaying: Boolean) {
    val context = context.applicationContext
    val serviceIntent = Intent(context, IVSBackgroundService::class.java)
    serviceIntent.putExtra(IVSBackgroundService.EXTRA_IS_PLAYING, isPlaying)
    serviceIntent.putExtra(IVSBackgroundService.NOTIFICATION_TITLE, this.notificationTitle)
    serviceIntent.putExtra(IVSBackgroundService.NOTIFICATION_TEXT, this.notificationText)

    ContextCompat.startForegroundService(context, serviceIntent)
  }

  private fun stopBackgroundService() {
    val context = context.applicationContext
    val serviceIntent = Intent(context, IVSBackgroundService::class.java)
    context.stopService(serviceIntent)
  }

  fun setStreamUrl(streamUrl: String) {
    player?.let { player ->
      val reactContext = context as ReactContext
      val uri = Uri.parse(streamUrl);
      this.streamUri = uri;
      playInBackground = true

      finishedLoading = false
      player.load(uri)
      eventDispatcher.dispatchEvent(
        IVSEvent(
          getSurfaceId(reactContext),
          id,
          Events.LOAD_START,
          Arguments.createMap()
        )
      )
    }
  }

  fun setMuted(muted: Boolean) {
    player?.isMuted = muted
  }

  fun setPlayInBackground(playInBackground: Boolean) {
    if (playInBackground) {
      checkAndRequestNotificationPermission()
    }
    this.playInBackground = playInBackground
  }

  fun setNotificationTitle(notificationTitle: String?) {
    this.notificationTitle = notificationTitle ?: ""

    if (isInBackground && playInBackground) {
      startBackgroundService(player?.state == Player.State.PLAYING)
    }
  }

  fun setNotificationText(notificationText: String?) {
    this.notificationText = notificationText ?: ""

    if (isInBackground && playInBackground) {
      startBackgroundService(player?.state == Player.State.PLAYING)
    }
  }

  fun setLooping(shouldLoop: Boolean) {
    player?.setLooping(shouldLoop)
  }

  fun setVolume(volume: Double) {
    player?.setVolume(volume.toFloat())
  }

  fun setLiveLowLatency(liveLowLatency: Boolean) {
    player?.setLiveLowLatencyEnabled(liveLowLatency)
  }

  fun setRebufferToLive(rebufferToLive: Boolean) {
    player?.setRebufferToLive(rebufferToLive)
  }

  fun setPlaybackRate(playbackRate: Double) {
    player?.playbackRate = playbackRate.toFloat()
  }

  fun setLogLevel(logLevel: Int) {
    when (logLevel) {
      0 -> player?.setLogLevel(Player.LogLevel.DEBUG)
      1 -> player?.setLogLevel(Player.LogLevel.INFO)
      2 -> player?.setLogLevel(Player.LogLevel.WARNING)
      3 -> player?.setLogLevel(Player.LogLevel.ERROR)
    }
  }


  fun setResizeMode(resizeMode: String?) {
    playerView?.resizeMode = findResizeMode(resizeMode)
  }

  private fun findResizeMode(mode: String?): ResizeMode = when (mode) {
    "aspectFill" -> ResizeMode.FILL
    "aspectFit" -> ResizeMode.FIT
    "aspectZoom" -> ResizeMode.ZOOM
    else -> ResizeMode.FIT
  }

  private fun findQuality(quality: ReadableMap?): Quality? {
    val newQuality = player?.qualities?.firstOrNull() { x ->
      x.name == quality?.getString("name") &&
        x.codecs == quality.getString("codecs") &&
        x.bitrate == quality.getInt("bitrate") &&
        x.framerate == quality.getDouble("framerate").toFloat() &&
        x.width == quality.getInt("width") &&
        x.height == quality.getInt("height")
    }

    return newQuality
  }

  fun setQuality(quality: ReadableMap?) {
    if (quality != null) {
      findQuality(quality)?.let {
        player?.quality = it
      }
    }
  }

  fun setAutoMaxQuality(quality: ReadableMap?) {
    if (quality != null) {
      findQuality(quality)?.let {
        player?.setAutoMaxQuality(it)
      }
    }
  }

  fun setAutoQualityMode(autoQualityMode: Boolean) {
    player?.isAutoQualityMode = autoQualityMode
  }

  fun setPipEnabled(_pipEnabled: Boolean) {
    pipEnabled = _pipEnabled
    if (!pipEnabled) togglePip()
  }

  fun onTextCue(cue: TextCue) {
    val reactContext = context as ReactContext

    val textCue = Arguments.createMap()
    textCue.putString("type", cue.javaClass.name)
    textCue.putDouble("line", cue.line.toDouble())
    textCue.putDouble("size", cue.size.toDouble())
    textCue.putDouble("position", cue.position.toDouble())
    textCue.putString("text", cue.text)
    textCue.putString("textAlignment", cue.textAlign.toStringValue())

    val data = Arguments.createMap()
    data.putMap("textCue", textCue)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.CUE,
        data
      )
    )
  }

  fun setMaxBitrate(bitrate: Int) {
    player?.setAutoMaxBitrate(bitrate)
  }

  fun setInitialBufferDuration(duration: Double) {
    val valueInMilliseconds = duration * 1000
    player?.setInitialBufferDuration(valueInMilliseconds.toLong())
  }


  fun onTextMetadataCue(cue: TextMetadataCue) {
    val reactContext = context as ReactContext

    val textMetadataCue = Arguments.createMap()
    textMetadataCue.putString("type", cue.javaClass.name)
    textMetadataCue.putString("text", cue.text)
    textMetadataCue.putString("description", cue.description)

    val data = Arguments.createMap()
    data.putMap("textMetadataCue", textMetadataCue)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.METADATA_CUE,
        data
      )
    )
  }

  fun onDurationChange(duration: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    val parsedDuration = getDuration(duration);
    data.putDouble("duration", parsedDuration)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.DURATION_CHANGED,
        data
      )
    )
  }

  fun onError(error: String) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putString("error", error)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.ERROR,
        data
      )
    )
  }

  fun onSeek(position: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putDouble("position", convertMilliSecondsToSeconds(position))

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.SEEK,
        data
      )
    )
  }

  fun onProgress(position: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putDouble("position", convertMilliSecondsToSeconds(position))

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.PROGRESS,
        data
      )
    )
  }

  fun onPipChange(active: Boolean) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putBoolean("active", active)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.PIP_CHANGED,
        data
      )
    )
  }

  private fun convertMilliSecondsToSeconds(milliSeconds: Long): Double {
    return milliSeconds / 1000.0
  }

  private val mLayoutRunnable = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
    )
    layout(left, top, right, bottom)
  }

  fun play() {
    player?.play()
  }

  fun pause() {
    player?.pause()
  }

  fun seekTo(position: Double) {
    val milliseconds = (position * 1000.0).toLong()
    player?.seekTo(milliseconds)
  }

  fun setOrigin(origin: String) {
    player?.setOrigin(origin)
  }

  fun preload(id: Int, url: String) {
    val mplayer = player as? MediaPlayer
    val uri = Uri.parse(url)

    mplayer?.preload(uri, object : Source.Listener {
      override fun onLoad(source: Source) {
        preloadSourceMap.put(id, source)
      }

      override fun onError(error: Source.LoadError) {
        Log.e("Preload", "Failed to preload source for id $id: ${error.message}")
      }
    })
  }

  fun loadSource(id: Int) {
    val source = preloadSourceMap.get(id)
    source?.let {
      val mplayer = player as? MediaPlayer
      mplayer?.loadSource(source)
    }
  }

  fun releaseSource(id: Int) {
    val source = preloadSourceMap.remove(id)
    source?.let {
      source.release()
    }
  }

  fun onPlayerStateChange(state: Player.State) {
    val reactContext = context as ReactContext
    this.keepScreenOn = (state == Player.State.PLAYING || state == Player.State.BUFFERING)

    when (state) {
      Player.State.PLAYING -> {
        if (!finishedLoading) {
          val data = Arguments.createMap()
          val parsedDuration = getDuration(player!!.duration);
          data.putDouble("duration", parsedDuration)
          finishedLoading = true

          eventDispatcher.dispatchEvent(
            IVSEvent(
              getSurfaceId(reactContext),
              id,
              Events.LOAD,
              data
            )
          )
        }
      }

      Player.State.READY -> {
        val data = Arguments.createMap()
        val playerData = Arguments.createMap()
        playerData.putString("version", player?.version)
        playerData.putString("sessionId", player?.sessionId)

        val qualities = Arguments.createArray()
        for (quality in player!!.qualities) {
          val parsedQuality = Arguments.createMap()
          parsedQuality.putString("name", quality.name)
          parsedQuality.putString("codecs", quality.codecs)
          parsedQuality.putInt("bitrate", quality.bitrate)
          parsedQuality.putDouble("framerate", quality.framerate.toDouble())
          parsedQuality.putInt("width", quality.width)
          parsedQuality.putInt("height", quality.height)
          qualities.pushMap(parsedQuality)
        }

        playerData.putArray("qualities", qualities)
        data.putMap("playerData", playerData)

        eventDispatcher.dispatchEvent(
          IVSEvent(
            getSurfaceId(reactContext),
            id,
            Events.DATA,
            data
          )
        )
      }

      else -> {}
    }

    val onStateChangeData = Arguments.createMap()
    onStateChangeData.putString("state", mapPlayerState(state))

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.STATE_CHANGED,
        onStateChangeData
      )
    )
  }

  fun onQualityChange(quality: Quality) {
    val reactContext = context as ReactContext

    val newQuality = Arguments.createMap()
    newQuality.putString("name", quality.name)
    newQuality.putString("codecs", quality.codecs)
    newQuality.putInt("bitrate", quality.bitrate)
    newQuality.putDouble("framerate", quality.framerate.toDouble())
    newQuality.putInt("width", quality.width)
    newQuality.putInt("height", quality.height)

    val data = Arguments.createMap()
    data.putMap("quality", newQuality)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.QUALITY_CHANGED,
        data
      )
    )
  }

  fun onVideoSizeChange(p0: Int, p1: Int) {
    val reactContext = context as ReactContext
    val size = Arguments.createMap()
    size.putInt("height", p0)
    size.putInt("width", p1)

    val data = Arguments.createMap()
    data.putMap("size", size)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.VIDEO_SIZE_CHANGE,
        data
      )
    )
  }

  fun onSeekComplete(success: Boolean) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putBoolean("success", success)

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.SEEK_COMPLETE,
        data
      )
    )
  }

  fun onPlayerRebuffering() {
    val reactContext = context as ReactContext

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.REBUFFERING,
        Arguments.createMap()
      )
    )
  }

  private fun intervalHandler() {
    val reactContext = context as ReactContext

    if (pipEnabled) {
      val activity: Activity? = reactContext.currentActivity
      val isPipActive = activity!!.isInPictureInPictureMode
      if (lastPipState !== isPipActive) {
        lastPipState = isPipActive
        onPipChange(isPipActive === true)
      }
    }

    if (lastLiveLatency != player?.liveLatency) {
      val liveLatencyData = Arguments.createMap()

      player?.liveLatency?.let { liveLatency ->
        liveLatencyData.putInt("liveLatency", liveLatency.toInt())
      } ?: run {
        liveLatencyData.putNull("liveLatency")
      }

      eventDispatcher.dispatchEvent(
        IVSEvent(
          getSurfaceId(reactContext),
          id,
          Events.LIVE_LATENCY_CHANGED,
          liveLatencyData
        )
      )

      lastLiveLatency = player?.liveLatency
    }


    if (lastBitrate != player?.averageBitrate || lastDuration != player?.duration) {
      val onVideoData = Arguments.createMap()
      val videoData = Arguments.createMap()

      player?.duration?.let { duration ->
        val parsedDuration = getDuration(duration)
        videoData.putDouble("duration", parsedDuration)
      } ?: run {
        videoData.putNull("duration")
      }

      player?.averageBitrate?.let { averageBitrate ->
        videoData.putInt("bitrate", averageBitrate.toInt())
      } ?: run {
        videoData.putNull("bitrate")
      }

      onVideoData.putMap("videoData", videoData)

      eventDispatcher.dispatchEvent(
        IVSEvent(
          getSurfaceId(reactContext),
          id,
          Events.VIDEO_STATISTICS,
          onVideoData
        )
      )

      lastBitrate = player?.averageBitrate
      lastDuration = player?.duration
    }
    player?.position?.let { position ->
      if (position > 0 && player?.state === Player.State.PLAYING) {
        onProgress(position)
      }

      val crossedBreakpoints = breakpoints.filter {
        it > lastPosition && it <= position
      }

      crossedBreakpoints.forEach { breakpointMs ->
        onTimePoint(breakpointMs)
      }

      lastPosition = position
    }
  }

  private fun getDuration(duration: Long): Double {
    return convertMilliSecondsToSeconds(duration)
  }

  private fun mapPlayerState(state: Player.State): String {
    return when (state) {
      Player.State.PLAYING -> "Playing"
      Player.State.BUFFERING -> "Buffering"
      Player.State.READY -> "Ready"
      Player.State.IDLE -> "Idle"
      Player.State.ENDED -> "Ended"
    }
  }

  fun togglePip() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N &&
      context.packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)
    ) {
      val activity: Activity? = context.currentActivity
      val hasToBuild = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O

      if (!pipEnabled) {

        val isInPip =
          if (hasToBuild) activity!!.isInPictureInPictureMode
          else activity!!.isInPictureInPictureMode
        if (isInPip) {
          activity?.moveTaskToBack(false)
        }
        return
      }

      if (hasToBuild) {
        val params = PictureInPictureParams.Builder().build()
        activity?.enterPictureInPictureMode(params)
      } else {
        activity?.enterPictureInPictureMode()
      }
    }
  }

  fun setBreakpoints(value: ReadableArray?) {
    val breakpoints: List<Double>? = value?.let { readableArray ->
      List(readableArray.size()) { index ->
        readableArray.getDouble(index)
      }
    }
    this.breakpoints = breakpoints?.map { (it * 1000.0).toLong() } ?: emptyList()
    this.lastPosition = 0
  }

  fun onTimePoint(position: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putDouble("position", convertMilliSecondsToSeconds(position))

    eventDispatcher.dispatchEvent(
      IVSEvent(
        getSurfaceId(reactContext),
        id,
        Events.TIME_POINT,
        data
      )
    )
  }

  fun setProgressInterval(progressInterval: Double) {
    playerObserver?.cancel()
    playerObserver?.purge()
    playerObserver = Timer("observerInterval", false)

    val updatedProgressInterval = (progressInterval * 1000).toLong()
    this.progressInterval = updatedProgressInterval

    playerObserver?.schedule(timerTask {
      intervalHandler()
    }, 0, updatedProgressInterval)
  }

  fun setMaxVideoSize(maxSize: ReadableMap?) {
    val width = maxSize?.getInt("width")
    val height = maxSize?.getInt("height")

    if (width != null && height != null) {
      player?.setAutoMaxVideoSize(width, height)
    }
  }

  fun setNetworkRecoveryMode(mode: String?) {
    player?.setNetworkRecoveryMode(findNetworkRecoveryMode((mode)))
  }

  override fun onHostResume() {
    isInBackground = false
    stopBackgroundService()

    if (wasPlayingBeforeBackground) {
      player?.play()
      wasPlayingBeforeBackground = false
    }
  }

  override fun onHostPause() {
    if (pipEnabled) {
      isInBackground = true
      togglePip()
    } else {
      if (playInBackground && player?.state == Player.State.PLAYING) {
        startBackgroundService(true)
        return
      }

      if (player?.state == Player.State.PLAYING || player?.state == Player.State.BUFFERING) {
        wasPlayingBeforeBackground = true
        player?.pause()
      } else {
        wasPlayingBeforeBackground = false
      }
    }
  }

  override fun onHostDestroy() {
    cleanup()
  }

  fun cleanup() {
    stopBackgroundService()
    // Cleanup any remaining sources
    for (source in preloadSourceMap.values) {
      source.release()
    }
    preloadSourceMap.clear()

    player?.removeListener(playerListener!!)
    player?.release()
    player = null

    playerObserver?.cancel()
    playerObserver = null

    if (controlReceiver != null) {
      context.unregisterReceiver(controlReceiver)
      controlReceiver = null
    }
  }

  fun TextCue.TextAlignment.toStringValue(): String {
    return when (this) {
      TextCue.TextAlignment.START -> "start"
      TextCue.TextAlignment.MIDDLE -> "center"
      TextCue.TextAlignment.END -> "end"
    }
  }

  private fun checkAndRequestNotificationPermission() {
    if (Build.VERSION.SDK_INT >= 33) {
      val reactContext = context as ReactContext
      val activity = reactContext.currentActivity

      if (ContextCompat.checkSelfPermission(
          reactContext,
          Manifest.permission.POST_NOTIFICATIONS
        ) != PackageManager.PERMISSION_GRANTED
      ) {
        activity?.let {
          ActivityCompat.requestPermissions(
            it,
            arrayOf(Manifest.permission.POST_NOTIFICATIONS),
            101
          )
        }
      }
    }
  }

  private fun findNetworkRecoveryMode(mode: String?): Player.NetworkRecoveryMode {
    return when (mode) {
      "none" -> Player.NetworkRecoveryMode.NONE
      "resume" -> Player.NetworkRecoveryMode.RESUME
      else -> Player.NetworkRecoveryMode.NONE
    }
  }

}
