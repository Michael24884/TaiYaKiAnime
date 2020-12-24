//
//  JWTAlgorithmFactory.m
//  JWT
//
//  Created by Lobanov Dmitry on 07.10.15.
//  Copyright © 2015 Karma. All rights reserved.
//

#import "JWTAlgorithmFactory.h"
#import "JWTAlgorithmHSBase.h"
#import "JWTAlgorithmRSBase.h"
#import "JWTAlgorithmNone.h"
#import "JWTAlgorithmAsymmetricBase.h"

// not implemented.
// ES still not implemented. Look at implementation and readme in future releases.

@implementation JWTAlgorithmFactory

+ (BOOL)checkIfSecurityAPIAvailable {
    BOOL result = NO;
#if TARGET_OS_MAC && TARGET_OS_IPHONE // iOS >= 10
    result = [[NSProcessInfo processInfo] isOperatingSystemAtLeastVersion:(NSOperatingSystemVersion){10, 0, 0}];
#elif TARGET_OS_MAC && !TARGET_OS_IPHONE // macOS >= 10.12
    result = [[NSProcessInfo processInfo] isOperatingSystemAtLeastVersion:(NSOperatingSystemVersion){10, 12, 0}];
#endif
    return result;
}

+ (NSArray<id<JWTAlgorithm>> *)algorithms {
    if ([self checkIfSecurityAPIAvailable]) {
        return @[
                 [JWTAlgorithmNone new],
                 [JWTAlgorithmHSBase algorithm256],
                 [JWTAlgorithmHSBase algorithm384],
                 [JWTAlgorithmHSBase algorithm512],
                 [JWTAlgorithmAsymmetricBase withRS].with256,
                 [JWTAlgorithmAsymmetricBase withRS].with384,
                 [JWTAlgorithmAsymmetricBase withRS].with512,
                 [JWTAlgorithmAsymmetricBase withES].with256,
                 [JWTAlgorithmAsymmetricBase withES].with384,
                 [JWTAlgorithmAsymmetricBase withES].with512
                 ];
    }
    
    return @[
            [JWTAlgorithmNone new],
            [JWTAlgorithmHSBase algorithm256],
            [JWTAlgorithmHSBase algorithm384],
            [JWTAlgorithmHSBase algorithm512],
            [JWTAlgorithmRSBase algorithm256],
            [JWTAlgorithmRSBase algorithm384],
            [JWTAlgorithmRSBase algorithm512]
            ];

}

+ (id<JWTAlgorithm>)algorithmByName:(NSString *)name {
    id<JWTAlgorithm> algorithm = nil;
    
    NSString *algName = [name copy];
    
    NSUInteger index = [[self algorithms] indexOfObjectPassingTest:^BOOL(id<JWTAlgorithm> obj, NSUInteger idx, BOOL *stop) {
        // lowercase comparison
        return [obj.name.lowercaseString isEqualToString:algName.lowercaseString];
    }];
    
    if (index != NSNotFound) {
        algorithm = [self algorithms][index];
    }
    
    return algorithm;
}

@end
