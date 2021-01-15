package com.reactnativeamazonivs

import android.net.Uri
import android.util.Log
import android.widget.FrameLayout
import com.amazonaws.ivs.player.*
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import java.nio.ByteBuffer
import java.util.concurrent.TimeUnit

class AmazonIvsView(private val context: ThemedReactContext) : FrameLayout(context) {
  private var playerView: PlayerView? = null
  private var player: Player? = null
  private var streamUri: Uri? = null

  enum class Events(private val mName: String) {
    STATE_CHANGED("onPlayerStateChange"),
    DURATION_CHANGED("onDurationChange"),
    ERROR("onError"),
    QUALITY_CHANGED("onQualityChange"),
    CUE("onTextCue"),
    METADATA_CUE("onTextMetadataCue"),
    LOAD("onLoad"),
    LOAD_START("onLoadStart"),
    REBUFFER("onBuffer");

    override fun toString(): String {
      return mName
    }
  }

  init {
    playerView = PlayerView(context)
    player = playerView!!.player

    playerView?.controlsEnabled = false

    val playerListener = object : Player.Listener() {
      override fun onStateChanged(state: Player.State) {
        onPlayerStateChange(state)
      }

      override fun onDurationChanged(duration: Long) {
        onDurationChange(duration)
      }

      override fun onRebuffering() {
        onBuffer()
      }

      override fun onSeekCompleted(p0: Long) {
        // TODO: implement
        Log.i("PLAYER", "onSeekCompleted");
      }

      override fun onQualityChanged(quality: Quality) {
        onQualityChange(quality)
      }

      override fun onVideoSizeChanged(p0: Int, p1: Int) {
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
        onError(e.errorMessage)
      }
    }

    player!!.addListener(playerListener);
    addView(playerView)
  }

  fun setStreamUrl(streamUrl: String) {
    player?.let { player ->
      val reactContext = context as ReactContext
      val uri = Uri.parse(streamUrl);
      this.streamUri = uri;
      player.load(uri)

      reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.LOAD_START.toString(), Arguments.createMap())
    }
  }

  fun setMuted(muted: Boolean) {
    player?.isMuted = muted
  }

  fun setVolume(volume: Double) {
    player?.setVolume(volume.toFloat())
  }

  fun setLiveLowLatency(liveLowLatency: Boolean) {
    player?.setLiveLowLatencyEnabled(liveLowLatency)
  }

  fun setPlaybackRate(playbackRate: Double) {
    player?.playbackRate = playbackRate.toFloat()
  }

  fun setLooping(looping: Boolean) {
    player?.setLooping(looping)
  }

  fun setLogLevel(logLevel: Double) {
    when (logLevel.toInt()) {
      0 -> player?.setLogLevel(Player.LogLevel.DEBUG)
      1 -> player?.setLogLevel(Player.LogLevel.INFO)
      2 -> player?.setLogLevel(Player.LogLevel.WARNING)
      3 -> player?.setLogLevel(Player.LogLevel.ERROR)
    }
  }

  private fun findQuality(quality: ReadableMap?): Quality? {
    val newQuality = player?.qualities?.first { x ->
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
      player?.quality = findQuality(quality)!!
    }
  }

  fun setAutoMaxQuality(quality: ReadableMap?) {
    if (quality != null) {
      player?.setAutoMaxQuality(findQuality(quality)!!)
    }
  }

  fun setAutoQualityMode(autoQualityMode: Boolean) {
    player?.isAutoQualityMode = autoQualityMode
  }

  fun onTextCue(cue: TextCue) {
    val reactContext = context as ReactContext

    val textCue = Arguments.createMap()
    textCue.putString("type", cue.javaClass.name)
    textCue.putDouble("line", cue.line.toDouble())
    textCue.putDouble("size", cue.size.toDouble())
    textCue.putDouble("position", cue.position.toDouble())
    textCue.putString("text", cue.text)
    textCue.putInt("textAlignment", cue.textAlign.ordinal)

    val data = Arguments.createMap()
    data.putMap("textCue", textCue)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.CUE.toString(), data)
  }

  fun setInitialBitrate(bitrate: Double) {
    player?.setAutoInitialBitrate(bitrate.toInt())
  }

  fun setMaxBitrate(bitrate: Double) {
    player?.setAutoMaxBitrate(bitrate.toInt())
  }

  fun onTextMetadataCue(cue: TextMetadataCue) {
    val reactContext = context as ReactContext

    val textMetadataCue = Arguments.createMap()
    textMetadataCue.putString("type", cue.javaClass.name)
    textMetadataCue.putString("text", cue.text)
    textMetadataCue.putString("description", cue.description)

    val data = Arguments.createMap()
    data.putMap("textMetadataCue", textMetadataCue)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.METADATA_CUE.toString(), data)
  }

  fun onDurationChange(duration: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putInt("duration", TimeUnit.MILLISECONDS.toSeconds(duration).toInt())

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.DURATION_CHANGED.toString(), data)
  }

  fun onError(error: String) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putString("error", error)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.ERROR.toString(), data)
  }

  private val mLayoutRunnable = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
    layout(left, top, right, bottom)
  }

  fun play() {
    player?.play()
  }

  fun pause() {
    player?.pause()
  }

  fun seekTo(position: Long) {
    player?.seekTo(TimeUnit.SECONDS.toMillis(position))
  }

  fun onPlayerStateChange(state: Player.State) {
    val reactContext = context as ReactContext

    when (state) {
      Player.State.PLAYING -> {
        val onLoadData = Arguments.createMap()
        if (player!!.duration > 0) {
          onLoadData.putInt("duration", TimeUnit.MILLISECONDS.toSeconds(player!!.duration).toInt())
        } else {
          onLoadData.putNull("duration")
        }

        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.LOAD.toString(), onLoadData)
      }
      Player.State.READY -> {
        // TODO: handle paused (etc.) props here
        player!!.play()
      };
    }

    val onStateChangeData = Arguments.createMap()
    onStateChangeData.putInt("state", state.ordinal)
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.STATE_CHANGED.toString(), onStateChangeData)
  }

  fun onQualityChange(quality: Quality) {
    val reactContext = context as ReactContext

    val newQuality = Arguments.createMap()
    newQuality.putString("name", quality.name)
    newQuality.putString("codecs", quality.codecs)
    newQuality.putInt("bitrate", quality.bitrate)
    newQuality.putInt("framerate", quality.framerate.toInt())
    newQuality.putInt("width", quality.width)
    newQuality.putInt("height", quality.height)

    val data = Arguments.createMap()
    data.putMap("quality", newQuality)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.QUALITY_CHANGED.toString(), data)
  }

  fun onBuffer() {
    val reactContext = context as ReactContext
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.REBUFFER.toString(), Arguments.createMap())
  }
}
