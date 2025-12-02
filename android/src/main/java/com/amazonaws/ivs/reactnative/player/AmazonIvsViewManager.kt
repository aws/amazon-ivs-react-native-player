package com.amazonaws.ivs.reactnative.player

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.AmazonIvsManagerDelegate
import com.facebook.react.viewmanagers.AmazonIvsManagerInterface

@ReactModule(name = AmazonIvsViewManager.NAME)
class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>(),
  AmazonIvsManagerInterface<AmazonIvsView> {

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

  private val mDelegate: ViewManagerDelegate<AmazonIvsView> = AmazonIvsManagerDelegate(this)

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Map<String, String>> {
    val builder: MapBuilder.Builder<String, Map<String, String>> =
      MapBuilder.builder<String, Map<String, String>>()
    for (event in AmazonIvsView.Events.entries) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()))
    }
    return builder.build().toMutableMap()
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

  override fun receiveCommand(
    view: AmazonIvsView,
    commandId: String,
    args: ReadableArray
  ) {
    mDelegate.receiveCommand(view, commandId, args)
  }


  override fun getDelegate(): ViewManagerDelegate<AmazonIvsView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): AmazonIvsView {
    return AmazonIvsView(context)
  }


  override fun setMuted(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setMuted(value)
  }

  override fun setLoop(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setLooping(value)
  }

  override fun setStreamUrl(view: AmazonIvsView?, streamUrl: String?) {
    if (streamUrl != null) {
      view?.setStreamUrl(streamUrl);
    }
  }

  override fun setLiveLowLatency(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setLiveLowLatency(value)
  }

  override fun setRebufferToLive(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setRebufferToLive(value)
  }

  override fun setPlaybackRate(
    view: AmazonIvsView?,
    value: Double
  ) {
    view?.setPlaybackRate(value)
  }

  override fun setLogLevel(
    view: AmazonIvsView?,
    value: Int
  ) {
    view?.setLogLevel(value)
  }

  override fun setResizeMode(
    view: AmazonIvsView?,
    value: String?
  ) {
    view?.setResizeMode(value)
  }

  override fun setVolume(
    view: AmazonIvsView?,
    value: Double
  ) {
    view?.setVolume(value)
  }

  override fun setQuality(
    view: AmazonIvsView?,
    value: ReadableMap?
  ) {
    view?.setQuality(value)
  }

  override fun setAutoMaxQuality(
    view: AmazonIvsView?,
    value: ReadableMap?
  ) {
    view?.setAutoMaxQuality(value)
  }

  override fun setAutoQualityMode(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setAutoQualityMode(value)
  }

  override fun setBreakpoints(
    view: AmazonIvsView?,
    value: ReadableArray?
  ) {
    view?.setBreakpoints(value)
  }

  override fun setMaxBitrate(
    view: AmazonIvsView?,
    value: Int
  ) {
    view?.setMaxBitrate(value)
  }

  override fun setInitialBufferDuration(
    view: AmazonIvsView?,
    value: Double
  ) {
    view?.setInitialBufferDuration(value)
  }

  override fun setPipEnabled(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setPipEnabled(value)
  }

  override fun setProgressInterval(
    view: AmazonIvsView?,
    value: Double
  ) {
    view?.setProgressInterval(value)
  }

  override fun setPlayInBackground(
    view: AmazonIvsView?,
    value: Boolean
  ) {
    view?.setPlayInBackground(value)
  }

  override fun setNotificationTitle(
    view: AmazonIvsView?,
    value: String?
  ) {
    view?.setNotificationTitle(value)
  }

  override fun setNotificationText(
    view: AmazonIvsView?,
    value: String?
  ) {
    view?.setNotificationText(value)
  }

  override fun preload(
    view: AmazonIvsView?,
    url: String,
    sourceId: Int
  ) {
    view?.preload(sourceId, url)
  }

  override fun loadSource(
    view: AmazonIvsView?,
    sourceId: Int
  ) {
    view?.loadSource(sourceId)
  }

  override fun releaseSource(
    view: AmazonIvsView?,
    sourceId: Int
  ) {
    view?.releaseSource(sourceId)
  }


  override fun play(view: AmazonIvsView?) {
    view?.play()
  }

  override fun pause(view: AmazonIvsView?) {
    view?.pause()
  }

  override fun seekTo(
    view: AmazonIvsView?,
    value: Double
  ) {
    view?.seekTo(value)
  }

  override fun setOrigin(
    view: AmazonIvsView?,
    value: String?
  ) {
    if (value != null) {
      view?.setOrigin(value)
    }
  }

  override fun togglePip(view: AmazonIvsView?) {
    view?.togglePip()
  }

  companion object {
    const val NAME = "AmazonIvs"
  }
}
