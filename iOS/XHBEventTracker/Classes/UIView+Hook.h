//
//  UIView+Hook.h
//  blackboard
//
//  Created by 李俊毅 on 2021/4/21.
//

#import <UIKit/UIKit.h>
#import <EventTracker.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (Hook)

@property (nonatomic, strong, nullable) NSString *trackId;

@property (nonatomic, strong, nullable) NSDictionary *traceParams;

@property (nonatomic, assign) NSTimeInterval lastActionTime;

- (TrackerObject *)getTrackerObject;

- (UIImage *)viewSnapshot;

@end

NS_ASSUME_NONNULL_END
