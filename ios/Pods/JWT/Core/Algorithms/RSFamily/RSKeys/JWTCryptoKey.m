//
//  JWTCryptoKey.m
//  JWT
//
//  Created by Lobanov Dmitry on 04.02.17.
//  Copyright © 2017 JWTIO. All rights reserved.
//

#import "JWTCryptoKey.h"
#import "JWTCryptoSecurity.h"
#import "JWTCryptoSecurity+Extraction.h"
#import "JWTCryptoSecurity+ExternalRepresentation.h"
#import "JWTCryptoSecurity+ErrorHandling.h"
#import "JWTBase64Coder.h"
@interface JWTCryptoKeyBuilder()
+ (NSString *)keyTypeRSA;
+ (NSString *)keyTypeEC;
@property (assign, nonatomic, readwrite) BOOL public;
@property (assign, nonatomic, readwrite) NSString *keyType;
@property (nonatomic, readonly) BOOL withKeyTypeRSA;
@property (nonatomic, readonly) BOOL withKeyTypeEC;
@end
@implementation JWTCryptoKeyBuilder
+ (NSString *)keyTypeRSA {
    return @"RSA";
}
+ (NSString *)keyTypeEC {
    return @"EC";
}
- (instancetype)keyTypeRSA {
    self.keyType = [self.class keyTypeRSA];
    return self;
}
- (instancetype)keyTypeEC {
    self.keyType = [self.class keyTypeEC];
    return self;
}
- (BOOL)withKeyTypeRSA {
    return [self.keyType isEqualToString:self.class.keyTypeRSA];
}
- (BOOL)withKeyTypeEC {
    return [self.keyType isEqualToString:self.class.keyTypeEC];
}
@end
@interface JWTCryptoKey ()
@property (copy, nonatomic, readwrite) NSString *tag;
@property (assign, nonatomic, readwrite) SecKeyRef key;
@property (copy, nonatomic, readwrite) NSData *rawKey;
@end
@interface JWTCryptoKey (Class)
+ (NSString *)generateUniqueTag;
@end
@implementation JWTCryptoKey (Class)
+ (NSString *)generateUniqueTag {
    return [[NSUUID UUID].UUIDString stringByReplacingOccurrencesOfString:@"-" withString:@""].lowercaseString;
}
@end
@implementation JWTCryptoKey (Parameters)
+ (NSString *)parametersKeyBuilder {
    return NSStringFromSelector(_cmd);
}
@end
@interface JWTCryptoKey (ParametersExtraction)
- (NSString *)extractedSecKeyTypeWithParameters:(NSDictionary *)parameters;
- (JWTCryptoKeyBuilder *)extractedBuilderWithParameters:(NSDictionary *)parameters;
@end
// Consider that both methods in this category should return non-nullable values
@implementation JWTCryptoKey (ParametersExtraction)
// Parameters are nil at that moment, could be used later for some purposes
- (JWTCryptoKeyBuilder *)extractedBuilderWithParameters:(NSDictionary *)parameters {
    return (JWTCryptoKeyBuilder *)parameters[[self.class parametersKeyBuilder]] ?: [JWTCryptoKeyBuilder new].keyTypeRSA;
}
// Parameters are nil at that moment, could be used later for some purposes
- (NSString *)extractedSecKeyTypeWithParameters:(NSDictionary *)parameters {
    JWTCryptoKeyBuilder *builder = [self extractedBuilderWithParameters:parameters];
    if (builder.withKeyTypeEC) {
        return JWTCryptoSecurityKeysTypes.EC;
    }
    return JWTCryptoSecurityKeysTypes.RSA;
}
@end
@interface JWTCryptoKey (Generator) <JWTCryptoKey__Generator__Protocol, JWTCryptoKey__Raw__Generator__Protocol>
@end

