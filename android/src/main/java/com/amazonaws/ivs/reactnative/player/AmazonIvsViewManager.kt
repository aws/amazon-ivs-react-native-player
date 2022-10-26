package com.amazonaws.ivs.reactnative.player

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>() {
  private enum class Commands {
    PLAY,
    PAUSE,
    SEEK_TO,
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
    return MapBuilder.of(
      "play",
      Commands.PLAY.ordinal,
      "pause",
      Commands.PAUSE.ordinal,
      "seekTo",
      Commands.SEEK_TO.ordinal,
      "togglePip",
      Commands.TOGGLE_PIP.ordinal
    )
  }

  override fun receiveCommand(view: AmazonIvsView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PLAY.ordinal -> view.play()
      Commands.PAUSE.ordinal -> view.pause()
      Commands.TOGGLE_PIP.ordinal -> view.togglePip()
      Commands.SEEK_TO.ordinal -> {
        args?.getInt(0)?.let { position ->
          view.seekTo(position.toLong())
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
