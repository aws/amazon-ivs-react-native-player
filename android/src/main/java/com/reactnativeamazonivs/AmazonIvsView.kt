package com.reactnativeamazonivs

import android.net.Uri
import android.util.Log
import android.widget.FrameLayout
import com.amazonaws.ivs.player.*
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import java.math.BigDecimal
import java.util.concurrent.TimeUnit

class AmazonIvsView(private val context: ThemedReactContext) : FrameLayout(context) {
  private var playerView: PlayerView? = null
  private var player: Player? = null
  private var streamUri: Uri? = null

  enum class Events(private val mName: String) {
    STATE_CHANGED("onPlayerStateChange"),
    DURATION_CHANGED("onDurationChange");

    override fun toString(): String {
      return mName
    }
  }

  init {
    playerView = PlayerView(context)
    player = playerView!!.player

    val playerListener = object : Player.Listener() {
      override fun onStateChanged(state: Player.State) {
        onPlayerStateChange(state)
      }

      override fun onDurationChanged(duration: Long) {
        onDurationChange(duration)
      }

      override fun onRebuffering() {
        // TODO: implement
        Log.i("PLAYER", "onRebuffering");
      }

      override fun onSeekCompleted(p0: Long) {
        // TODO: implement
        Log.i("PLAYER", "onSeekCompleted");
      }

      override fun onQualityChanged(p0: Quality) {
        // TODO: implement
        Log.i("PLAYER", "onQualityChanged");
      }

      override fun onVideoSizeChanged(p0: Int, p1: Int) {
        post(mLayoutRunnable)
      }

      override fun onCue(p0: Cue) {
        // TODO: implement
        Log.i("PLAYER", "onCue");
      }

      override fun onError(e: PlayerException) {
        // TODO: implement
        Log.e("PLAYER", e.errorMessage)
      }
    }

    player!!.addListener(playerListener);
    addView(playerView)
  }

  fun setStreamUrl(streamUrl: String) {
    player?.let { player ->
      val uri = Uri.parse(streamUrl);
      this.streamUri = uri;
      player.load(uri)
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

  fun onPlayerStateChange(state: Player.State) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putInt("state", state.ordinal)

    when (state) {
      Player.State.READY -> {
        // TODO: handle paused (etc.) props here
        player!!.play()
      };
    }

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.STATE_CHANGED.toString(), data)
  }
  
  fun onDurationChange(duration: Long) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putInt("duration", TimeUnit.MILLISECONDS.toSeconds(duration).toInt())

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.DURATION_CHANGED.toString(), data)
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
}
