//
//  EventTracker.m
//  HookDemo
//
//  Created by 李俊毅 on 2020/9/19.
//  Copyright © 2020 李俊毅. All rights reserved.
//

#import "EventTracker.h"
#import "TrackerHelp.h"
#import <UIViewController+Hook.h>
#import "TrackerDisplayView.h"

@implementation TrackerObject

@end

@interface EventTracker () {
    id<EventTrackerDelegate> _currentDelegate;
    BOOL _openDisplay;
}
@end

@implementation EventTracker

+ (EventTracker *)shareInstance {
    static EventTracker *instance = nil;
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didEnterBackground:) name:UIApplicationDidEnterBackgroundNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(willEnterForeground:) name:UIApplicationWillEnterForegroundNotification object:nil];
    }
    return self;
}

- (void)registerWithDelegate:(id<EventTrackerDelegate>)delegate {
    _currentDelegate = delegate;
}

- (id<EventTrackerDelegate>)delegate {
    return _currentDelegate;
}

- (BOOL)openDisplay {
    return _openDisplay;
}

- (void)setOpenDisplay:(BOOL)openDisplay {
    _openDisplay = openDisplay;
    if (openDisplay) {
        [[DisplayViewManager shareInstance] showDisplayView];
    } else {
        [[DisplayViewManager shareInstance] dismissDisplayView];
    }
}

- (void)didEnterBackground:(NSNotification *)notification {
    if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(viewDidDisappear:)]) {
        [[[EventTracker shareInstance] delegate] viewDidDisappear:[TrackerHelp getClassName:[TrackerHelp getAppRootTopViewController]]];
    }
}

- (void)willEnterForeground:(NSNotification *)notification {
    if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(viewDidAppear:)]) {
        [[[EventTracker shareInstance] delegate] viewDidAppear:[TrackerHelp getClassName:[TrackerHelp getAppRootTopViewController]]];
    }
}

@end
