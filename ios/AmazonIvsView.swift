import Foundation
import UIKit
import AmazonIVSPlayer

@objc(AmazonIvsView)
class AmazonIvsView: UIView, IVSPlayer.Delegate{
    private let player = IVSPlayer()
    private let playerView = IVSPlayerView()
    
    override init(frame: CGRect) {
        super.init(frame: frame);
        self.addSubview(self.playerView);
        self.playerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        
        // TODO: probably we should not load url and play videa in init
        self.load(urlString: "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8")
    }
    
    func load(urlString: String) {
        player.delegate = self
        let url = URL(string: urlString)!
        
        self.playerView.player = player
        player.load(url)
        player.play()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
