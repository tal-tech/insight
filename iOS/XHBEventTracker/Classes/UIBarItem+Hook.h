//
//  UIBarItem+Hook.h
//  XHBEventTracker
//
//  Created by 李俊毅 on 2021/4/20.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIBarItem (Hook)

@property (nonatomic, strong, nullable) NSString *trackId;

@property (nonatomic, strong, nullable) NSDictionary *traceParams;

@end

NS_ASSUME_NONNULL_END
