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
    
    @objc func seekTo(_ node: NSNumber, position: Double) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.seek(position: position)
        }
    }
    
    @objc func togglePip(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.togglePip()
        }
    }
}
