import Foundation
import UIKit
import AmazonIVSPlayer

@objc(AmazonIvsView)
class AmazonIvsView: UIView, IVSPlayer.Delegate{
    @objc var onSeek: RCTDirectEventBlock?
    @objc var onPlayerStateChange: RCTDirectEventBlock?

    private let player = IVSPlayer()
    private let playerView = IVSPlayerView()

    override init(frame: CGRect) {
        self.muted = player.muted
        self.looping = player.looping
        super.init(frame: frame)
        self.addSubview(self.playerView)
        self.playerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]

        if let url = self.streamUrl {
            self.load(urlString: url)
        }
    }

    func load(urlString: String) {
        player.delegate = self
        let url = URL(string: urlString)!

        self.playerView.player = player
        player.load(url)

        //TODO: remove below after implementing autoplay prop
        player.play()
    }

    @objc var muted: Bool {
        didSet {
            player.muted = muted
        }
    }
    
    @objc var looping: Bool {
        didSet {
            player.looping = looping
        }
    }

    @objc var streamUrl: String? {
        didSet {
            if let url = streamUrl {
                self.load(urlString: url)
            }
        }
    }

    @objc func play() {
        player.play()
    }

    @objc func pause() {
        player.pause()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func player(_ player: IVSPlayer, didSeekTo time: CMTime) {
        onSeek?(["position": CMTimeGetSeconds(time)])
    }

    func player(_ player: IVSPlayer, didChangeState state: IVSPlayer.State) {
        onPlayerStateChange?(["state": state.rawValue])
    }
}
