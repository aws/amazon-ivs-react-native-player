import Foundation
import UIKit
import AmazonIVSPlayer

@objc(AmazonIvsView)
class AmazonIvsView: UIView, IVSPlayer.Delegate{
    @objc var onSeek: RCTDirectEventBlock?
    @objc var onData: RCTDirectEventBlock?
    @objc var onPlayerStateChange: RCTDirectEventBlock?
    @objc var onDurationChange: RCTDirectEventBlock?
    @objc var onQualityChange: RCTDirectEventBlock?
    @objc var onBuffer: RCTDirectEventBlock?
    @objc var onLoadStart: RCTDirectEventBlock?
    @objc var onLoad: RCTDirectEventBlock?

    @objc var onLiveLatencyChange: RCTDirectEventBlock?

    private let player = IVSPlayer()
    private let playerView = IVSPlayerView()
    private var finishedLoading: Bool = false;

    private var liveLatencyObserverToken: Any?
    private var oldQualities: [IVSQuality] = [];
    
    override init(frame: CGRect) {
        self.muted = player.muted
        self.looping = player.looping
        self.liveLowLatency = player.isLiveLowLatency
        self.playbackRate = NSNumber(value: player.playbackRate)
        super.init(frame: frame)
        self.addSubview(self.playerView)
        self.playerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        self.addLiveLatencyObserver()

        if let url = self.streamUrl {
            self.load(urlString: url)
        }
    }

    deinit {
        self.removeLiveLatencyObserver()
    }

    func load(urlString: String) {
        finishedLoading = false
        player.delegate = self
        let url = URL(string: urlString)!

        self.playerView.player = player
        onLoadStart?(["": NSNull()])
        player.load(url)

        //TODO: remove below after implementing autoplay prop
        player.play()
    }

    @objc var muted: Bool {
        didSet {
            player.muted = muted
        }
    }

    @objc var playbackRate: NSNumber {
        didSet {
            player.playbackRate = Float(truncating: playbackRate)
        }
    }

    @objc var looping: Bool {
        didSet {
            player.looping = looping
        }
    }

    @objc var liveLowLatency: Bool {
        didSet {
            player.setLiveLowLatencyEnabled(liveLowLatency)
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

    @objc func seek(position: NSNumber) {
        let parsedTime = CMTimeMakeWithSeconds(Float64(truncating: position), preferredTimescale: 1000000)
        player.seek(to: parsedTime)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func addLiveLatencyObserver() {
        liveLatencyObserverToken = player.addPeriodicTimeObserver(forInterval: CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC)), queue: .main) {
            time in
            self.onLiveLatencyChange!(["liveLatency": self.player.liveLatency.value])
        }
    }

    func removeLiveLatencyObserver() {
        if let liveLatencyObserverToken = liveLatencyObserverToken {
            player.removeTimeObserver(liveLatencyObserverToken)
            self.liveLatencyObserverToken = nil
        }
    }
    func player(_ player: IVSPlayer, didSeekTo time: CMTime) {
        onSeek?(["position": CMTimeGetSeconds(time)])
    }

    func player(_ player: IVSPlayer, didChangeState state: IVSPlayer.State) {
        onPlayerStateChange?(["state": state.rawValue])

        if state == IVSPlayer.State.playing, finishedLoading == false {
            if player.duration.isNumeric {
                onLoad?(["duration": player.duration.seconds])
            } else {
                onLoad?(["duration": NSNull()])
            }
            finishedLoading = true
        }
        
        if state == IVSPlayer.State.ready {
            if player.qualities != oldQualities {
                let qualities: NSMutableArray = []
                for quality in player.qualities {
                    let qualityData: [String: Any ] = [
                        "name": quality.name,
                        "codecs": quality.codecs,
                        "bitrate": quality.bitrate,
                        "framerate": quality.framerate,
                        "width": quality.width,
                        "height": quality.height
                    ]
                    
                    qualities.add(qualityData)
                }
                
                onData?([
                    "qualities": qualities,
                    "version": player.version,
                    "sessionId": player.sessionId
                ])
            }

            oldQualities = player.qualities
        }
    }

    func player(_ player: IVSPlayer, didChangeDuration duration: CMTime) {
        if onDurationChange != nil {
            if duration.isNumeric {
                // TODO: not sure about the expected return format, it returns seconds at the moment
                onDurationChange!(["duration": CMTimeGetSeconds(duration)])
            } else {
                onDurationChange!(["duration": NSNull()])
            }
        }
    }

    func player(_ player: IVSPlayer, didChangeQuality quality: IVSQuality?) {
        if onQualityChange != nil {
            if quality == nil {
                onQualityChange!(["quality": NSNull()])
            } else {
                let qualityData: [String: Any ] = [
                    "name": quality?.name ?? "",
                    "codecs": quality?.codecs ?? "",
                    "bitrate": quality?.bitrate ?? 0,
                    "framerate": quality?.framerate ?? 0,
                    "width": quality?.width ?? 0,
                    "height": quality?.height ?? 0
                ]

                onQualityChange!(qualityData)
            }
        }
    }

    func playerWillRebuffer(_ player: IVSPlayer) {
        onBuffer?(["": NSNull()])
    }
}
