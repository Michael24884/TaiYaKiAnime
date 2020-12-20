//
//  JWTAlgorithmErrorDescription.m
//  JWT
//
//  Created by Dmitry on 7/29/18.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTAlgorithmErrorDescription.h"
#import "JWTAlgorithmErrorDescription+Subclass.h"

@interface JWTAlgorithmErrorDescription (Keys)
+ (NSString *)currentErrorDescriptionKey;
+ (NSString *)externalErrorDescriptionKey;
@end

@implementation JWTAlgorithmErrorDescription (Keys)
+ (NSString *)currentErrorDescriptionKey { return @"errorDescription"; }
+ (NSString *)externalErrorDescriptionKey { return @"externalErrorDescription"; }
@end

@interface JWTAlgorithmErrorDescription ()
+ (NSError *)errorWithCode:(NSInteger)code userDescription:(NSString *)userDescription errorDescription:(NSString *)errorDescription;
+ (NSError *)errorWithCode:(NSInteger)code userDescription:(NSString *)userDescription errorDescription:(NSString *)errorDescription externalErrorDescription:(NSString *)externalErrorDescription;
@end

@implementation JWTAlgorithmErrorDescription
+ (NSString *)userDescriptionForCode:(NSInteger)code {
    NSString *resultString = [self codesAndUserDescriptions][@(code)];
    return resultString ?: [self codesAndUserDescriptions][@([self defaultErrorCode])];
}
+ (NSString *)errorDescriptionForCode:(NSInteger)code {
    NSString *resultString = [self codesAndDescriptions][@(code)];
    return resultString ?: [self codesAndDescriptions][@([self defaultErrorCode])];
}
+ (NSError *)errorWithCode:(NSInteger)code userDescription:(NSString *)userDescription errorDescription:(NSString *)errorDescription {
    return [NSError errorWithDomain:[self errorDomain] code:code userInfo:@{NSLocalizedDescriptionKey: userDescription, [self currentErrorDescriptionKey] : errorDescription}];
}
+ (NSError *)errorWithCode:(NSInteger)code userDescription:(NSString *)userDescription errorDescription:(NSString *)errorDescription externalErrorDescription:(NSString *)externalErrorDescription {
    return [NSError errorWithDomain:[self errorDomain] code:code userInfo:@{NSLocalizedDescriptionKey: userDescription, [self currentErrorDescriptionKey] : errorDescription, [self externalErrorDescriptionKey] : externalErrorDescription}];
}
+ (NSError *)errorWithCode:(NSInteger)code {
    return [self errorWithCode:code userDescription:[self userDescriptionForCode:code] errorDescription:[self errorDescriptionForCode:code]];
}

+ (NSError *)errorWithExternalError:(NSError *)error {
    NSString *externalErrorDescription = [@{@"externalError": error} description];
    __auto_type code = [self externalCodeForInternalError];
    return [self errorWithCode:code userDescription:[self userDescriptionForCode:code] errorDescription:[self errorDescriptionForCode:code] externalErrorDescription:externalErrorDescription];
}
@end

