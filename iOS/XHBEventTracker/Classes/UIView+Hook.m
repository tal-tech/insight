//
//  UIView+Hook.m
//  blackboard
//
//  Created by 李俊毅 on 2021/4/21.
//

#import "UIView+Hook.h"
#import "TrackerHelp.h"
#import <objc/runtime.h>

static NSString *const kTrackId = @"kUIViewTrackId";
static NSString *const kTraceParams = @"kUIViewTraceParams";
static NSString *const kLastActionTime = @"kLastActionTime";

@implementation UIView (Hook)

- (TrackerObject *)getTrackerObject {
    TrackerObject *objc = [[TrackerObject alloc] init];
    UIViewController *vc = [TrackerHelp getAppRootTopViewController];
    NSString *viewControllerName = [TrackerHelp getClassName:vc];
    objc.viewControllerName = viewControllerName;
    objc.viewControllerTitle = vc.title;
    NSString *subViewControllerName = [TrackerHelp getClassName:[self getViewController]];
    if (![viewControllerName isEqualToString:subViewControllerName]) {
        objc.subViewControllerName = subViewControllerName;
    }
    objc.path = [self getViewPath];
    objc.desc = [TrackerHelp getDescWithSender:self];
    objc.trackId = self.trackId;
    if (self.traceParams) {
        objc.traceParams = self.traceParams;
    } else {
        if ([self isKindOfClass:[UISwitch class]]) {
            UISwitch *item = (UISwitch *)self;
            objc.traceParams = @{@"value" : item.on ? @"open": @"close"};
        }
        if ([self isKindOfClass:[UISegmentedControl class]]) {
            UISegmentedControl *item = (UISegmentedControl *)self;
            objc.traceParams = @{@"index" : [NSString stringWithFormat: @"%ld", (long)item.selectedSegmentIndex]};
        }
    }
    objc.position = [self getPosition];
    return objc;
}

- (UIImage *)viewSnapshot {
    UIGraphicsBeginImageContextWithOptions(self.bounds.size, NO, 0);
    [self.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

- (NSString *)trackId {
    return objc_getAssociatedObject(self, &kTrackId);
}

- (void)setTrackId:(NSString *)trackId {
    objc_setAssociatedObject(self, &kTrackId, trackId, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSDictionary *)traceParams {
    return  objc_getAssociatedObject(self, &kTraceParams);
}

- (void)setTraceParams:(NSDictionary *)traceParams {
    objc_setAssociatedObject(self, &kTraceParams, traceParams, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSTimeInterval)lastActionTime {
    return [objc_getAssociatedObject(self, &kLastActionTime) doubleValue];
}

- (void)setLastActionTime:(NSTimeInterval)lastActionTime {
    objc_setAssociatedObject(self, &kLastActionTime, @(lastActionTime), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (CGRect)getPosition {
    return [self convertRect:self.bounds toView:[[UIApplication sharedApplication] delegate].window];
}

- (UITableView *)myTableView {
    UIView *parent = self.superview;
    while (parent != nil) {
        if ([parent isKindOfClass: [UITableView class]])
            return (UITableView*)parent;
        parent = parent.superview;
    }
    return nil;
}

- (UICollectionView *)myCollectionView {
    UIView *parent = self.superview;
    while (parent != nil) {
        if ([parent isKindOfClass: [UICollectionView class]])
            return (UICollectionView*)parent;
        parent = parent.superview;
    }
    return nil;
}

- (UIViewController *)getViewController {
    UIResponder *next = [self nextResponder];
    do {
        if ([next isKindOfClass:[UIViewController class]]) {
            if ([next isKindOfClass:[UINavigationController class]]) {
                return ((UINavigationController *)next).topViewController;
            }
            return (UIViewController *)next;
        }
        next = [next nextResponder];
    } while (next != nil);

    return nil;
}

- (NSString *)getViewPath {
    NSString *path = nil;
    UIResponder *next = self;
    UIViewController *viewController = [self getViewController];
    UIView *root = nil;
    if (viewController != nil) {
        root = [viewController view];
    }
    do {
        if ([next isKindOfClass: [UIWindow class]]) {
            break;
        }
        NSString *index = @"";
        if ([next isKindOfClass: [UITableViewCell class]]) {
            UITableViewCell * cell = (UITableViewCell *) next;
            UITableView *table = cell.myTableView;
            if (table != nil) {
                NSIndexPath *indexPath = [table indexPathForCell: cell];
                index = [NSString stringWithFormat: @"[%ld,%ld]", indexPath.section, indexPath.row];
            }
        } else if ([next isKindOfClass: [UICollectionViewCell class]]) {
            UICollectionViewCell * cell = (UICollectionViewCell *) next;
            UICollectionView * table = cell.myCollectionView;
            if (table != nil) {
                NSIndexPath *indexPath = [table indexPathForCell: cell];
                index = [NSString stringWithFormat: @"[%ld,%ld]", indexPath.section, indexPath.row];
            }
        } else if ([next isKindOfClass: [UIView class]]) {
            UIView * view = (UIView *) next;
            UIView * parent = view.superview;
            if (parent != nil) {
                index = [NSString stringWithFormat: @"[%tu]", [parent.subviews indexOfObject: view]];
            }
        }
        if (path == nil) {
            path = [NSString stringWithFormat: @"%@%@", [TrackerHelp getClassName: next], index];
        } else {
            path = [NSString stringWithFormat: @"%@%@/%@", [TrackerHelp getClassName: next], index, path];
        }
        next = [next nextResponder];
    } while (next != root);
    return path;
}

@end
