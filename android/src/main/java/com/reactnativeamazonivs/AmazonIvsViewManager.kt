package com.reactnativeamazonivs

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmazonIvsViewManager : SimpleViewManager<AmazonIvsView>()  {
  override fun getName() = "AmazonIvs"

  @ReactProp(name = "streamUrl")
  fun setStreamUrl(view: AmazonIvsView, streamUrl: String) {
    view.setStreamUrl(streamUrl);
  }

  @ReactProp(name = "muted")
  fun setMuted(view: AmazonIvsView, muted: Boolean) {
    view.setMuted(muted)
  }

  override fun createViewInstance(reactContext: ThemedReactContext): AmazonIvsView {
    return AmazonIvsView(reactContext)
  }
}
