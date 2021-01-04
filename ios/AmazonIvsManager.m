#import "React/RCTBridgeModule.h"
#import "RCTViewManager.h"

@interface RCT_EXTERN_MODULE(AmazonIvsManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(muted, BOOL)
RCT_EXPORT_VIEW_PROPERTY(looping, BOOL)
RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)
RCT_EXPORT_VIEW_PROPERTY(streamUrl, NSString)
RCT_EXTERN_METHOD(seekTo:(nonnull NSNumber *)node position:(nonnull NSNumber)position)

RCT_EXPORT_VIEW_PROPERTY(onSeek, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPlayerStateChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDurationChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onQualityChange, RCTDirectEventBlock)
@end
