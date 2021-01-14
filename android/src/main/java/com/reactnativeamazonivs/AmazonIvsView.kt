package com.reactnativeamazonivs

import android.net.Uri
import android.util.Log
import android.widget.FrameLayout
import com.amazonaws.ivs.player.*
import com.facebook.react.uimanager.ThemedReactContext

class AmazonIvsView(private val context: ThemedReactContext) : FrameLayout(context) {
  private var mPlayerView: PlayerView? = null
  private var mPlayer: Player? = null
  private var streamUri: Uri? = null

  init {
    mPlayerView = PlayerView(context)
    mPlayer = mPlayerView!!.player

    val playerListener = object : Player.Listener() {
      override fun onStateChanged(state: Player.State) {
        Log.i("PLAYER", state.toString());
        when (state) {
          Player.State.READY -> {
            // TODO: handle paused (etc.) props here
            mPlayer!!.play()
          };
        }
      }

      override fun onDurationChanged(duration: Long) {
        // TODO: implement
        Log.i("PLAYER", "onDurationChanged");
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

    mPlayer!!.addListener(playerListener);
    addView(mPlayerView)
  }

  fun setStreamUrl(streamUrl: String) {
    mPlayer?.let { player ->
      val uri = Uri.parse(streamUrl);
      this.streamUri = uri;
      player.load(uri)
    }
  }

  fun setMuted(muted: Boolean) {
    mPlayer?.isMuted = muted
  }

  private val mLayoutRunnable = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
    layout(left, top, right, bottom)
  }
}
