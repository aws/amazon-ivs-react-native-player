#import "AmazonIvs.h"
#import "AmazonIVSPlayer/IVSPlayer.h"

#if __has_include(<AmazonIvs-Swift/AmazonIvs-Swift.h>)
#import <AmazonIvs-Swift/AmazonIvs-Swift.h>
#else
#import <AmazonIvs-Swift.h>
#endif

#import <react/renderer/components/AmazonIvsSpec/ComponentDescriptors.h>
#import <react/renderer/components/AmazonIvsSpec/EventEmitters.h>
#import <react/renderer/components/AmazonIvsSpec/Props.h>
#import <react/renderer/components/AmazonIvsSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface AmazonIvs () <RCTAmazonIvsViewProtocol>

@end

@implementation AmazonIvs {
  AmazonIvsView *_ivsView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<AmazonIvsComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const AmazonIvsProps>();
    _props = defaultProps;

    _ivsView = [[AmazonIvsView alloc] init];

    if (self) {
      __weak AmazonIvs *weakSelf = self;

      _ivsView.onLoadStart = ^{
        [weakSelf onLoadStart];
      };

      _ivsView.onVideoStatistics = ^(NSDictionary *onVideoStatisticsPayload) {
        [weakSelf onVideoStatistics:onVideoStatisticsPayload];
      };

      _ivsView.onData = ^(NSDictionary *onDataPayload) {
        [weakSelf onData:onDataPayload];
      };

      _ivsView.onSeek = ^(NSDictionary<NSString *, NSNumber *> *onSeekPayload) {
        [weakSelf onSeek:onSeekPayload];
      };

      _ivsView.onQualityChange = ^(NSDictionary *onQualityChangePayload) {
        [weakSelf onQualityChange:onQualityChangePayload];
      };

      _ivsView.onProgress = ^(NSDictionary<NSString *, id> *onProgressPayload) {
        [weakSelf onProgress:onProgressPayload];
      };

      _ivsView.onPipChange =
          ^(NSDictionary<NSString *, NSNumber *> *onPipChangePayload) {
            [weakSelf onPipChange:onPipChangePayload];
          };

      _ivsView.onPlayerStateChange =
          ^(NSDictionary<NSString *, NSString *> *onPlayerStateChangePayload) {
            [weakSelf onPlayerStateChange:onPlayerStateChangePayload];
          };

      _ivsView.onDurationChange =
          ^(NSDictionary<NSString *, NSNumber *> *onDurationChangePayload) {
            [weakSelf onDurationChange:onDurationChangePayload];
          };

      _ivsView.onError =
          ^(NSDictionary<NSString *, NSString *> *onErrorPayload) {
            [weakSelf onError:onErrorPayload];
          };

      _ivsView.onTextCue = ^(NSDictionary *onTextCuePayload) {
        [weakSelf onTextCue:onTextCuePayload];
      };

      _ivsView.onLiveLatencyChange =
          ^(NSDictionary *onLiveLatencyChangePayload) {
            [weakSelf onLiveLatencyChange:onLiveLatencyChangePayload];
          };

      _ivsView.onTextMetadataCue = ^(NSDictionary *onTextMetadataCuePayload) {
        [weakSelf onTextMetadataCue:onTextMetadataCuePayload];
      };

      _ivsView.onLoad = ^(NSDictionary<NSString *, NSNumber *> *duration) {
        [weakSelf onLoad:duration];
      };

      _ivsView.onRebuffering = ^{
        [weakSelf onRebuffering];
      };

      _ivsView.onTimePoint = ^(NSDictionary *onTimePointPayload) {
        [weakSelf onTimePoint:onTimePointPayload];
      };
    }

    self.contentView = _ivsView;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps =
      *std::static_pointer_cast<AmazonIvsProps const>(_props);
  const auto &newViewProps =
      *std::static_pointer_cast<AmazonIvsProps const>(props);

  if (oldViewProps.streamUrl != newViewProps.streamUrl) {
    _ivsView.streamUrl = @(newViewProps.streamUrl.c_str());
  }

  if (oldViewProps.muted != newViewProps.muted) {
    _ivsView.muted = newViewProps.muted;
  }

  if (oldViewProps.loop != newViewProps.loop) {
    _ivsView.loop = newViewProps.loop;
  }

  if (oldViewProps.liveLowLatency != newViewProps.liveLowLatency) {
    _ivsView.liveLowLatency = newViewProps.liveLowLatency;
  }

  if (oldViewProps.rebufferToLive != newViewProps.rebufferToLive) {
    _ivsView.rebufferToLive = newViewProps.rebufferToLive;
  }

  if (oldViewProps.playbackRate != newViewProps.playbackRate) {
    _ivsView.playbackRate = newViewProps.playbackRate;
  }

  if (oldViewProps.playbackRate != newViewProps.playbackRate) {
    _ivsView.playbackRate = newViewProps.playbackRate;
  }

  if (oldViewProps.logLevel != newViewProps.logLevel) {
    _ivsView.logLevel = @(newViewProps.logLevel);
  }

  if (oldViewProps.resizeMode != newViewProps.resizeMode) {
    _ivsView.resizeMode = @(newViewProps.resizeMode.c_str());
  }

  if (oldViewProps.volume != newViewProps.volume) {
    _ivsView.volume = newViewProps.volume;
  }

  if (oldViewProps.quality.name != newViewProps.quality.name) {
    _ivsView.quality = DictionaryFromQuality(newViewProps.quality);
  }

  if (oldViewProps.autoMaxQuality.name != newViewProps.autoMaxQuality.name) {
    _ivsView.autoMaxQuality =
        DictionaryFromQuality(newViewProps.autoMaxQuality);
  }

  if (oldViewProps.autoQualityMode != newViewProps.autoQualityMode) {
    _ivsView.autoQualityMode = newViewProps.autoQualityMode;
  }

  if (oldViewProps.maxBitrate != newViewProps.maxBitrate) {
    _ivsView.maxBitrate = newViewProps.maxBitrate;
  }

  if (oldViewProps.initialBufferDuration !=
      newViewProps.initialBufferDuration) {
    _ivsView.initialBufferDuration = newViewProps.initialBufferDuration;
  }

  if (oldViewProps.pipEnabled != newViewProps.pipEnabled) {
    _ivsView.pipEnabled = newViewProps.pipEnabled;
  }

  if (oldViewProps.breakpoints != newViewProps.breakpoints) {
    NSArray *newBreakpointsArray =
        [self nsArrayFromStdVector:newViewProps.breakpoints];
    _ivsView.breakpoints = newBreakpointsArray;
  }

  if (oldViewProps.progressInterval != newViewProps.progressInterval) {
    _ivsView.progressInterval = @(newViewProps.progressInterval);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)unmountChildComponentView:
            (nonnull UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState {
}

Class<RCTComponentViewProtocol> AmazonIvsViewCls(void) {
  return AmazonIvs.class;
}

- (std::shared_ptr<const AmazonIvsEventEmitter>)getEventEmitter {
  if (!self->_eventEmitter) {
    return nullptr;
  }

  assert(std::dynamic_pointer_cast<AmazonIvsEventEmitter const>(
      self->_eventEmitter));
  return std::static_pointer_cast<AmazonIvsEventEmitter const>(
      self->_eventEmitter);
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
  if ([commandName isEqual:@"play"]) {
    [self play];
  } else if ([commandName isEqual:@"pause"]) {
    [self pause];
  } else if ([commandName isEqual:@"loadSource"]) {
    if (args.count > 0) {
      NSInteger sourceId = [args[0] integerValue];
      [self loadSource:sourceId];
    }
  } else if ([commandName isEqual:@"togglePip"]) {
    [self togglePip];
  } else if ([commandName isEqual:@"seekTo"]) {
    if (args.count > 0 && [args[0] isKindOfClass:[NSNumber class]]) {
      double position = [args[0] doubleValue];
      [self seekTo:position];
    }
  } else if ([commandName isEqual:@"setOrigin"]) {
    if (args.count > 0) {
      NSString *origin = args[0];
      [self setOrigin:origin];
    }
  } else if ([commandName isEqual:@"preload"]) {
    if (args.count > 1) {
      NSString *url = args[0];
      NSInteger sourceId = [args[1] integerValue];

      [self preload:url sourceId:sourceId];
    }
  } else if ([commandName isEqual:@"releaseSource"]) {
    if (args.count > 0) {
      NSInteger sourceId = [args[0] integerValue];

      [self releaseSource:sourceId];
    }
  }
}

- (void)pause {
  [_ivsView pause];
}

- (void)play {
  [_ivsView play];
}

- (void)seekTo:(double)position {
  [_ivsView seekWithPosition:position];
}

- (void)setOrigin:(nonnull NSString *)value {
  [_ivsView setOriginWithOrigin:value];
}

- (void)togglePip {
  [_ivsView togglePip];
}

- (void)loadSource:(NSInteger)sourceId {
  [_ivsView loadSourceWithId:sourceId];
}

- (void)preload:(nonnull NSString *)url sourceId:(NSInteger)sourceId {
  [_ivsView preloadWithId:(NSInteger)sourceId url:url];
}

- (void)releaseSource:(NSInteger)sourceId {
  [_ivsView releaseSourceWithId:sourceId];
}

- (void)onLoadStart {
  dispatch_async(dispatch_get_main_queue(), ^{
    const auto eventEmitter = [self getEventEmitter];
    if (eventEmitter != nullptr) {
      eventEmitter->onLoadStart({});
    }
  });
}

- (void)onDurationChange:(NSDictionary *)onDurationChangePayload {
  const auto eventEmitter = [self getEventEmitter];

  NSNumber *duration = onDurationChangePayload[@"duration"];
  double durationValue = [duration doubleValue];

  AmazonIvsEventEmitter::OnDurationChange eventData;
  eventData.duration = durationValue;

  if (eventEmitter != nullptr) {
    eventEmitter->onDurationChange(eventData);
  }
}

- (void)onRebuffering {
  const auto eventEmitter = [self getEventEmitter];

  if (eventEmitter != nullptr) {
    eventEmitter->onRebuffering({});
  }
}

- (void)onPipChange:(NSDictionary<NSString *, NSNumber *> *)pipData {
  const auto eventEmitter = [self getEventEmitter];

  BOOL isPipActive = [pipData[@"active"] boolValue];
  AmazonIvsEventEmitter::OnPipChange eventData;
  eventData.active = isPipActive;

  if (eventEmitter != nullptr) {
    eventEmitter->onPipChange(eventData);
  }
}

- (void)onData:(NSDictionary *)onDataPayload {
  const auto eventEmitter = [self getEventEmitter];

  AmazonIvsEventEmitter::OnData eventData;
  NSDictionary *onDatDict = onDataPayload[@"playerData"];

  id versionObj = onDatDict[@"version"];
  eventData.playerData.version =
      (versionObj != [NSNull null]) ? [versionObj UTF8String] : "";

  id sessionIdObj = onDatDict[@"sessionId"];
  eventData.playerData.sessionId =
      (sessionIdObj != [NSNull null]) ? [sessionIdObj UTF8String] : "";

  std::vector<AmazonIvsEventEmitter::OnDataPlayerDataQualities> qualitiesVector;

  NSArray<NSDictionary *> *qualitiesArray =
      [onDatDict[@"qualities"] isKindOfClass:[NSArray class]]
          ? onDatDict[@"qualities"]
          : @[];

  for (NSDictionary *qualityDict in qualitiesArray) {
    AmazonIvsEventEmitter::OnDataPlayerDataQualities qualityStruct;

    auto getInt = ^int(NSString *key) {
      id obj = qualityDict[key];
      return (obj != [NSNull null]) ? [obj intValue] : 0;
    };
    auto getDouble = ^double(NSString *key) {
      id obj = qualityDict[key];
      return (obj != [NSNull null]) ? [obj doubleValue] : 0.0;
    };
    auto getString = ^std::string(NSString *key) {
      id obj = qualityDict[key];
      return (obj != [NSNull null]) ? [obj UTF8String] : "";
    };

    qualityStruct.name = getString(@"name");
    qualityStruct.codecs = getString(@"codecs");
    qualityStruct.bitrate = getInt(@"bitrate");
    qualityStruct.framerate = getDouble(@"framerate");
    qualityStruct.width = getInt(@"width");
    qualityStruct.height = getInt(@"height");

    qualitiesVector.push_back(qualityStruct);
  }

  eventData.playerData.qualities = std::move(qualitiesVector);

  if (eventEmitter != nullptr) {
    eventEmitter->onData(eventData);
  }
}

- (void)onVideoStatistics:(NSDictionary *)onVideoStatisticsPayload {
  const auto eventEmitter = [self getEventEmitter];

  NSDictionary *videoData = onVideoStatisticsPayload[@"videoData"];

  id durationObj = videoData[@"duration"];
  int duration = (durationObj != [NSNull null]) ? [durationObj doubleValue] : 0;

  id bitrateObj = videoData[@"bitrate"];
  int bitrate = (bitrateObj != [NSNull null]) ? [bitrateObj intValue] : 0;

  id framesDroppedObj = videoData[@"framesDropped"];
  int framesDropped =
      (framesDroppedObj != [NSNull null]) ? [framesDroppedObj intValue] : 0;

  id framesDecodedObj = videoData[@"framesDecoded"];
  int framesDecoded =
      (framesDecodedObj != [NSNull null]) ? [framesDecodedObj intValue] : 0;

  AmazonIvsEventEmitter::OnVideoStatistics eventData;
  eventData.videoData = {
      bitrate,
      framesDropped,
      framesDecoded,
      duration,
  };

  if (eventEmitter != nullptr) {
    eventEmitter->onVideoStatistics(eventData);
  }
}

- (void)onTextCue:(NSDictionary *)onTextCuePayload {
  const auto eventEmitter = [self getEventEmitter];

  NSDictionary *textCue = onTextCuePayload[@"textCue"];

  std::string type = [textCue[@"type"] UTF8String];
  double line = [textCue[@"line"] doubleValue];
  double size = [textCue[@"size"] doubleValue];
  double position = [textCue[@"position"] doubleValue];
  std::string text = [textCue[@"text"] UTF8String];
  std::string textAlignment = [textCue[@"textAlignment"] UTF8String];

  AmazonIvsEventEmitter::OnTextCue eventData;
  eventData.textCue = {type, line, size, position, text, textAlignment};

  if (eventEmitter != nullptr) {
    eventEmitter->onTextCue(eventData);
  }
}

- (void)onTimePoint:(NSDictionary *)onTimePointPayload {
  const auto eventEmitter = [self getEventEmitter];

  double position = [onTimePointPayload[@"position"] doubleValue];
  ;

  AmazonIvsEventEmitter::OnTimePoint eventData;
  eventData.position = position;

  if (eventEmitter != nullptr) {
    eventEmitter->onTimePoint(eventData);
  }
}

- (void)onTextMetadataCue:(NSDictionary *)onTextMetadataCuePayload {
  const auto eventEmitter = [self getEventEmitter];
  NSDictionary *textMetadataCue = onTextMetadataCuePayload[@"textMetadataCue"];

  std::string type = [textMetadataCue[@"type"] UTF8String];
  std::string text = [textMetadataCue[@"text"] UTF8String];
  std::string textDescription =
      [textMetadataCue[@"textDescription"] UTF8String];

  AmazonIvsEventEmitter::OnTextMetadataCue eventData;
  eventData.textMetadataCue = {type, text, textDescription};

  if (eventEmitter != nullptr) {
    eventEmitter->onTextMetadataCue(eventData);
  }
}

- (void)onSeek:(NSDictionary *)onSeekPayload {
  const auto eventEmitter = [self getEventEmitter];
  double position = [onSeekPayload[@"position"] doubleValue];

  AmazonIvsEventEmitter::OnSeek eventData;
  eventData.position = position;

  if (eventEmitter != nullptr) {
    eventEmitter->onSeek(eventData);
  }
}

- (void)onProgress:(NSDictionary *)onProgressPayload {
  const auto eventEmitter = [self getEventEmitter];
  double position = [onProgressPayload[@"position"] doubleValue];

  AmazonIvsEventEmitter::OnProgress eventData;
  eventData.position = position;

  if (eventEmitter != nullptr) {
    eventEmitter->onProgress(eventData);
  }
}

- (void)onPlayerStateChange:(NSDictionary *)onPlayerStateChangePayload {
  const auto eventEmitter = [self getEventEmitter];

  NSString *stateString = onPlayerStateChangePayload[@"state"];

  AmazonIvsEventEmitter::OnPlayerStateChange eventData;
  eventData.state = [stateString UTF8String];

  if (eventEmitter != nullptr) {
    eventEmitter->onPlayerStateChange(eventData);
  }
}

- (void)onLiveLatencyChange:(NSDictionary *)onLiveLatencyChangePayload {
  const auto eventEmitter = [self getEventEmitter];

  int liveLatency = [onLiveLatencyChangePayload[@"liveLatency"] intValue];

  AmazonIvsEventEmitter::OnLiveLatencyChange eventData;
  eventData.liveLatency = liveLatency;

  if (eventEmitter != nullptr) {
    eventEmitter->onLiveLatencyChange(eventData);
  }
}

- (void)onQualityChange:(NSDictionary *)onQualityChangePayload {
  const auto eventEmitter = [self getEventEmitter];
  id qualityObj = onQualityChangePayload[@"quality"];

  if (qualityObj == nil || qualityObj == [NSNull null]) {
    return;
  }

  AmazonIvsEventEmitter::OnQualityChange eventData;
  NSDictionary *qualityData = (NSDictionary *)qualityObj;

  AmazonIvsEventEmitter::OnQualityChangeQuality qualityStruct;

  id nameObj = qualityData[@"name"];
  qualityStruct.name = (nameObj != [NSNull null]) ? [nameObj UTF8String] : "";

  id codecsObj = qualityData[@"codecs"];
  qualityStruct.codecs =
      (codecsObj != [NSNull null]) ? [codecsObj UTF8String] : "";

  id bitrateObj = qualityData[@"bitrate"];
  qualityStruct.bitrate =
      (bitrateObj != [NSNull null]) ? [bitrateObj intValue] : 0;

  id framerateObj = qualityData[@"framerate"];
  qualityStruct.framerate =
      (framerateObj != [NSNull null]) ? [framerateObj doubleValue] : 0.0;

  id widthObj = qualityData[@"width"];
  qualityStruct.width = (widthObj != [NSNull null]) ? [widthObj intValue] : 0;

  id heightObj = qualityData[@"height"];
  qualityStruct.height =
      (heightObj != [NSNull null]) ? [heightObj intValue] : 0;

  eventData.quality = qualityStruct;

  if (eventEmitter != nullptr) {
    eventEmitter->onQualityChange(eventData);
  }
}
- (void)onLoad:(NSDictionary *)durationDict {
  const auto eventEmitter = [self getEventEmitter];

  NSDictionary *durationData = (NSDictionary *)durationData;

  AmazonIvsEventEmitter::OnLoad durationStruct;
  id durationObj = durationDict[@"duration"];
  durationStruct.duration =
      (durationObj != [NSNull null]) ? [durationObj doubleValue] : 0.0;

  if (eventEmitter != nullptr) {
    eventEmitter->onLoad(durationStruct);
  }
}

- (void)onError:(NSDictionary<NSString *, NSString *> *)onErrorPayload {
  const auto eventEmitter = [self getEventEmitter];

  NSString *errorString = onErrorPayload[@"error"];

  AmazonIvsEventEmitter::OnError eventData;
  eventData.error = [errorString UTF8String];

  if (eventEmitter != nullptr) {
    eventEmitter->onError(eventData);
  }
}

- (NSArray<NSNumber *> *)nsArrayFromStdVector:(const std::vector<int> &)vector {
  NSMutableArray<NSNumber *> *array =
      [NSMutableArray arrayWithCapacity:vector.size()];

  for (int value : vector) {
    [array addObject:@(value)];
  }

  return [array copy];
}

template <typename QualityStruct>
static inline NSDictionary *
DictionaryFromQuality(const QualityStruct &quality) {
  return @{
    @"name" : @(quality.name.c_str()),
    @"codecs" : @(quality.codecs.c_str()),
    @"bitrate" : @(quality.bitrate),
    @"framerate" : @(quality.framerate),
    @"width" : @(quality.width),
    @"height" : @(quality.height)
  };
}

@end
