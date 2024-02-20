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
    
    @objc func setOrigin(_ node: NSNumber, origin: NSString) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.setOrigin(origin: origin)
        }
    }
    
    @objc func togglePip(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.togglePip()
        }
    }

    @objc func preload(_ node: NSNumber, id: NSNumber, url: NSString) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.preload(id: id.intValue, url: url)
        }
    }

    @objc func loadSource(_ node: NSNumber, id: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.loadSource(id: id.intValue)
        }
    }

    @objc func releaseSource(_ node: NSNumber, id: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! AmazonIvsView
            component.releaseSource(id: id.intValue)
        }
    }
}
