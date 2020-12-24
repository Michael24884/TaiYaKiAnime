//
//  JWTCryptoSecurity.h
//  JWT
//
//  Created by Lobanov Dmitry on 04.02.17.
//  Copyright © 2017 JWTIO. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Security/Security.h>
#import "JWTDeprecations.h"
// Thanks for https://github.com/TakeScoop/SwiftyRSA!
@interface JWTCryptoSecurityKeysTypes : NSObject
+ (NSString *)RSA;
+ (NSString *)EC;
@end

@interface JWTCryptoSecurity : NSObject
+ (NSString *)keyTypeRSA __deprecated_with_replacement("JWTCryptoSecurityKeysTypes.RSA");
+ (NSString *)keyTypeEC __deprecated_with_replacement("JWTCryptoSecurityKeysTypes.EC");
@end

@interface JWTCryptoSecurity (KeysManipulation)
+ (SecKeyRef)addKeyWithData:(NSData *)data asPublic:(BOOL)public tag:(NSString *)tag type:(NSString *)type error:(NSError *__autoreleasing*)error;
+ (SecKeyRef)addKeyWithData:(NSData *)data asPublic:(BOOL)public tag:(NSString *)tag error:(NSError *__autoreleasing*)error;
+ (SecKeyRef)keyByTag:(NSString *)tag error:(NSError *__autoreleasing*)error;
+ (void)removeKeyByTag:(NSString *)tag error:(NSError *__autoreleasing*)error;
@end

@interface JWTCryptoSecurity (Certificates)
+ (OSStatus)extractIdentityAndTrustFromPKCS12:(CFDataRef)inPKCS12Data password:(CFStringRef)password identity:(SecIdentityRef *)outIdentity trust:(SecTrustRef *)outTrust __deprecated_with_replacement("[JWTCryptoSecurity extractIdentityAndTrustFromPKCS12:(CFDataRef)inPKCS12Data password:(CFStringRef)password identity:(SecIdentityRef *)outIdentity trust:(SecTrustRef *)outTrust error:(CFErrorRef *)error]");
+ (OSStatus)extractIdentityAndTrustFromPKCS12:(CFDataRef)inPKCS12Data password:(CFStringRef)password identity:(SecIdentityRef *)outIdentity trust:(SecTrustRef *)outTrust error:(CFErrorRef *)error;
+ (SecKeyRef)publicKeyFromCertificate:(NSData *)certificateData;
@end

@interface JWTCryptoSecurity (PublicKey)
+ (NSData *)dataByRemovingPublicKeyHeader:(NSData *)data error:(NSError *__autoreleasing*)error;
+ (NSData *)dataByExtractingKeyFromANS1:(NSData *)data error:(NSError *__autoreleasing*)error;
@end
