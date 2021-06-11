//
//  UIGestureRecognizer+Hook.m
//  XHBEventTracker
//
//  Created by 李俊毅 on 2021/4/21.
//

#import "UIGestureRecognizer+Hook.h"
#import "TrackerHelp.h"
#import "UIView+Hook.h"
#import "TrackerDisplayView.h"

@implementation UIGestureRecognizer (Hook)

+ (void)load {
    [TrackerHelp sel_exchangeClass:self fromSel:@selector(initWithTarget:action:) toSel:@selector(hook_initWithTarget:action:)];
    [TrackerHelp sel_exchangeClass:self fromSel:@selector(addTarget:action:) toSel:@selector(hook_addTarget:action:)];
}

- (instancetype)hook_initWithTarget:(nullable id)target action:(nullable SEL)action {
    [self hook_initWithTarget:target action:action];
    [self removeTarget:target action:action];
    [self addTarget:target action:action];
    return self;
}

- (void)hook_addTarget:(nullable id)target action:(nullable SEL)action {
    [self hook_addTarget:self action:@selector(trackGestureRecognizerAppClick:)];
    [self hook_addTarget:target action:action];
}

- (void)trackGestureRecognizerAppClick:(UIGestureRecognizer *)gesture {
    if ([TrackerHelp needFilterSender:gesture.view] || [gesture.view isKindOfClass:[TrackerDisplayView class]]) {
        return;
    }
    gesture.view.lastActionTime = [[NSProcessInfo processInfo] systemUptime];
    if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(onClickAction:)]) {
        [[[EventTracker shareInstance] delegate] onClickAction:[gesture.view getTrackerObject]];
    }
    if ([EventTracker shareInstance].openDisplay) {
        [[DisplayViewManager shareInstance] setInforWithView:gesture.view];
    }
}

@end
