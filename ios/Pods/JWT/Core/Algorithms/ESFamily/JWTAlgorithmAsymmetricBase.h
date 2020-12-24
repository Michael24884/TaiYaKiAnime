//
//  JWTAlgorithmAsymmetricBase.h
//  Base64
//
//  Created by Lobanov Dmitry on 12.03.2018.
//

#import <Foundation/Foundation.h>
#import "JWTRSAlgorithm.h"
#import "JWTAlgorithmErrorDescription.h"

extern NSString *const JWTAlgorithmAsymmetricFamilyErrorDomain;
typedef NS_ENUM(NSInteger, JWTAlgorithmAsymmetricFamilyError) {
    JWTAlgorithmAsymmetricFamilyErrorInternalSecurityAPI = -98,
    JWTAlgorithmAsymmetricFamilyErrorAlgorithmIsNotSupported = -50,
    JWTAlgorithmAsymmetricFamilyErrorUnexpected = -20
};

@interface JWTAlgorithmAsymmetricFamilyErrorDescription : JWTAlgorithmErrorDescription @end

@interface JWTAlgorithmAsymmetricBase : NSObject @end

@interface JWTAlgorithmAsymmetricBase (JWTAsymmetricKeysAlgorithm) <JWTRSAlgorithm> @end

@interface JWTAlgorithmAsymmetricBase (Create)

// default.
+ (instancetype)withRS;
+ (instancetype)withES;
+ (instancetype)withPS API_AVAILABLE(macos(10.13), ios(11.0), watchos(4.0), tvos(11.0));
- (instancetype)with256;
- (instancetype)with384;
- (instancetype)with512;

@end

