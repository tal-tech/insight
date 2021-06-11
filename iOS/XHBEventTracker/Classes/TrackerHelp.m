//
//  TrackerHelp.m
//  XHBEventTracker
//
//  Created by 李俊毅 on 2020/11/4.
//

#import "TrackerHelp.h"
#import <objc/runtime.h>
#import "EventTracker.h"
#import "UIView+Hook.h"
#import "TrackerDisplayView.h"

/// 一个元素 $AppClick 全埋点最小时间间隔，200 毫秒
static NSTimeInterval kAppClickMinTimeInterval = 0.2;

@implementation TrackerHelp

+ (NSString *)getClassName:(id)obj {
    return [NSString stringWithFormat:@"%s", object_getClassName(obj)];
}

+ (void)sel_exchangeClass:(Class)class fromSel:(SEL)sel1 toSel:(SEL)sel2 {
    Method fromMethod = class_getInstanceMethod(class, sel1);
    Method toMethod = class_getInstanceMethod(class, sel2);
    //https://dandan2009.github.io/2018/04/08/runtime-method-swizzling/
    if (class_addMethod(class, sel2, method_getImplementation(toMethod), method_getTypeEncoding(toMethod))) {
        class_replaceMethod(class, sel2, method_getImplementation(fromMethod), method_getTypeEncoding(fromMethod));
    } else {
        method_exchangeImplementations(fromMethod, toMethod);
    }
}

+ (NSString *)getDescWithSender:(id)sender {
    if ([sender isKindOfClass:[UIBarItem class]]) {
        return ((UIBarItem *)sender).title;
    } else
    if ([sender isKindOfClass:[UILabel class]]) {
        return ((UILabel *)sender).text;
    } else
    if ([sender isKindOfClass:[UIButton class]]) {
        return ((UIButton *)sender).titleLabel.text;
    } else
    if ([sender isKindOfClass:[UIView class]]) {
        for (UIView *subview in ((UIView *)sender).subviews) {
            [self getDescWithSender:subview];
        }
    }
    return @"";
}

+ (UIViewController *)getAppRootTopViewController {
    UIWindow *window = [[UIApplication sharedApplication] delegate].window;
    return [self getVisibleViewController:window.rootViewController];
}

+ (UIViewController *)getVisibleViewController:(UIViewController *)rootViewController {
    UIViewController *result = nil;
    UIViewController *presented = rootViewController.presentedViewController;
    if (presented) {
        if ([self isSubController:presented]) {
            return [self getPresentingViewController:rootViewController];
        }
        result = [self getVisibleViewController:presented];
    } else if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        UIViewController *selectedViewController = ((UITabBarController *)rootViewController).selectedViewController;
        result = [self getVisibleViewController:selectedViewController];
    } else if ([rootViewController isKindOfClass:[UINavigationController class]]) {
        UIViewController *topViewController = ((UINavigationController *)rootViewController).topViewController;
        result = [self getVisibleViewController:topViewController];
    } else {
        result = rootViewController;
    }
    return result;
}

// 判断是否是通用控件(原则present出来的页面在控件名单里例如UIAlertController)
+ (BOOL)isSubController:(UIViewController *)viewController {
    if ([self isSubComponent:viewController]) {
        return YES;
    }
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController *nav = (UINavigationController *)viewController;
        if ([nav viewControllers].count == 1) {
            return [self isSubComponent:[nav topViewController]];
        }
    }
    return NO;
}

+ (BOOL)isSubComponent:(UIViewController *)component {
    BOOL result = NO;
    NSString *name = [TrackerHelp getClassName:component];
    NSArray *subComponents = [[EventTracker shareInstance] subComponents];
    for (NSString *subName in subComponents) {
        if ([name isEqualToString:subName]) {
            result = YES;
        }
    }
    return result;
}

//// 如果是present出来的控件 寻找控件的父页面
+ (UIViewController *)getPresentingViewController:(UIViewController *)viewController {
    UIViewController *result = nil;
    if ([viewController isKindOfClass:[UITabBarController class]]) {
        UIViewController *selectedViewController = ((UITabBarController *)viewController).selectedViewController;
        result = [self getPresentingViewController:selectedViewController];
    } else if ([viewController isKindOfClass:[UINavigationController class]]) {
        UIViewController *topViewController = ((UINavigationController *)viewController).topViewController;
        result = [self getPresentingViewController:topViewController];
    } else {
        result = viewController;
    }
    return result;
}

+ (NSArray<NSString *> *)getSystemSenders {
    return @[@"_UIButtonBarButton", @"UISwitchModernVisualElement"];
}

+ (BOOL)needFilterSender:(id)sender {
    BOOL need = NO;
    NSString *senderName = [self getClassName:sender];
    for (NSString *name in [self getSystemSenders]) {
        if ([senderName isEqualToString:name]) {
            need = YES;
        }
    }
    if ([sender isKindOfClass:[UIView class]]) {
        NSTimeInterval lastTime = ((UIView *)sender).lastActionTime;
        NSTimeInterval currentTime = [[NSProcessInfo processInfo] systemUptime];
        if (lastTime > 0 && currentTime - lastTime < kAppClickMinTimeInterval) {
            need = YES;
        }
    }
    return need;
}

+ (BOOL)needFilterViewController:(UIViewController *)viewController {
    BOOL need = NO;
    NSString *senderName = [self getClassName:viewController];
    for (NSString *name in [[EventTracker shareInstance] viewControllerBlackList]) {
        if ([senderName isEqualToString:name]) {
            need = YES;
        }
    }
    return need;
}

+ (UIImage *)takeScreenshot {
    [[DisplayViewManager shareInstance] setHidden:YES];
    CGSize imageSize = CGSizeZero;
    CGSize screenSize = [UIScreen mainScreen].bounds.size;
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    if (orientation == UIDeviceOrientationPortrait) {
        imageSize = screenSize;
    } else {
        imageSize = CGSizeMake(screenSize.height, screenSize.width);
    }
    UIGraphicsBeginImageContextWithOptions(imageSize, NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context) {
        for (UIWindow *window in ([UIApplication sharedApplication].windows)) {
            CGContextSaveGState(context);
            CGContextTranslateCTM(context, window.center.x, window.center.y);
            CGContextConcatCTM(context, window.transform);
            CGContextTranslateCTM(context, -window.bounds.size.width * window.layer.anchorPoint.x, -window.bounds.size.height * window.layer.anchorPoint.y);
            if (orientation == UIDeviceOrientationLandscapeLeft) {
                CGContextRotateCTM(context, M_PI/4);
                CGContextTranslateCTM(context, 0, -imageSize.width);
            } else if (orientation == UIDeviceOrientationLandscapeRight) {
                CGContextRotateCTM(context, -M_PI/2);
                CGContextTranslateCTM(context, -imageSize.height, 0);
            } else if (orientation == UIDeviceOrientationPortraitUpsideDown) {
                CGContextRotateCTM(context, -M_PI);
                CGContextTranslateCTM(context, -imageSize.width, -imageSize.height);
            }
            if ([window respondsToSelector:@selector(drawViewHierarchyInRect:afterScreenUpdates:)]) {
                [window drawViewHierarchyInRect:window.bounds afterScreenUpdates:YES];
            } else {
                [window.layer renderInContext:context];
            }
            CGContextRestoreGState(context);
        }
    }
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    [[DisplayViewManager shareInstance] setHidden:NO];
    return image;
}

@end
