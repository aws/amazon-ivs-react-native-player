package com.amazonaws.ivs.reactnative.player

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class IVSEvent(
  surfaceId: Int,
  viewTag: Int,
  jsEventName: AmazonIvsView.Events,
  private val payload: WritableMap?
) : Event<IVSEvent>(surfaceId, viewTag) {
  private val nativeEventName = jsEventName.toString()
  override fun getEventName() = nativeEventName
  override fun getEventData() = payload
}
