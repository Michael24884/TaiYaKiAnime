//
//  JWTCryptoSecurity+ExternalRepresentation.m
//  JWT
//
//  Created by Dmitry Lobanov on 08.08.2018.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTCryptoSecurity+ExternalRepresentation.h"

@implementation JWTCryptoSecurity (ExternalRepresentation)

+ (NSData *)externalRepresentationForKey:(SecKeyRef)key error:(NSError *__autoreleasing *)error {
    if (key == NULL) {
        return nil;
    }
    
    if (@available(macOS 10.12, iOS 10.0, tvOS 10.0, watchOS 3.0, *)) {
        CFErrorRef copyError = NULL;
        NSData *result = (NSData *)CFBridgingRelease(SecKeyCopyExternalRepresentation(key, &copyError));
        if (error && copyError != NULL) {
            *error = CFBridgingRelease(copyError);
            return nil;
        }
        return result;
        
    } else {
        return nil;
    }
}

@end
