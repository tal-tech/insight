//
//  TrackerDisplayView.m
//  XHBEventTracker
//
//  Created by 李俊毅 on 2021/4/21.
//

#import "TrackerDisplayView.h"
#import "EventTracker.h"
#import "UIView+Hook.h"
#import "TrackerHelp.h"

@interface DisplayViewManager()

@property (nonatomic, strong) TrackerDisplayView *displayView;

@property (nonatomic, strong) NSString *currentPageName;

@property (nonatomic, strong) UIImage *currentPage;

@property (nonatomic, strong) UIView *currentItemView;

@property (nonatomic, strong) TrackerObject *currentItemObjc;

@property (nonatomic, strong) UIImage *currentItemPage;

@property (nonatomic, strong) NSMutableArray *cachePages;

@property (nonatomic, strong) NSMutableArray *cacheItems;

@end

@implementation DisplayViewManager

+ (DisplayViewManager *)shareInstance {
    static DisplayViewManager *instance = nil;
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (void)showDisplayView {
    if (!_displayView) {
        _displayView = [[TrackerDisplayView alloc] initWithFrame:CGRectMake(0, 200, [UIScreen mainScreen].bounds.size.width * 0.75, 400)];
        UIWindow *window = [[UIApplication sharedApplication] delegate].window;
        [window addSubview:_displayView];
    }
}

- (void)dismissDisplayView {
    [_displayView removeFromSuperview];
    _displayView = nil;
}

- (void)setHidden:(BOOL)hidden {
    _displayView.hidden = hidden;
}

- (void)setPageName:(NSString *)name {
    _currentPageName = name;
    _currentPage = [TrackerHelp takeScreenshot];
    [_displayView setPageName:name];
    if (![_cachePages containsObject:name] && self.isAutoUpload) {
        [self uploadPageInfor];
        [_cachePages addObject:name];
    }
}

- (void)uploadPageInfor {
    if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(pageShowWithName:displayImage:)]) {
        [[[EventTracker shareInstance] delegate] pageShowWithName:_currentPageName displayImage:_currentPage];
    }
}

- (void)setInforWithView:(UIView *)view {
    _currentItemView = view;
    _currentItemPage = [TrackerHelp takeScreenshot];
    _currentItemObjc = [view getTrackerObject];
    [_displayView setItemInfor:_currentItemObjc];
    if (![_cacheItems containsObject:_currentItemObjc.path] && self.isAutoUpload) {
        [self uploadItemInfor];
        [_cacheItems addObject:_currentItemObjc.path];
    }
}

- (void)uploadItemInfor {
    if ([[[EventTracker shareInstance] delegate] respondsToSelector:@selector(onAction:page:item:)]) {
        [[[EventTracker shareInstance] delegate] onAction:_currentItemObjc page:_currentItemPage item:[_currentItemView viewSnapshot]];
    }
}

- (NSMutableArray *)cachePages {
    if (_cachePages == nil) {
        _cachePages = [[NSMutableArray alloc] init];
    }
    return _cachePages;
}

- (NSMutableArray *)cacheItems {
    if (_cacheItems == nil) {
        _cacheItems = [[NSMutableArray alloc] init];
    }
    return _cacheItems;
}

@end


@interface TrackerDisplayView()

@property (nonatomic, strong) UIButton *stopActionBtn;
@property (nonatomic, strong) UIButton *autoUploadBtn;
@property (nonatomic, strong) UIButton *changeSizeBtn;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) UILabel *pageTitleLabel;
@property (nonatomic, strong) UIButton *pageCopyBtn;
@property (nonatomic, strong) UILabel *pageNameLabel;
@property (nonatomic, strong) UIButton *uploadPageBtn;
@property (nonatomic, strong) UILabel *itemTitleLabel;
@property (nonatomic, strong) UIButton *itemCopyBtn;
@property (nonatomic, strong) UILabel *itemInforLabel;
@property (nonatomic, strong) UIButton *uploadItemBtn;

@end

@implementation TrackerDisplayView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self configUI];
    }
    return self;
}

