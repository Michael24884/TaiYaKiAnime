//
//  JWTCryptoSecurity+ErrorHandling.m
//  JWT
//
//  Created by Dmitry Lobanov on 08.08.2018.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTCryptoSecurity+ErrorHandling.h"

@implementation JWTCryptoSecurity (ErrorHandling)
+ (NSError *)securityErrorWithOSStatus:(OSStatus)status {
    if (status == errSecSuccess) {
        return nil;
    }
    // appropriate for Xcode 9 and higher.
    // rewrite it later?
    if (@available(macOS 10.3, iOS 11.3, tvOS 11.3, watchOS 4.3, *)) {
        NSString *message = (NSString *)CFBridgingRelease(SecCopyErrorMessageString(status, NULL)) ?: @"Unknown error message";
        return [NSError errorWithDomain:NSOSStatusErrorDomain code:status userInfo:@{NSLocalizedDescriptionKey : message}];
    }
    else {
        // Fallback on earlier versions
        // unable to get message?
        return [NSError errorWithDomain:NSOSStatusErrorDomain code:status userInfo:nil];
    }
}
@end
