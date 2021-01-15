package com.reactnativeamazonivs

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>()  {
  private enum class Commands {
    PLAY,
    PAUSE
  }

  override fun getName() = "AmazonIvs"

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return MapBuilder.of(
      AmazonIvsView.Events.STATE_CHANGED.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.STATE_CHANGED.toString()),
      AmazonIvsView.Events.DURATION_CHANGED.toString(), MapBuilder.of("registrationName", AmazonIvsView.Events.DURATION_CHANGED.toString()))
  }

  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      "play",
      Commands.PLAY.ordinal,
      "pause",
      Commands.PAUSE.ordinal
    )
  }

  override fun receiveCommand(view: AmazonIvsView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PLAY.ordinal -> view.play()
      Commands.PAUSE.ordinal -> view.pause()
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

  override fun createViewInstance(reactContext: ThemedReactContext): AmazonIvsView {
    return AmazonIvsView(reactContext)
  }
}