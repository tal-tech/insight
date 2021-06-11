//
//  EventTrackerHandler.m
//  XHBEventTracker_Example
//
//  Created by 李俊毅 on 2020/9/23.
//  Copyright © 2020 李洋超. All rights reserved.
//

#import "EventTrackerHandler.h"

@implementation EventTrackerHandler

- (void)viewDidLoad:(NSString *)viewControllerName {
    NSLog(@"%@ viewDidLoad", viewControllerName);
}

- (void)viewDidAppear:(NSString *)viewControllerName {
    NSLog(@"%@ viewDidAppear", viewControllerName);
}

- (void)viewDidDisappear:(NSString *)viewControllerName {
    NSLog(@"%@ viewDidDisappear", viewControllerName);
}

- (void)onClickAction:(TrackerObject *)target {
    NSLog(@"onClickAction -- viewControllerName:%@ subViewControllerName:%@ viewControllerTitle:%@ path:%@ desc:%@ trackId:%@ traceParams:%@", target.viewControllerName, target.subViewControllerName, target.viewControllerTitle, target.path, target.desc, target.trackId, target.traceParams);
}

- (void)pageShowWithName:(NSString *)name displayImage:(UIImage *)image {
    NSLog(@"页面可视化");
}

- (void)onAction:(TrackerObject *)target page:(UIImage *)page item:(UIImage *)item {
    NSLog(@"元素可视化");
}

@end
