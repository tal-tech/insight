//
//  TrackerHelp.h
//  XHBEventTracker
//
//  Created by 李俊毅 on 2020/11/4.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TrackerHelp : NSObject

+ (NSString *)getClassName:(id)obj;

+ (void)sel_exchangeClass:(Class)class fromSel:(SEL)sel1 toSel:(SEL)sel2;

+ (UIViewController *)getAppRootTopViewController;

+ (NSString *)getDescWithSender:(id)sender;

+ (NSArray<NSString *> *)getSystemSenders;

+ (BOOL)needFilterSender:(id)sender;

+ (BOOL)needFilterViewController:(UIViewController *)viewController;

+ (UIImage *)takeScreenshot;

@end

NS_ASSUME_NONNULL_END
