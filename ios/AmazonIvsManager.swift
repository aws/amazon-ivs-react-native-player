import Foundation

@objc(AmazonIvsManager)
class AmazonIvsManager: RCTViewManager {
  override func view() -> UIView! {
    return AmazonIvsView()
  }
}
