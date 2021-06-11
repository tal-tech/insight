//
//  UIApplication+Hook.m
//  blackboard
//
//  Created by 李俊毅 on 2021/4/21.
//

#import "UIApplication+Hook.h"
#import "TrackerHelp.h"
#import "EventTracker.h"
#import "UIView+Hook.h"
#import "UIBarItem+Hook.h"
#import "TrackerDisplayView.h"

@implementation UIApplication (Hook)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [TrackerHelp sel_exchangeClass:self fromSel:@selector(sendAction:to:from:forEvent:) toSel:@selector(hook_sendAction:to:from:forEvent:)];
    });
}

- (BOOL)hook_sendAction:(SEL)action to:(nullable id)target from:(nullable id)sender forEvent:(nullable UIEvent *)event {

    if (!([TrackerHelp needFilterSender:sender] || [target isKindOfClass:[TrackerDisplayView class]])) {
        TrackerObject *objc = nil;
        UIView *senderView = nil;
        if ([sender isKindOfClass:[UIView class]]) {
            UIView *view = (UIView *)sender;
            objc = [view getTrackerObject];
            view.lastActionTime = [[NSProcessInfo processInfo] systemUptime];
            senderView = view;
        }
        if ([sender isKindOfClass:[UIBarButtonItem class]]) {
            UIBarButtonItem *item = (UIBarButtonItem *)sender;
            objc = [[TrackerObject alloc] init];
            UIViewController *vc = [TrackerHelp getAppRootTopViewController];
            NSString *viewControllerName = [TrackerHelp getClassName:vc];
            objc.viewControllerName = viewControllerName;
            objc.viewControllerTitle = vc.title;
            NSString *subViewControllerName = [TrackerHelp getClassName:target];
            if (![viewControllerName isEqualToString:subViewControllerName]) {
                objc.subViewControllerName = subViewControllerName;
            }
            objc.path = [NSString stringWithFormat:@"%@/%@/%@", [TrackerHelp getClassName:target], [TrackerHelp getClassName:sender], NSStringFromSelector(action)];
            objc.desc = item.title;
            objc.trackId = item.trackId;
            objc.traceParams = item.traceParams;
        }

        if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(onClickAction:)]) {
            [[[EventTracker shareInstance] delegate] onClickAction:objc];
        }
        if ([EventTracker shareInstance].openDisplay && senderView) {
            [[DisplayViewManager shareInstance] setInforWithView:senderView];
        }
    }

    if ([DisplayViewManager shareInstance].isStopAction && ![target isKindOfClass:[TrackerDisplayView class]]) {
        return NO;
    }

    if ([self respondsToSelector:@selector(hook_sendAction:to:from:forEvent:)]) {
        return [self hook_sendAction:action to:target from:sender forEvent:event];
    }
    return NO;
}

@end
