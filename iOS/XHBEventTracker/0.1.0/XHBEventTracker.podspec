#
# Be sure to run `pod lib lint XHBEventTracker.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'XHBEventTracker'
  s.version          = '0.1.0'
  s.summary          = '晓黑板埋点'
  s.description      = '晓黑板无痕埋点工具'

  s.homepage         = ''
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { '李洋超' => '' }
  s.source           = { :git => '', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '8.0'

  s.source_files = 'XHBEventTracker/Classes/**/*'
  
  # s.resource_bundles = {
  #   'XHBEventTracker' => ['XHBEventTracker/Assets/*.png']
  # }

  s.public_header_files = 'XHBEventTracker/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end
