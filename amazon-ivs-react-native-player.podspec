require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

File.open("ios/AmazonIvsManager+Framework.swift", "w") { |f|
  f.write <<-IVS
extension AmazonIvsManager {
  @objc public static let frameworkName = "reactnativeplayer"
  @objc public static let frameworkVersion = "#{package["version"]}"
}
IVS
}

Pod::Spec.new do |s|
  s.name         = "amazon-ivs-react-native-player"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "12.4" }
  s.source       = { :git => "https://github.com/aws/amazon-ivs-react-native-player.git", :tag => "#{s.version}" }


  s.source_files = "ios/**/*.{h,m,mm,swift}"


  s.dependency "React-Core"
  s.dependency "AmazonIVSPlayer", "~> 1.25.0-rc.2.1"
end
