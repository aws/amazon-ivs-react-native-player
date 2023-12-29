import React 

@objc(AmazonIvsEventEmitter)
class AmazonIvsEventEmitter: RCTEventEmitter {
    
    override init() {
        super.init()
    }

    override func supportedEvents() -> [String]! {
        return ["onPipModeChanged"]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // Helper method to emit events
    func emitPipModeChanged(isPipModeEnabled: Bool) {
        sendEvent(withName: "onPipModeChanged", body: ["isPipModeEnabled": isPipModeEnabled])
    }

    
}