package com.amazonaws.ivs.reactnative.player

import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>() {
  private enum class Commands {
    PRELOAD,
    LOAD_SOURCE,
    RELEASE_SOURCE,
    PLAY,
    PAUSE,
    SEEK_TO,
    SET_ORIGIN,
    TOGGLE_PIP
  }

  override fun getName() = "AmazonIvs"

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
    val builder: MapBuilder.Builder<String, Map<String, String>> = MapBuilder.builder<String, Map<String, String>>()
    for (event in AmazonIvsView.Events.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()))
    }
    return builder.build()
  }

  override fun getCommandsMap(): Map<String, Int>? {
    return mapOf(
      "preload" to Commands.PRELOAD.ordinal,
      "loadSource" to Commands.LOAD_SOURCE.ordinal,
      "releaseSource" to Commands.RELEASE_SOURCE.ordinal,
      "play" to Commands.PLAY.ordinal,
      "pause" to Commands.PAUSE.ordinal,
      "setOrigin" to Commands.SET_ORIGIN.ordinal,
      "seekTo" to Commands.SEEK_TO.ordinal,
      "togglePip" to Commands.TOGGLE_PIP.ordinal
    )
  }

  override fun receiveCommand(view: AmazonIvsView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PRELOAD.ordinal -> {
        val id = args?.getInt(0)
        val url = args?.getString(1)
        id?.let {
          url?.let {
            view.preload(id, url)
          }
        }
      }
      Commands.LOAD_SOURCE.ordinal -> {
        val id = args?.getInt(0)
        id?.let {
          view.loadSource(id)
        }
      }
      Commands.RELEASE_SOURCE.ordinal -> {
        val id = args?.getInt(0)
        id?.let {
          view.releaseSource(id)
        }
      }
      Commands.PLAY.ordinal -> view.play()
      Commands.PAUSE.ordinal -> view.pause()
      Commands.TOGGLE_PIP.ordinal -> view.togglePip()
      Commands.SET_ORIGIN.ordinal -> {
        args?.getString(0)?.let {
          origin ->
            view.setOrigin(origin)
        }
      }
      Commands.SEEK_TO.ordinal -> {
        args?.getDouble(0)?.let { position ->
          view.seekTo(position)
        }
      }
      else -> {
      }
    }
  }

  @ReactProp(name = "streamUrl")
  fun setStreamUrl(view: AmazonIvsView, streamUrl: String) {
    view.setStreamUrl(streamUrl);
  }

  @ReactProp(name = "loop")
  fun setLooping(view: AmazonIvsView, shouldLoop: Boolean){
    view.setLooping(shouldLoop);
  }

  @ReactProp(name = "resizeMode")
  fun setResizeMode(view: AmazonIvsView, mode: String) {
    view.setResizeMode(mode);
  }

  @ReactProp(name = "muted")
  fun setMuted(view: AmazonIvsView, muted: Boolean) {
    view.setMuted(muted)
  }

  @ReactProp(name = "volume")
  fun setVolume(view: AmazonIvsView, volume: Double) {
    view.setVolume(volume)
  }

  @ReactProp(name = "liveLowLatency")
  fun setLiveLowLatency(view: AmazonIvsView, liveLowLatency: Boolean) {
    view.setLiveLowLatency(liveLowLatency)
  }

  @ReactProp(name = "rebufferToLive")
  fun setRebufferToLive(view: AmazonIvsView, rebufferToLive: Boolean) {
    view.setRebufferToLive(rebufferToLive)
  }

  @ReactProp(name = "playbackRate")
  fun setPlaybackRate(view: AmazonIvsView, playbackRate: Double) {
    view.setPlaybackRate(playbackRate)
  }

  @ReactProp(name = "logLevel")
  fun setLogLevel(view: AmazonIvsView, logLevel: Double) {
    view.setLogLevel(logLevel)
  }

  @ReactProp(name = "quality")
  fun setQuality(view: AmazonIvsView, quality: ReadableMap?) {
    view.setQuality(quality)
  }

  @ReactProp(name = "autoMaxQuality")
  fun setAutoMaxQuality(view: AmazonIvsView, quality: ReadableMap?) {
    view.setAutoMaxQuality(quality)
  }

  @ReactProp(name = "autoQualityMode")
  fun setAutoQualityMode(view: AmazonIvsView, autoQualityMode: Boolean) {
    view.setAutoQualityMode(autoQualityMode)
  }

  @ReactProp(name = "pipEnabled")
  fun setPipEnabled(view: AmazonIvsView, pipEnabled: Boolean) {
    view.setPipEnabled(pipEnabled)
  }

  @ReactProp(name = "maxBitrate")
  fun setMaxBitrate(view: AmazonIvsView, bitrate: Double) {
    view.setMaxBitrate(bitrate)
  }

  @ReactProp(name = "initialBufferDuration")
  fun setInitialBufferDuration(view: AmazonIvsView, duration: Double) {
    view.setInitialBufferDuration(duration)
  }

  override fun createViewInstance(reactContext: ThemedReactContext): AmazonIvsView {
    return AmazonIvsView(reactContext)
  }

  override fun onDropViewInstance(view: AmazonIvsView) {
    super.onDropViewInstance(view)
    view.cleanup()
  }
}