@implementation JWTCryptoKey (Generator)
- (instancetype)initWithSecKeyRef:(SecKeyRef)key {
    if (key == NULL) {
        return nil;
    }
    if (self = [super init]) {
        self.key = key;
    }
    return self;
}
- (instancetype)initWithData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    // add check that everything is fine.
    return [super init];
}
- (instancetype)initWithBase64String:(NSString *)base64String parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    return [self initWithData:[JWTBase64Coder dataWithBase64UrlEncodedString:base64String] parameters:parameters error:error];
}
- (instancetype)initWithPemEncoded:(NSString *)encoded parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    //TODO: check correctness.
    //maybe use clean initWithBase64String and remove ?: encoded tail.
    NSString *clean = ((JWTCryptoSecurityComponent *)[[JWTCryptoSecurity componentsFromFileContent:encoded] componentsOfType:JWTCryptoSecurityComponents.Key].firstObject).content ?: encoded;//[JWTCryptoSecurity stringByRemovingPemHeadersFromString:encoded];
    return [self initWithBase64String:clean parameters:parameters error:error];
}
- (instancetype)initWithPemAtURL:(NSURL *)url parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    // contents of url
    NSError *contentsExtractingError = nil;
    NSString *pemEncoded = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:&contentsExtractingError];
    if (error && contentsExtractingError) {
        *error = contentsExtractingError;
        return nil;
    }
    return [self initWithPemEncoded:pemEncoded parameters:parameters error:error];
}
@end

@implementation JWTCryptoKey (Check)
- (void)cleanup {
    if (self.key != NULL) {
        CFRelease(self.key);
    }
}

- (instancetype)checkedWithError:(NSError *__autoreleasing*)error {
    BOOL checked = self.key != NULL;
    if (error && !checked) {
        *error = [NSError errorWithDomain:@"org.opensource.jwt.security.key" code:-200 userInfo:@{NSLocalizedDescriptionKey : @"Security key isn't retrieved! Something went wrong!"}];
    }
    return self;
}
@end

@implementation JWTCryptoKey (ExternalRepresentation)
- (NSString *)externalRepresentationForCoder:(JWTBase64Coder *)coder error:(NSError *__autoreleasing *)error {
    NSData *data = [JWTCryptoSecurity externalRepresentationForKey:self.key error:error];
    NSString *result = (NSString *)[coder ?: JWTBase64Coder.withBase64String stringWithData:data];
    return result;
}
@end

@implementation JWTCryptoKey
- (void)dealloc {
    [self cleanup];
}
@end

@implementation JWTCryptoKeyPublic
- (instancetype)initWithData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    if (self = [super initWithData:data parameters:parameters error:error]) {
        self.tag = [self.class generateUniqueTag];

        if (!data) {
            return nil;
        }

        NSError *removingHeaderError = nil;
        // asks builder
        
        JWTCryptoKeyBuilder *builder = [self extractedBuilderWithParameters:parameters];
        NSData *keyData = data;
        if (builder.withKeyTypeRSA) {
            keyData = [JWTCryptoSecurity dataByRemovingPublicKeyHeader:data error:&removingHeaderError];
            if (!keyData || removingHeaderError) {
                if (error && removingHeaderError != nil) {
                    *error = removingHeaderError;
                }
                return nil;
            }
        }
        
        if (builder.withKeyTypeEC) {
            NSError *theError = nil;
            //  keyData = [JWTCryptoSecurity dataByExtractingKeyFromANS1:data error:&theError];
            if (!keyData || theError) {
                if (error && theError != nil) {
                    *error = theError;
                }
                return nil;
            }
            // unknown here.
            // process keyData before passing it to JWTCryptoSecurity+addKey... method.
//            keyData = [JWTCryptoSecurity dataByRemovingPublicKeyHeader:data error:&removingHeaderError];
//            if (!keyData || removingHeaderError) {
//                if (error && removingHeaderError != nil) {
//                    *error = removingHeaderError;
//                }
//                return nil;
//            }
//            NSData *theData = [data copy];
//            while (theData != nil && theData.length > 0) {
//                NSError *theError = nil;
//                self.key = [JWTCryptoSecurity addKeyWithData:theData asPublic:YES tag:self.tag type:[self extractedSecKeyTypeWithParameters:parameters] error:&theError];
//                NSLog(@"theData: %@", theData);
//                NSLog(@"theError: %@", theError);
//                if (!theError && self.key) {
//                    NSLog(@"Found!");
//                    NSLog(@"theData: %@", theData);
//                    NSLog(@"theKey: %@", self.key);
//                    break;
//                }
//                NSUInteger length = theData.length - 1;
//                NSRange range = NSMakeRange(1, length);
//                theData = [NSData dataWithBytes:((char *)theData.bytes) + range.location length:range.length];
//            }
        }

        NSError *addKeyError = nil;
        
        self.key = [JWTCryptoSecurity addKeyWithData:keyData asPublic:YES tag:self.tag type:[self extractedSecKeyTypeWithParameters:parameters] error:&addKeyError];
        if (!self.key || addKeyError) {
            if (error && addKeyError != nil) {
                *error = addKeyError;
            }
            [self cleanup];
            return nil;
        }
    }
    return self;
}
- (instancetype)initWithCertificateData:(NSData *)certificateData parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    SecKeyRef key = [JWTCryptoSecurity publicKeyFromCertificate:certificateData];
    if (!key) {
        // error: Public certificate incorrect.
        return nil;
    }

    if (self = [super init]) {
        self.key = key;
    }

    return self;
}
- (instancetype)initWithCertificateBase64String:(NSString *)certificate parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    // cleanup certificate if needed.
    // call initWithCertificateData:(NSData *)certificateData
    NSData *certificateData = [JWTBase64Coder dataWithBase64UrlEncodedString:certificate];
    return [self initWithCertificateData:certificateData parameters:parameters error:error];
}
@end

