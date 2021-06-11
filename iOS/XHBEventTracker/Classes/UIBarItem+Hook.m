//
//  UIBarItem+Hook.m
//  XHBEventTracker
//
//  Created by 李俊毅 on 2021/4/20.
//

#import "UIBarItem+Hook.h"
#import <objc/runtime.h>

static NSString *const kTrackId = @"kUIBarItemTrackId";
static NSString *const kTraceParams = @"kUIBarItemTraceParams";

@implementation UIBarItem (Hook)

- (NSString *)trackId {
    return objc_getAssociatedObject(self, &kTrackId);
}

- (void)setTrackId:(NSString *)trackId {
    objc_setAssociatedObject(self, &kTrackId, trackId, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSDictionary *)traceParams {
    return  objc_getAssociatedObject(self, &kTraceParams);
}

- (void)setTraceParams:(NSDictionary *)traceParams {
    objc_setAssociatedObject(self, &kTraceParams, traceParams, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

@end