- (void)setPageName:(NSString *)name {
    _pageNameLabel.text = name;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.2), dispatch_get_main_queue(), ^{
        UIWindow *window = [[UIApplication sharedApplication] delegate].window;
        [window bringSubviewToFront:self];
    });
}

- (void)setItemInfor:(TrackerObject *)objc {
    NSString *infor = [NSString stringWithFormat:@"viewControllerName:%@\nsubViewControllerName:%@\nviewControllerTitle:%@\npath:%@\ndesc:%@\ntrackId:%@\ntraceParams:%@", objc.viewControllerName, objc.subViewControllerName, objc.viewControllerTitle, objc.path, objc.desc, objc.trackId, objc.traceParams];
    _itemInforLabel.text = infor;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.2), dispatch_get_main_queue(), ^{
        UIWindow *window = [[UIApplication sharedApplication] delegate].window;
        [window bringSubviewToFront:self];
    });
}

- (void)onUploadPageInfor {
    [[DisplayViewManager shareInstance] uploadPageInfor];
}

- (void)onUploadItemInfor {
    [[DisplayViewManager shareInstance] uploadItemInfor];
}

- (void)onAutoUpload:(UIButton *)button {
    button.selected = !button.selected;
    if (button.isSelected) {
        button.backgroundColor = [UIColor blueColor];
    } else {
        button.backgroundColor = [UIColor whiteColor];
    }
    [DisplayViewManager shareInstance].isAutoUpload = button.selected;
}

- (void)onStopAction:(UIButton *)button {
    button.selected = !button.selected;
    if (button.isSelected) {
        button.backgroundColor = [UIColor blueColor];
    } else {
        button.backgroundColor = [UIColor whiteColor];
    }
    [DisplayViewManager shareInstance].isStopAction = button.selected;
}

- (void)onChangeSize:(UIButton *)button {
    button.selected = !button.selected;
    if (button.isSelected) {
        [self setFrame:CGRectMake(self.frame.origin.x, self.frame.origin.y, self.frame.size.width, 50)];
    } else {
        [self setFrame:CGRectMake(self.frame.origin.x, self.frame.origin.y, self.frame.size.width, 400)];
    }
    [self layoutIfNeeded];
}

