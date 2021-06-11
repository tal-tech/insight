//
//  EventTracker.h
//  HookDemo
//
//  Created by 李俊毅 on 2020/9/19.
//  Copyright © 2020 李俊毅. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TrackerObject : NSObject

//页面名称(app rootViewController)
@property (nonatomic, strong) NSString *viewControllerName;
//子页面名称(事件响应vc,如和viewControllerName相等则为nil)
@property (nonatomic, strong) NSString *subViewControllerName;
//页面title
@property (nonatomic, strong) NSString *viewControllerTitle;
//事件id(以页面为单位事件唯一值)
@property (nonatomic, strong) NSString *path;
//描述信息(一般为点击事件可见的文字信息)
@property (nonatomic, strong) NSString *desc;
//事件id(手动埋点事件唯一值)
@property (nonatomic, strong) NSString *trackId;
//业务参数(手动埋点赋值)
@property (nonatomic, strong) NSDictionary *traceParams;
//元素位置(可视化用)
@property (nonatomic, assign) CGRect position;
////自定义描述(可视化用)
//@property (nonatomic, strong) NSString *customDesc;

@end

@protocol EventTrackerDelegate <NSObject>
@optional

- (void)viewDidLoad:(NSString *)viewControllerName;

- (void)viewDidAppear:(NSString *)viewControllerName;

- (void)viewDidDisappear:(NSString *)viewControllerName;

- (void)onClickAction:(TrackerObject *)target;

- (void)pageShowWithName:(NSString *)name displayImage:(UIImage *)image;

- (void)onAction:(TrackerObject *)target page:(UIImage *)page item:(UIImage *)item;

@end

@interface EventTracker : NSObject

@property (nonatomic, weak, readonly) id<EventTrackerDelegate> delegate;
//公用组件(如UIAlertController)
@property (nonatomic, strong) NSArray<NSString *> *subComponents;
//需要过滤的控制器
@property (nonatomic, strong) NSArray<NSString *> *viewControllerBlackList;

@property (nonatomic, assign) BOOL openDisplay;

+ (EventTracker *)shareInstance;

- (void)registerWithDelegate:(id<EventTrackerDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
