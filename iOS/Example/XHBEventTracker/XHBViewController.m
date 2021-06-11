//
//  XHBViewController.m
//  XHBEventTracker
//
//  Created by 李洋超 on 09/22/2020.
//  Copyright (c) 2020 李洋超. All rights reserved.
//

#import "XHBViewController.h"
#import "OneViewController.h"
#import <Tracker.h>

@interface XHBViewController ()

@end

@implementation XHBViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.

    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.frame = CGRectMake(50, 100, 80, 44);
    [button setTitle:@"button" forState:UIControlStateNormal];
    [button setContentHorizontalAlignment:UIControlContentHorizontalAlignmentLeft];
    [button addTarget:self action:@selector(onClick:) forControlEvents:UIControlEventTouchUpInside];
    button.trackId = @"button1111111";
    button.backgroundColor = [UIColor redColor];
    [self.view addSubview:button];
    
    UISwitch *sw = [[UISwitch alloc] initWithFrame:CGRectMake(150, 100, 100, 44)];
    [sw addTarget:self action:@selector(onChange) forControlEvents:UIControlEventValueChanged];
    sw.trackId = @"UISwitch22222222";
    [self.view addSubview:sw];
    
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(250, 100, 80, 44)];
    label.trackId = @"UILabel33333333";
    label.text = @"label";
    label.userInteractionEnabled = YES;
    [self.view addSubview:label];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onTap)];
    [label addGestureRecognizer:tap];
    
    UISegmentedControl *sc = [[UISegmentedControl alloc] initWithItems:@[@"第一个", @"第二个", @"第三个"]];
    sc.frame = CGRectMake(50, 200, 180, 44);
    [sc addTarget:self action:@selector(segmentedAction:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:sc];
}

- (void)onClick:(UIButton *)sender {
    OneViewController *VC = [OneViewController new];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:VC];
    [self presentViewController:nav animated:true completion:nil];
}

- (void)onChange {
    NSLog(@"UISwitch onChange");
    [EventTracker shareInstance].openDisplay = YES;
}

- (void)onTap {
    NSLog(@"点击label");
    UIAlertController *vc = [UIAlertController alertControllerWithTitle:@"title" message:@"aaaa" preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        NSLog(@"点击确定");
    }];
    [vc addAction:action];
    [self presentViewController:vc animated:true completion:nil];
}

- (void)segmentedAction:(UISegmentedControl *)sender {
    NSLog(@"UISegmentedControl on:%ld", sender.selectedSegmentIndex);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
