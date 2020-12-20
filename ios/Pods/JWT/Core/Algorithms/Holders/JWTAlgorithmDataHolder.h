//
//  JWTAlgorithmDataHolder.h
//  JWT
//
//  Created by Lobanov Dmitry on 31.08.16.
//  Copyright © 2016 Karma. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JWTAlgorithm.h"
#import "JWTDeprecations.h"
#import "JWTBase64Coder.h"

// TODO: available in 3.0
// All methods with secret as NSString in algorithms will be deprecated or removed.

@protocol JWTAlgorithmDataHolderProtocol <NSObject, NSCopying>
/**
 The verification key to use when encoding/decoding a JWT in data form
 */
@property (copy, nonatomic, readwrite) NSData *internalSecretData;

/**
 The <JWTAlgorithm> to use for encoding a JWT
 */
@property (strong, nonatomic, readwrite) id <JWTAlgorithm> internalAlgorithm;

/**
 The <JWTStringCoder__Protocol> string coder. It converts data to string and vice versa.
 */
@property (strong, nonatomic, readwrite) id <JWTStringCoder__Protocol> internalStringCoder;
@end

@interface JWTAlgorithmBaseDataHolder : NSObject <JWTAlgorithmDataHolderProtocol>

#pragma mark - Getters
/**
 The verification key to use when encoding/decoding a JWT
 */
@property (copy, nonatomic, readonly) NSString *internalSecret;

/**
 The algorithm name to use for decoding the JWT. Required unless force decode is true
 */
@property (copy, nonatomic, readonly) NSString *internalAlgorithmName;

@end

// Available in Swift and Objective-C.
@interface JWTAlgorithmBaseDataHolder (Setters)
- (instancetype)secretData:(NSData *)secretData;
- (instancetype)secret:(NSString *)secret;
- (instancetype)algorithm:(id<JWTAlgorithm>)algorithm;
- (instancetype)algorithmName:(NSString *)algorithmName;
- (instancetype)stringCoder:(id<JWTStringCoder__Protocol>)stringCoder;
@end

@protocol JWTAlgorithmDataHolderCreateProtocol <NSObject>

+ (instancetype)createWithAlgorithm256;
+ (instancetype)createWithAlgorithm384;
+ (instancetype)createWithAlgorithm512;

@end

@interface JWTAlgorithmNoneDataHolder : JWTAlgorithmBaseDataHolder @end
/*
 Default stringCoder is [JWTBase64Coder withPlainString].
 You could set secretData by secret setter ( holder.secret(secretString) ) in plain format e.g. "secret".
 */
@interface JWTAlgorithmHSFamilyDataHolder : JWTAlgorithmBaseDataHolder <JWTAlgorithmDataHolderCreateProtocol>
@end

@protocol JWTCryptoKeyProtocol;

/*
 JWTAlgorithmRSFamilyDataHolder actually is JWTAlgorithmAsymmetricTypeDataHolder.
 It will be renamed later.
 */
@interface JWTAlgorithmRSFamilyDataHolder : JWTAlgorithmBaseDataHolder <JWTAlgorithmDataHolderCreateProtocol>
/*
 Default stringCoder is [JWTBase64Coder withBase64String].
 You could set secretData by secret setter ( holder.secret(secretString) ) in base64 format e.g. put pem file content in it (ugly string with equal sign at the end for example).
 */
@end

@interface JWTAlgorithmRSFamilyDataHolder (Getters)
/**
 The passphrase for the PKCS12 blob, which represents the certificate containing the private key for the RS algorithms.
 */
@property (copy, nonatomic, readonly) NSString *internalPrivateKeyCertificatePassphrase;
@property (copy, nonatomic, readonly) NSString *internalKeyExtractorType;
@property (strong, nonatomic, readonly) id<JWTCryptoKeyProtocol> internalSignKey;
@property (strong, nonatomic, readonly) id<JWTCryptoKeyProtocol> internalVerifyKey;
@end

// Available in Swift and Objective-C.
@interface JWTAlgorithmRSFamilyDataHolder (Setters)
- (instancetype)privateKeyCertificatePassphrase:(NSString *)passphrase;
- (instancetype)keyExtractorType:(NSString *)type;
- (instancetype)signKey:(id<JWTCryptoKeyProtocol>)key;
- (instancetype)verifyKey:(id<JWTCryptoKeyProtocol>)key;
@end
