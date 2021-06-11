//
//  TrackerDisplayView.h
//  XHBEventTracker
//
//  Created by 李俊毅 on 2021/4/21.
//

#import <UIKit/UIKit.h>
@class TrackerObject;

NS_ASSUME_NONNULL_BEGIN

@interface DisplayViewManager : NSObject

@property (nonatomic, assign) BOOL isAutoUpload;

@property (nonatomic, assign) BOOL isStopAction;

+ (DisplayViewManager *)shareInstance;

- (void)showDisplayView;

- (void)dismissDisplayView;

- (void)setHidden:(BOOL)hidden;

- (void)setPageName:(NSString *)name;

- (void)setInforWithView:(UIView *)view;

@end

@interface TrackerDisplayView : UIView

- (void)setPageName:(NSString *)name;

- (void)setItemInfor:(TrackerObject *)objc;

@end

NS_ASSUME_NONNULL_END
