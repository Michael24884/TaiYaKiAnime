//
//  JWTAlgorithmErrorDescription+Subclass.m
//  JWT
//
//  Created by Dmitry on 7/29/18.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTAlgorithmErrorDescription+Subclass.h"

@implementation JWTAlgorithmErrorDescription (Subclass)
+ (NSString *)errorDomain {
    return nil;
}
+ (NSInteger)defaultErrorCode {
    return 0;
}
+ (NSInteger)externalCodeForInternalError {
    return 0;
}
+ (NSDictionary *)codesAndUserDescriptions {
    return nil;
}
+ (NSDictionary *)codesAndDescriptions {
    return nil;
}
@end
