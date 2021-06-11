//
//  TwoViewController.m
//  XHBEventTracker_Example
//
//  Created by 李俊毅 on 2020/9/23.
//  Copyright © 2020 李洋超. All rights reserved.
//

#import "TwoViewController.h"
#import <Tracker.h>

@implementation CustomCollectionCell

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectZero];
        titleLabel.textAlignment = NSTextAlignmentCenter;
        titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        titleLabel.numberOfLines = 0;
        [self.contentView addSubview:titleLabel];
        self.titleLabel = titleLabel;
    }
    return self;
}

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    _titleLabel.frame = bounds;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.titleLabel.frame = self.contentView.bounds;
}

@end

@interface TwoViewController ()<UICollectionViewDelegate, UICollectionViewDataSource>

@property (strong, nonatomic) NSMutableArray *datas;

@end

@implementation TwoViewController

- (void)viewDidLoad {
    [super viewDidLoad];
        
    self.view.backgroundColor = [UIColor whiteColor];
    self.title = @"two";
    
    self.datas = [NSMutableArray arrayWithCapacity:1000];
    
    for (int i = 0; i < 1000; i++) {
        [self.datas addObject: [NSString stringWithFormat:@"%d", i]];
    }
    
    UICollectionViewFlowLayout *flow = [[UICollectionViewFlowLayout alloc] init];
    flow.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    flow.sectionInset = UIEdgeInsetsZero;
    flow.minimumInteritemSpacing = 0;
    flow.minimumLineSpacing = 0;
    UICollectionView *showCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height) collectionViewLayout:flow];
    showCollectionView.pagingEnabled = YES;
    showCollectionView.bounces = NO;
    showCollectionView.showsHorizontalScrollIndicator = NO;
    showCollectionView.backgroundColor = [UIColor whiteColor];
    showCollectionView.dataSource = self;
    showCollectionView.delegate = self;
    [showCollectionView registerClass:[CustomCollectionCell class] forCellWithReuseIdentifier:@"CustomCollectionCell"];
    [self.view addSubview:showCollectionView];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (nonnull __kindof UICollectionViewCell *)collectionView:(nonnull UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    CustomCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"CustomCollectionCell" forIndexPath:indexPath];
    cell.titleLabel.text = [self.datas objectAtIndex:indexPath.row];
    cell.trackId = [self.datas objectAtIndex:indexPath.row];
    return cell;
}

- (NSInteger)collectionView:(nonnull UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.datas.count;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"点击collectionView");
}

@end
