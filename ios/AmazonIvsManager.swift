import Foundation

@objc(AmazonIvsManager)
class AmazonIvsManager: RCTViewManager {
  override func view() -> UIView! {
    return AmazonIvsView()
  }
    
    @objc func play(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.play()
        }
    }

    @objc func pause(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.pause()
        }
    }
}
