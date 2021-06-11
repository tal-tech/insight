//
//  UITableView+Hook.m
//  blackboard
//
//  Created by 李俊毅 on 2021/4/21.
///

#import "UITableView+Hook.h"
#import "SAScrollViewDelegateProxy.h"
#import "TrackerHelp.h"

@implementation UITableView (Hook)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [TrackerHelp sel_exchangeClass:self fromSel:@selector(setDelegate:) toSel:@selector(hook_setDelegate:)];
    });
}

- (void)hook_setDelegate:(id <UITableViewDelegate>)delegate {
    [SAScrollViewDelegateProxy resolveOptionalSelectorsForDelegate:delegate];
    
    [self hook_setDelegate:delegate];

    if (!delegate || !self.delegate) {
        return;
    }
    // 使用委托类去 hook 点击事件方法
    [SAScrollViewDelegateProxy proxyDelegate:self.delegate selectors:[NSSet setWithArray:@[@"tableView:didSelectRowAtIndexPath:"]]];
}

@end
