//
//  OneViewController.m
//  XHBEventTracker_Example
//
//  Created by 李俊毅 on 2020/9/23.
//  Copyright © 2020 李洋超. All rights reserved.
//

#import "OneViewController.h"
#import "TwoViewController.h"
#import <Tracker.h>
#import "One1ViewController.h"

@implementation CustomCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    self.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    return self;
}

@end

@interface OneViewController ()<UITableViewDelegate, UITableViewDataSource>

@property (strong, nonatomic) NSMutableArray *datas;

@end

@implementation OneViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    self.title = @"one";
    UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"close" style:UIBarButtonItemStylePlain target:self action:@selector(onClose)];
    self.navigationItem.rightBarButtonItem = item;
    
    self.datas = [NSMutableArray arrayWithCapacity:1000];
    
    for (int i = 0; i < 1000; i++) {
        [self.datas addObject: [NSString stringWithFormat:@"%d", i]];
    }
    
    UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height) style:UITableViewStylePlain];
    tableView.rowHeight = 70;
    tableView.dataSource = self;
    tableView.delegate = self;
    [tableView registerClass:[CustomCell class] forCellReuseIdentifier:@"CustomCell"];
    [self.view addSubview:tableView];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    NSLog(@"111111111");
}

- (nonnull UITableViewCell *)tableView:(nonnull UITableView *)tableView cellForRowAtIndexPath:(nonnull NSIndexPath *)indexPath {
    CustomCell *cell = [tableView dequeueReusableCellWithIdentifier:@"CustomCell" forIndexPath:indexPath];
    cell.textLabel.text = [self.datas objectAtIndex:indexPath.row];
    cell.trackId = [self.datas objectAtIndex:indexPath.row];
    return cell;
}

- (NSInteger)tableView:(nonnull UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.datas.count;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    One1ViewController *two = [[One1ViewController alloc] init];
    [self presentViewController:two animated:true completion:nil];
}

- (void)onClose {
    [self dismissViewControllerAnimated:true completion:nil];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