- (void)configUI {
    self.clipsToBounds = YES;
    
    _containerView = [[UIView alloc] initWithFrame:self.bounds];
    _containerView.backgroundColor = [UIColor blackColor];
    [self addSubview:_containerView];
    
    CGFloat width = (self.bounds.size.width - 40) / 3;
    CGFloat y = 10;

    _autoUploadBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, y, width, 30)];
    [_autoUploadBtn setTitle:@"自动上传" forState:UIControlStateNormal];
    [_autoUploadBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _autoUploadBtn.backgroundColor = [UIColor whiteColor];
    [_autoUploadBtn addTarget:self action:@selector(onAutoUpload:) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_autoUploadBtn];
    
    _stopActionBtn = [[UIButton alloc] initWithFrame:CGRectMake(width + 20, y, width, 30)];
    [_stopActionBtn setTitle:@"拦截操作" forState:UIControlStateNormal];
    [_stopActionBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _stopActionBtn.backgroundColor = [UIColor whiteColor];
    [_stopActionBtn addTarget:self action:@selector(onStopAction:) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_stopActionBtn];
    
    _changeSizeBtn = [[UIButton alloc] initWithFrame:CGRectMake(width * 2 + 30, y, width, 30)];
    [_changeSizeBtn setTitle:@"收起" forState:UIControlStateNormal];
    [_changeSizeBtn setTitle:@"展开" forState:UIControlStateSelected];
    [_changeSizeBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _changeSizeBtn.backgroundColor = [UIColor whiteColor];
    [_changeSizeBtn addTarget:self action:@selector(onChangeSize:) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_changeSizeBtn];
    y += 30 + 15;
    
    _pageTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, y, width, 30)];
    _pageTitleLabel.text = @"页面名称:";
    _pageTitleLabel.textColor = [UIColor redColor];
    _pageTitleLabel.font = [UIFont systemFontOfSize:16];
    [_containerView addSubview:_pageTitleLabel];
    
    _pageCopyBtn = [[UIButton alloc] initWithFrame:CGRectMake(width + 20, y, width, 30)];
    [_pageCopyBtn setTitle:@"复制信息" forState:UIControlStateNormal];
    [_pageCopyBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _pageCopyBtn.backgroundColor = [UIColor whiteColor];
    [_pageCopyBtn addTarget:self action:@selector(copyPage) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_pageCopyBtn];
    
    _uploadPageBtn = [[UIButton alloc] initWithFrame:CGRectMake(width * 2 + 30, y, width, 30)];
    [_uploadPageBtn setTitle:@"上传信息" forState:UIControlStateNormal];
    [_uploadPageBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _uploadPageBtn.backgroundColor = [UIColor whiteColor];
    [_uploadPageBtn addTarget:self action:@selector(onUploadPageInfor) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_uploadPageBtn];
    y += 30 + 5;

    _pageNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, y, self.bounds.size.width - 20, 40)];
    _pageNameLabel.backgroundColor = [UIColor whiteColor];
    _pageNameLabel.textColor = [UIColor blackColor];
    _pageNameLabel.numberOfLines = 0;
    _pageNameLabel.font = [UIFont systemFontOfSize:14];
    [_containerView addSubview:_pageNameLabel];
    y += 40 + 15;
    
    _itemTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, y, width, 30)];
    _itemTitleLabel.text = @"元素信息:";
    _itemTitleLabel.textColor = [UIColor redColor];
    _itemTitleLabel.font = [UIFont systemFontOfSize:18];
    [_containerView addSubview:_itemTitleLabel];
    
    _itemCopyBtn = [[UIButton alloc] initWithFrame:CGRectMake(width + 20, y, width, 30)];
    [_itemCopyBtn setTitle:@"复制信息" forState:UIControlStateNormal];
    [_itemCopyBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _itemCopyBtn.backgroundColor = [UIColor whiteColor];
    [_itemCopyBtn addTarget:self action:@selector(copyItem) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_itemCopyBtn];

    _uploadItemBtn = [[UIButton alloc] initWithFrame:CGRectMake(width * 2 + 30, y, width, 30)];
    [_uploadItemBtn setTitle:@"上传信息" forState:UIControlStateNormal];
    [_uploadItemBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _uploadItemBtn.backgroundColor = [UIColor whiteColor];
    [_uploadItemBtn addTarget:self action:@selector(onUploadItemInfor) forControlEvents:UIControlEventTouchUpInside];
    [_containerView addSubview:_uploadItemBtn];
    y += 30 + 5;
    
    _itemInforLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, y, self.bounds.size.width - 20, 160)];
    _itemInforLabel.backgroundColor = [UIColor whiteColor];
    _itemInforLabel.textColor = [UIColor blackColor];
    _itemInforLabel.numberOfLines = 0;
    _itemInforLabel.font = [UIFont systemFontOfSize:14];
    [_containerView addSubview:_itemInforLabel];
    
    UIPanGestureRecognizer *pan = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(dragView:)];
    [self addGestureRecognizer:pan];
}

- (void)copyPage {
    [UIPasteboard generalPasteboard].string = _pageNameLabel.text;
}

- (void)copyItem {
    [UIPasteboard generalPasteboard].string = _itemInforLabel.text;
}

- (void)dragView:(UIPanGestureRecognizer *)pan {
    if (pan.state == UIGestureRecognizerStateChanged) {
        UIView *view = pan.view;
        UIView *superView = view.superview;
        CGPoint translation = [pan translationInView:superView];
        CGPoint center = CGPointMake(view.center.x + translation.x, view.center.y + translation.y);
        center.x = (center.x < view.frame.size.width / 2) ? view.frame.size.width / 2 : center.x;
        center.x = (center.x + view.frame.size.width / 2 > superView.frame.size.width) ? superView.frame.size.width - view.frame.size.width / 2 : center.x;
        center.y = (center.y < view.frame.size.height / 2) ? view.frame.size.height / 2 : center.y;
        center.y = (center.y + view.frame.size.height / 2 > superView.frame.size.height) ? superView.frame.size.height - view.frame.size.height / 2 : center.y;
        view.center = center;
        [pan setTranslation:CGPointZero inView:superView];
    }
}

@end
