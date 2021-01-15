package com.reactnativeamazonivs

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>()  {
  private enum class Commands {
    PLAY,
    PAUSE,
    SEEK_TO
  }

  override fun getName() = "AmazonIvs"

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return MapBuilder.of(
      AmazonIvsView.Events.STATE_CHANGED.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.STATE_CHANGED.toString()),
      AmazonIvsView.Events.DURATION_CHANGED.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.DURATION_CHANGED.toString()),
      AmazonIvsView.Events.ERROR.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.ERROR.toString()),
      AmazonIvsView.Events.QUALITY_CHANGED.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.QUALITY_CHANGED.toString()))
  }

  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      "play",
      Commands.PLAY.ordinal,
      "pause",
      Commands.PAUSE.ordinal,
      "seekTo",
      Commands.SEEK_TO.ordinal
    )
  }

  override fun receiveCommand(view: AmazonIvsView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PLAY.ordinal -> view.play()
      Commands.PAUSE.ordinal -> view.pause()
      Commands.SEEK_TO.ordinal -> {
        args?.getInt(0)?.let { position ->
          view.seekTo(position.toLong())
        }
      }
      else -> {}
    }
  }

  @ReactProp(name = "streamUrl")
  fun setStreamUrl(view: AmazonIvsView, streamUrl: String) {
    view.setStreamUrl(streamUrl);
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

  @ReactProp(name = "looping")
  fun setLooping(view: AmazonIvsView, looping: Boolean) {
    view.setLooping(looping)
  }

  @ReactProp(name = "logLevel")
  fun setLogLevel(view: AmazonIvsView, logLevel: Double) {
    view.setVolume(logLevel)
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

  override fun createViewInstance(reactContext: ThemedReactContext): AmazonIvsView {
    return AmazonIvsView(reactContext)
  }
}