@implementation JWTCryptoKeyPrivate
- (instancetype)initWithData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    if (self = [super initWithData:data parameters:parameters error:error]) {
        self.tag = [self.class generateUniqueTag];
        NSError *addKeyError = nil;
        if (!data) {
            // error: no data?
            // or put it in superclass?
            return nil;
        }
        
        NSData *theData = [data copy];
        JWTCryptoKeyBuilder *builder = [self extractedBuilderWithParameters:parameters];
        if (builder.withKeyTypeEC) {
            // cheat and shit!
            // ahaha. try to find correct key here.
            // possible soultion - dataByExtracting in cryptoKeySecurity.
            while (/* DISABLES CODE */ (0) && theData != nil && theData.length > 0) {
                NSError *theError = nil;
                self.key = [JWTCryptoSecurity addKeyWithData:theData asPublic:NO tag:self.tag type:[self extractedSecKeyTypeWithParameters:parameters] error:&theError];
                NSLog(@"theData: %@", theData);
                NSLog(@"theError: %@", theError);
                if (!theError && self.key) {
                    NSLog(@"Found!");
                    NSLog(@"theData: %@", theData);
                    NSLog(@"theKey: %@", self.key);
                    break;
                }
                NSUInteger length = theData.length - 1;
                NSRange range = NSMakeRange(1, length);
                theData = [NSData dataWithBytes:((char *)theData.bytes) + range.location length:range.length];
            }
        }
        
        self.key = [JWTCryptoSecurity addKeyWithData:theData asPublic:NO tag:self.tag type:[self extractedSecKeyTypeWithParameters:parameters] error:&addKeyError];
        if (!self.key || addKeyError) {
            if (error && addKeyError) {
                *error = addKeyError;
            }
            [self cleanup];
            return nil;
        }
    }
    return self;
}
// Exists
- (instancetype)initWithP12AtURL:(NSURL *)url withPassphrase:(NSString *)passphrase parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    // take data.
    // cleanup if needed.
    NSData *data = [NSData dataWithContentsOfURL:url];
    return [self initWithP12Data:data withPassphrase:passphrase parameters:parameters error:error];
}
- (instancetype)initWithP12Data:(NSData *)p12Data withPassphrase:(NSString *)passphrase parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing*)error {
    if (p12Data == nil) {
        return nil;
    }

    // cleanup if needed.
    SecIdentityRef identity = nil;
    SecTrustRef trust = nil;
    {
        CFErrorRef extractError = NULL;
        [JWTCryptoSecurity extractIdentityAndTrustFromPKCS12:(__bridge CFDataRef)p12Data password:(__bridge CFStringRef)passphrase identity:&identity trust:&trust error:&extractError];
        if (extractError != nil) {
            if (error) {
                *error = (NSError *)CFBridgingRelease(extractError);
                return nil;
            }
        }
    }
    
    BOOL identityAndTrust = identity && trust;
    
    // we don't need trust anymore.
    if (trust) {
        CFRelease(trust);
    }
    
    SecKeyRef privateKey = NULL;
    if (identityAndTrust) {
        OSStatus status = SecIdentityCopyPrivateKey(identity, &privateKey);
        NSError *theError = [JWTCryptoSecurity securityErrorWithOSStatus:status];
        if (theError) {
            if (error) {
                *error = theError;
            }
        }
    }
    
    if (identity) {
        CFRelease(identity);
    }
    
    if (privateKey != NULL) {
        if (self = [super init]) {
            self.key = privateKey;
        }
    }
    
    return self;
}
@end
