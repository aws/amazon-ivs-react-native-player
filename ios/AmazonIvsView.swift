import Foundation
import UIKit
import AmazonIVSPlayer

@objc(AmazonIvsView)
class AmazonIvsView: UIView, IVSPlayer.Delegate {
    @objc var onSeek: RCTDirectEventBlock?
    @objc var onData: RCTDirectEventBlock?
    @objc var onPlayerStateChange: RCTDirectEventBlock?
    @objc var onDurationChange: RCTDirectEventBlock?
    @objc var onQualityChange: RCTDirectEventBlock?
    @objc var onBuffer: RCTDirectEventBlock?
    @objc var onLoadStart: RCTDirectEventBlock?
    @objc var onLoad: RCTDirectEventBlock?
    @objc var onTextCue: RCTDirectEventBlock?
    @objc var onTextMetadataCue: RCTDirectEventBlock?
    @objc var onBandwidthEstimateChange: RCTDirectEventBlock?
    @objc var onLiveLatencyChange: RCTDirectEventBlock?
    @objc var onProgress: RCTDirectEventBlock?

    @objc var onError: RCTDirectEventBlock?

    private let player = IVSPlayer()
    private let playerView = IVSPlayerView()
    private var finishedLoading: Bool = false;

    private var progressObserverToken: Any?
    private var playerObserverToken: Any?
    private var oldQualities: [IVSQuality] = [];
    
    override init(frame: CGRect) {
        self.muted = player.muted
        self.looping = player.looping
        self.liveLowLatency = player.isLiveLowLatency
        self.autoQualityMode = player.autoQualityMode
        self.playbackRate = NSNumber(value: player.playbackRate)
        self.logLevel = NSNumber(value: player.logLevel.rawValue)
        self.progressInterval = 1
        self.volume = NSNumber(value: player.volume)
        super.init(frame: frame)
        self.addSubview(self.playerView)
        self.playerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        self.addProgressObserver()
        self.addPlayerObserver()

        if let url = self.streamUrl {
            self.load(urlString: url)
        }
    }

    deinit {
        self.removeProgressObserver()
        self.removePlayerObserver()
    }

    func load(urlString: String) {
        finishedLoading = false
        player.delegate = self
        let url = URL(string: urlString)!

        self.playerView.player = player
        onLoadStart?(["": NSNull()])
        player.load(url)
    }

    @objc var progressInterval: NSNumber {
        // TODO: Figure out why updatating observer does not work and results in multiple calls per second
        didSet {
            self.removeProgressObserver()
            self.addProgressObserver()
        }
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

    @objc var quality: NSDictionary? {
        didSet {
            let newQuality = findQuality(quality: quality)
            player.quality = newQuality
        }
    }

    @objc var autoQualityMode: Bool {
        didSet {
            player.autoQualityMode = autoQualityMode
        }
    }

    @objc var autoMaxQuality: NSDictionary? {
        didSet {
            let quality = findQuality(quality: autoMaxQuality)
            player.setAutoMaxQuality(quality)
        }
    }

    private func findQuality(quality: NSDictionary?) -> IVSQuality? {
        let quality = player.qualities.first(where: {
            $0.name == quality?["name"] as? String &&
            $0.codecs == quality?["codecs"] as? String &&
            $0.bitrate == quality?["bitrate"] as? Int &&
            $0.framerate == quality?["framerate"] as? Float &&
            $0.width == quality?["width"] as? Int &&
            $0.height == quality?["height"] as? Int
        })

        return quality
    }

    @objc var streamUrl: String? {
        didSet {
            if let url = streamUrl {
                self.load(urlString: url)
            }
        }
    }

    @objc var volume: NSNumber {
        didSet {
            player.volume = Float(truncating: volume)
        }
    }

    @objc var logLevel: NSNumber {
        didSet {
            switch logLevel {
            case 0:
                player.logLevel = IVSPlayer.LogLevel.debug
            case 1:
                player.logLevel = IVSPlayer.LogLevel.info
            case 2:
                player.logLevel = IVSPlayer.LogLevel.warning
            case 3:
                player.logLevel = IVSPlayer.LogLevel.error
            default:
                break
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

    func addPlayerObserver() {
        playerObserverToken = player.addPeriodicTimeObserver(forInterval: CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC)), queue: .main) {
            [weak self] time in
            self?.onLiveLatencyChange?(["liveLatency": (self?.player.liveLatency.value ?? nil) as Any])
            self?.onBandwidthEstimateChange?(["bandwidthEstimate": (self?.player.bandwidthEstimate ?? nil) as Any])
        }
    }

    func addProgressObserver() {
        progressObserverToken = player.addPeriodicTimeObserver(forInterval: CMTime(seconds: Double(truncating: progressInterval), preferredTimescale: CMTimeScale(NSEC_PER_SEC)), queue: .main) {
            [weak self] time in
            self?.onProgress?(["position": (self?.player.position.seconds ?? nil) as Any])
        }
    }

    func removePlayerObserver() {
        if let token = playerObserverToken {
            player.removeTimeObserver(token)
            self.playerObserverToken = nil
        }
    }

    func removeProgressObserver() {
        if let token = progressObserverToken {
            player.removeTimeObserver(token)
            self.progressObserverToken = nil
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
                    let qualityData: [String: Any] = [
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
            if duration.isNumeric {
                // TODO: not sure about the expected return format, it returns seconds at the moment
                onDurationChange?(["duration": CMTimeGetSeconds(duration)])
            } else {
                onDurationChange?(["duration": NSNull()])
            }
    }

    func player(_ player: IVSPlayer, didChangeQuality quality: IVSQuality?) {
            if quality == nil {
                onQualityChange?(["quality": NSNull()])
            } else {
                let qualityData: [String: Any] = [
                    "name": quality?.name ?? "",
                    "codecs": quality?.codecs ?? "",
                    "bitrate": quality?.bitrate ?? 0,
                    "framerate": quality?.framerate ?? 0,
                    "width": quality?.width ?? 0,
                    "height": quality?.height ?? 0
                ]

                onQualityChange?(qualityData)
            }
    }

    func player(_ player: IVSPlayer, didOutputCue cue: IVSCue) {
        if let cue = cue as? IVSTextCue, onTextCue != nil {
            let textQue: [String: Any] = [
                "type": cue.type.rawValue,
                "line": cue.line,
                "size": cue.size,
                "position": cue.position,
                "text": cue.text,
                "textAlignment": cue.textAlignment
            ]

            onTextCue!(textQue)
        }

        if let cue = cue as? IVSTextMetadataCue, onTextMetadataCue != nil {
            let textMetadataQue = [
                "type": cue.type.rawValue,
                "text": cue.text,
                "textDescription": cue.textDescription

            ]

            onTextMetadataCue!(textMetadataQue)
        }
    }

    func playerWillRebuffer(_ player: IVSPlayer) {
        onBuffer?(["": NSNull()])
    }

    func player(_ player: IVSPlayer, didFailWithError error: Error) {
        onError?(["error": error.localizedDescription])
    }
}
