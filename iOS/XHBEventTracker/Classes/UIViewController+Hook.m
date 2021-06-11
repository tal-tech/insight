//
//  UIViewController+Hook.m
//
//  Created by 李俊毅 on 2021/4/21.
//

#import "UIViewController+Hook.h"
#import "TrackerHelp.h"
#import "TrackerDisplayView.h"

@implementation UIViewController (Hook)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [TrackerHelp sel_exchangeClass:self fromSel:@selector(viewDidLoad) toSel:@selector(hook_ViewDidLoad)];
        [TrackerHelp sel_exchangeClass:self fromSel:@selector(viewDidAppear:) toSel:@selector(hook_ViewDidAppear:)];
        [TrackerHelp sel_exchangeClass:self fromSel:@selector(viewDidDisappear:) toSel:@selector(hook_ViewDidDisappear:)];
    });
}

- (void)hook_ViewDidLoad {
    if (![TrackerHelp needFilterViewController:self]) {
        if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(viewDidLoad:)]) {
            [[[EventTracker shareInstance] delegate] viewDidLoad:[TrackerHelp getClassName:self]];
        }
    }
    [self hook_ViewDidLoad];
}

- (void)hook_ViewDidAppear:(BOOL)animated {
    if (![TrackerHelp needFilterViewController:self]) {
        if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(viewDidAppear:)]) {
            [[[EventTracker shareInstance] delegate] viewDidAppear:[TrackerHelp getClassName:self]];
        }
        if ([EventTracker shareInstance].openDisplay) {
            [[DisplayViewManager shareInstance] setPageName:[TrackerHelp getClassName:self]];
        }
    }
    [self hook_ViewDidAppear:animated];
}

- (void)hook_ViewDidDisappear:(BOOL)animated {
    if (![TrackerHelp needFilterViewController:self]) {
        if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(viewDidDisappear:)]) {
            [[[EventTracker shareInstance] delegate] viewDidDisappear:[TrackerHelp getClassName:self]];
        }
    }
    [self hook_ViewDidDisappear:animated];
}

@end
