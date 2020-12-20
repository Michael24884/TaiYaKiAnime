//
//  JWTAlgorithmRSBase.m
//  JWT
//
//  Created by Lobanov Dmitry on 13.03.16.
//  Copyright © 2016 Karma. All rights reserved.
//

#import "JWTAlgorithmRSBase.h"
#import "JWTBase64Coder.h"
#import "JWTCryptoSecurity.h"
#import "JWTCryptoKeyExtractor.h"
#import "JWTCryptoKey.h"
#import "JWTAlgorithmFactory.h"
#import <CommonCrypto/CommonCrypto.h>

#import "JWTAlgorithmErrorDescription+Subclass.h"
NSString *const JWTAlgorithmRSFamilyErrorDomain = @"io.jwt.jwa.rs";

@implementation JWTAlgorithmRSFamilyErrorDescription
#pragma mark - Subclass
+ (NSString *)errorDomain {
    return JWTAlgorithmRSFamilyErrorDomain;
}
+ (NSInteger)defaultErrorCode {
    return JWTAlgorithmRSFamilyErrorUnexpected;
}
+ (NSInteger)externalErrorCode {
    return JWTAlgorithmRSFamilyErrorInternalSecurityAPI;
}
+ (NSDictionary *)codesAndUserDescriptions {
    static NSDictionary *dictionary = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        dictionary = @{
                       @(JWTAlgorithmRSFamilyErrorIncorrectHashComputation) : @"RS algorithm incorrect hash computation!",
                       @(JWTAlgorithmRSFamilyErrorIncorrectKeySize) : @"RS algorithm incorrect key size. Apple have not sent any response about it.",
                       @(JWTAlgorithmRSFamilyErrorInternalSecurityAPI) : @"RS algorithm internal security framework error.",
                       @(JWTAlgorithmRSFamilyErrorUnexpected) : @"RS algorithm unexpected error!"
                       };
    });
    return dictionary;
}
+ (NSDictionary *)codesAndDescriptions {
    static NSDictionary *dictionary = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        dictionary = @{
                       @(JWTAlgorithmRSFamilyErrorIncorrectHashComputation) : @"JWTAlgorithmRSFamilyErrorIncorrectHashComputation",
                       @(JWTAlgorithmRSFamilyErrorIncorrectKeySize) : @"JWTAlgorithmRSFamilyErrorIncorrectKeySize",
                       @(JWTAlgorithmRSFamilyErrorInternalSecurityAPI) : @"JWTAlgorithmRSFamilyErrorInternalSecurityAPI",
                       @(JWTAlgorithmRSFamilyErrorUnexpected) : @"JWTAlgorithmRSFamilyErrorUnexpected"
                       };
    });
    return dictionary;
}
@end

/*
*    * Possible inheritence *
*
*
*             RSBase (Public + Create-category)
*            /      \
*           /        \
*  RSBaseMac          RSBaseIOS
*           \  ifdef /
*            \      /
*         RSFamilyMember
*                |
*         RSFamilyMemberMutable
*
*/

NSString *const JWTAlgorithmNameRS256 = @"RS256";
NSString *const JWTAlgorithmNameRS384 = @"RS384";
NSString *const JWTAlgorithmNameRS512 = @"RS512";

@interface JWTAlgorithmRSBase()
@property (nonatomic, readonly) id <JWTCryptoKeyExtractorProtocol> keyExtractor;
@end

@implementation JWTAlgorithmRSBase

#pragma mark - NSCopying
- (id)copyWithZone:(NSZone *)zone {
    // create new.
    id <JWTRSAlgorithm> algorithm = (id<JWTRSAlgorithm>)[JWTAlgorithmFactory algorithmByName:[self name]];
    algorithm.privateKeyCertificatePassphrase = self.privateKeyCertificatePassphrase;
    algorithm.keyExtractorType = self.keyExtractorType;
    algorithm.signKey = self.signKey;
    algorithm.verifyKey = self.verifyKey;
    return algorithm;
}

@synthesize privateKeyCertificatePassphrase;
@synthesize keyExtractorType;
@synthesize signKey;
@synthesize verifyKey;
- (id<JWTCryptoKeyExtractorProtocol>) keyExtractor {
    return [JWTCryptoKeyExtractor createWithType:self.keyExtractorType];
}
#pragma mark - Override
- (size_t)ccSHANumberDigestLength {
    @throw [[NSException alloc] initWithName:NSInternalInconsistencyException reason:@"ccSHANumberDigestLength property should be overriden" userInfo:nil];
}

- (uint32_t)secPaddingPKCS1SHANumber {
    @throw [[NSException alloc] initWithName:NSInternalInconsistencyException reason:@"secPaddingPKCS1SHANumber property should be overriden" userInfo:nil];
}

- (unsigned char *)CC_SHANumberWithData:(const void *)data withLength:(CC_LONG)len withHashBytes:(unsigned char *)hashBytes {
    return nil;
}

- (NSString *)name {
    return @"RSBase";
}

#pragma mark - JWTAlgorithm
- (NSDictionary *)verifyKeyExtractorParameters {
    return @{[JWTCryptoKey parametersKeyBuilder] : [JWTCryptoKeyBuilder new].keyTypeRSA};
}
- (NSDictionary *)signKeyExtractorParameters {
    NSMutableDictionary *mutableDictionary = [[self verifyKeyExtractorParameters] mutableCopy];
    mutableDictionary[[JWTCryptoKeyExtractor parametersKeyCertificatePassphrase]] = self.privateKeyCertificatePassphrase ?: [NSNull null];
    return [mutableDictionary copy];
}

- (void)removeKeyItem:(id<JWTCryptoKeyProtocol>)item error:(NSError *__autoreleasing *)error {
    NSError *theError = nil;
    [JWTCryptoSecurity removeKeyByTag:item.tag error:&theError];
    if (theError && error) {
        *error = theError;
    }
}

- (NSData *)signHash:(NSData *)hash key:(NSData *)key error:(NSError *__autoreleasing *)error {
    id<JWTCryptoKeyExtractorProtocol> theExtractor = self.keyExtractor ?: [JWTCryptoKeyExtractor privateKeyInP12];
    NSError *extractKeyError = nil;
    id <JWTCryptoKeyProtocol> keyItem = self.signKey ?: [theExtractor keyFromData:key parameters:[self signKeyExtractorParameters] error:&extractKeyError];
    
    if (extractKeyError || keyItem == nil) {
        // tell about error
        if (extractKeyError && error) {
            *error = extractKeyError;
        }
        NSError *removeError = nil;
        [self removeKeyItem:keyItem error:&removeError];
        return nil;
    }
    else {
        NSError *signError = nil;
        NSData *result = [self signData:hash key:keyItem.key error:&signError];
        if (signError && error) {
            *error = signError;
        }
        return result;
    }
}
- (BOOL)verifyHash:(NSData *)hash signature:(NSData *)signature key:(NSData *)key error:(NSError *__autoreleasing *)error {
    id<JWTCryptoKeyExtractorProtocol> theExtractor = self.keyExtractor ?: [JWTCryptoKeyExtractor publicKeyWithCertificate];
    NSError *extractKeyError = nil;
    id<JWTCryptoKeyProtocol> keyItem = self.verifyKey ?: [theExtractor keyFromData:key parameters:[self verifyKeyExtractorParameters] error:&extractKeyError];
    if (extractKeyError || keyItem == nil) {
        if (extractKeyError && error) {
            *error = extractKeyError;
        }
        NSError *removeError = nil;
        [self removeKeyItem:keyItem error:&removeError];
        return NO;
    }
    else {
        NSError *verifyError = nil;
        BOOL verified = [self verifyData:hash signature:signature key:keyItem.key error:&verifyError];
        if (verifyError && error) {
            *error = verifyError;
        }
        NSError *removeError = nil;
        [self removeKeyItem:keyItem error:&removeError];
        return verified;
    }
}

- (NSData *)encodePayload:(NSString *)theString withSecret:(NSString *)theSecret {
    return [self encodePayloadData:[theString dataUsingEncoding:NSUTF8StringEncoding] withSecret:[JWTBase64Coder dataWithBase64UrlEncodedString:theSecret]];
}
- (NSData *)encodePayloadData:(NSData *)theStringData withSecret:(NSData *)theSecretData {
    return [self signHash:theStringData key:theSecretData error:nil];
}
- (BOOL)verifySignedInput:(NSString *)input withSignature:(NSString *)signature verificationKey:(NSString *)verificationKey {
    NSData *certificateData = [JWTBase64Coder dataWithBase64UrlEncodedString:verificationKey];
    return [self verifySignedInput:input withSignature:signature verificationKeyData:certificateData];
}
- (BOOL)verifySignedInput:(NSString *)input withSignature:(NSString *)signature verificationKeyData:(NSData *)verificationKeyData {
    return [self verifyHash:[input dataUsingEncoding:NSUTF8StringEncoding] signature:[JWTBase64Coder dataWithBase64UrlEncodedString:signature] key:verificationKeyData error:nil];
}

#pragma mark - Private ( Override-part depends on platform )
- (BOOL)verifyData:(NSData *)plainData signature:(NSData *)signature key:(SecKeyRef)publicKey error:(NSError *__autoreleasing*)error {
    return NO;
}

- (NSData *)signData:(NSData *)plainData key:(SecKeyRef)privateKey error:(NSError *__autoreleasing*)error {
    return nil;
}
@end

#if TARGET_OS_MAC && TARGET_OS_IPHONE
@interface JWTAlgorithmRSBaseIOS : JWTAlgorithmRSBase @end
@implementation JWTAlgorithmRSBaseIOS
- (BOOL)verifyData:(NSData *)plainData signature:(NSData *)signature key:(SecKeyRef)publicKey error:(NSError *__autoreleasing *)error {
    size_t signedHashBytesSize = SecKeyGetBlockSize(publicKey);
    const void* signedHashBytes = [signature bytes];

    size_t hashBytesSize = self.ccSHANumberDigestLength;
    uint8_t* hashBytes = malloc(hashBytesSize);
    if (![self CC_SHANumberWithData:[plainData bytes] withLength:(CC_LONG)[plainData length] withHashBytes:hashBytes]) {
        if (error) {
            *error = [JWTAlgorithmRSFamilyErrorDescription errorWithCode:JWTAlgorithmRSFamilyErrorIncorrectHashComputation];
        }
        return false;
    }

    OSStatus status = SecKeyRawVerify(publicKey,
                                      self.secPaddingPKCS1SHANumber,
                                      hashBytes,
                                      hashBytesSize,
                                      signedHashBytes,
                                      signedHashBytesSize);

    return status == errSecSuccess;
}

- (NSData *)signData:(NSData *)plainData key:(SecKeyRef)privateKey error:(NSError *__autoreleasing *)error {
    size_t signedHashBytesSize = SecKeyGetBlockSize(privateKey);
    uint8_t* signedHashBytes = malloc(signedHashBytesSize);
    memset(signedHashBytes, 0x0, signedHashBytesSize);

    size_t hashBytesSize = self.ccSHANumberDigestLength;
    uint8_t* hashBytes = malloc(hashBytesSize);

    // ([plainData bytes], (CC_LONG)[plainData length], hashBytes)
    unsigned char *str = [self CC_SHANumberWithData:[plainData bytes] withLength:(CC_LONG)[plainData length] withHashBytes:hashBytes];

    if (!str) {
        if (error) {
            *error = [JWTAlgorithmRSFamilyErrorDescription errorWithCode:JWTAlgorithmRSFamilyErrorIncorrectHashComputation];
        }
        return nil;
    }

    SecKeyRawSign(privateKey,
                  self.secPaddingPKCS1SHANumber,
                  hashBytes,
                  hashBytesSize,
                  signedHashBytes,
                  &signedHashBytesSize);

    NSData* signedHash = [NSData dataWithBytes:signedHashBytes
                                        length:(NSUInteger)signedHashBytesSize];

    if (hashBytes) {
        free(hashBytes);
    }

    if (signedHashBytes) {
        free(signedHashBytes);
    }

    return signedHash;
}
@end
#endif

#if TARGET_OS_MAC && !TARGET_OS_IPHONE
@interface JWTAlgorithmRSBaseMac : JWTAlgorithmRSBase
- (BOOL)checkKeyConsistency:(SecKeyRef)key;
@end

@implementation JWTAlgorithmRSBaseMac

- (BOOL)checkKeyConsistency:(SecKeyRef)key {
    size_t keyLength = SecKeyGetBlockSize(key);
    size_t hashBytesSize = self.ccSHANumberDigestLength;
    Byte bitsPerByte = /*???*/sizeof(Byte) * CHAR_BIT;
    return keyLength == hashBytesSize * bitsPerByte;
}

- (NSData *)executeTransform:(SecTransformRef)transform withInput:(NSData *)input withDigestType:(CFStringRef)type withDigestLength:(NSNumber *)length withFalseResult:(CFTypeRef)falseResultRef {
    CFErrorRef errorRef = NULL;

    CFTypeRef resultRef = NULL;
    
    // inout
    NSData *resultData = nil;


    BOOL success = transform != NULL;
    //TODO: after import algorithm by pem, this code seems not working well.
    //error: Error Domain=com.apple.security.transforms.error Code=6 "Invalid digest algorithm for RSA signature, choose one of: SHA1, SHA2 (512bits, 348bits, 256bits, or 224 bits), MD2, or MD5"
    //TODO: add error inout parameter to this method.
    if (success) {
        // setup digest type
        success = SecTransformSetAttribute(transform, kSecDigestTypeAttribute, type, &errorRef);
    }

    if (success) {
        // digest length
        success = SecTransformSetAttribute(transform, kSecDigestLengthAttribute, (__bridge CFNumberRef)length, &errorRef);
    }

    if (success) {
        // set input
        success = SecTransformSetAttribute(transform, kSecTransformInputAttributeName, (__bridge CFDataRef)input, &errorRef);
    }

    if (success) {
        // execute
        resultRef = SecTransformExecute(transform, &errorRef);
        success = (resultRef != falseResultRef);
    }

    BOOL positiveResult = success; // resultRef != falseResultRef

    // error
    if (errorRef != NULL) {
        NSLog(@"%@ error: %@", self.debugDescription, (__bridge NSError *)errorRef);
    }
    else {
        if (positiveResult) {
            resultData = (__bridge NSData *)resultRef;
        }
    }

    if (resultRef != NULL) {
        CFRelease(resultRef);
    }
    
    if (errorRef != NULL) {
        CFRelease(errorRef);
    }

    return resultData;
}
- (BOOL)verifyData:(NSData *)plainData signature:(NSData *)signature key:(SecKeyRef)publicKey error:(NSError *__autoreleasing *)error {

    size_t signedHashBytesSize = SecKeyGetBlockSize(publicKey);
    //const void* signedHashBytes = [signature bytes];

    size_t hashBytesSize = self.ccSHANumberDigestLength;
    uint8_t* hashBytes = malloc(hashBytesSize);
    Byte bitsPerByte = /*???*/sizeof(Byte) * CHAR_BIT;
//    NSNumber *plainDataLength = @((CC_LONG)[plainData length]);
    
    if (![self checkKeyConsistency:publicKey]) {
        // error in log!
        // bug?
        NSLog(@"the size of key(%@) should be related to SHA length in bits(%@)", @(signedHashBytesSize), @(hashBytesSize * bitsPerByte));
        if (error) {
            *error = [JWTAlgorithmRSFamilyErrorDescription errorWithCode:JWTAlgorithmRSFamilyErrorIncorrectKeySize];
        }
        return NO;
    }
    
    if (![self CC_SHANumberWithData:[plainData bytes] withLength:(CC_LONG)[plainData length] withHashBytes:hashBytes]) {
        if (error) {
            *error = [JWTAlgorithmRSFamilyErrorDescription errorWithCode:JWTAlgorithmRSFamilyErrorIncorrectHashComputation];
        }
        return NO;
    }

//    NSString *formattedString = [NSString stringWithFormat:@"%@: %@ \n %@: %@ \n %@: %@", @"hashBytesSize", @(hashBytesSize), @"plainDataLength", plainDataLength, @"signedHashBytesSize", @(signedHashBytesSize)];
//
//    NSLog(@"%@ %@", self.debugDescription, formattedString);
    // verify for iOS
//    OSStatus status = SecKeyRawVerify(publicKey,
//                                      self.secPaddingPKCS1SHANumber,
//                                      hashBytes,
//                                      hashBytesSize,
//                                      signedHashBytes,
//                                      signedHashBytesSize);
//    return status == errSecSuccess;
    
    CFErrorRef errorRef = NULL;
    SecTransformRef transform = SecVerifyTransformCreate(publicKey, (__bridge CFDataRef)signature, &errorRef);

    // verification. false result is kCFBooleanFalse
    BOOL result = [self executeTransform:transform withInput:plainData withDigestType:kSecDigestSHA2 withDigestLength:@(signedHashBytesSize) withFalseResult:kCFBooleanFalse] != nil;

    if (transform != NULL) {
        // TODO: WTF?
        // somehow it stops there :/
        // Is it a race condition with removeSecKeyForTag?
        // don't know :(
        CFRelease(transform);
    }
    
    if (errorRef != NULL) {
        CFRelease(errorRef);
    }
    
    if (hashBytes != NULL) {
        free(hashBytes);
    }

    return result;
}

- (NSData *)signData:(NSData *)plainData key:(SecKeyRef)privateKey error:(NSError *__autoreleasing *)error {
    size_t signedHashBytesSize = SecKeyGetBlockSize(privateKey);
    //uint8_t* signedHashBytes = malloc(signedHashBytesSize);
    //memset(signedHashBytes, 0x0, signedHashBytesSize);

    size_t hashBytesSize = self.ccSHANumberDigestLength;
    uint8_t* hashBytes = malloc(hashBytesSize);

    /**
     for sha256
     CC_SHANumberWithData() is CC_SHA256()
     self.secPaddingPKCS1SHANumber = kSecPaddingPKCS1SHA256
     self.ccSHANumberDigestLength  = CC_SHA256_DIGEST_LENGTH
     */

    unsigned char *str = [self CC_SHANumberWithData:[plainData bytes] withLength:(CC_LONG)[plainData length] withHashBytes:hashBytes];

    if (!str) {
        if (error) {
            *error = [JWTAlgorithmRSFamilyErrorDescription errorWithCode:JWTAlgorithmRSFamilyErrorIncorrectHashComputation];
        }
        return nil;
    }

    CFErrorRef errorRef = NULL;

    SecTransformRef transform = SecSignTransformCreate(privateKey, &errorRef);

    NSData *resultData = nil;
    
    // signing: false result is NULL.
    resultData = [self executeTransform:transform withInput:plainData withDigestType:kSecDigestSHA2 withDigestLength:@(signedHashBytesSize) withFalseResult:NULL];

    if (transform != NULL) {
        CFRelease(transform);
    }
    
    if (errorRef != NULL) {
        CFRelease(errorRef);
    }
    
    if (hashBytes != NULL) {
        free(hashBytes);
    }

    return resultData;
}
@end
#endif


// MacOS OR iOS is Base
#if TARGET_OS_MAC && !TARGET_OS_IPHONE
@interface JWTAlgorithmRSFamilyMember : JWTAlgorithmRSBaseMac @end
#else
@interface JWTAlgorithmRSFamilyMember : JWTAlgorithmRSBaseIOS @end
#endif

@interface JWTAlgorithmRS256 : JWTAlgorithmRSFamilyMember @end
@interface JWTAlgorithmRS384 : JWTAlgorithmRSFamilyMember @end
@interface JWTAlgorithmRS512 : JWTAlgorithmRSFamilyMember @end

@implementation JWTAlgorithmRSFamilyMember
- (uint32_t)secPaddingPKCS1SHANumber {
    return 0;
}
@end

@implementation JWTAlgorithmRS256

- (size_t)ccSHANumberDigestLength {
    return CC_SHA256_DIGEST_LENGTH;
}

#if TARGET_OS_MAC && TARGET_OS_IPHONE
- (uint32_t)secPaddingPKCS1SHANumber {
    return kSecPaddingPKCS1SHA256;
}
#endif

- (unsigned char *)CC_SHANumberWithData:(const void *)data withLength:(CC_LONG)len withHashBytes:(unsigned char *)hashBytes {
    return CC_SHA256(data, len, hashBytes);
}

- (NSString *)name {
    return JWTAlgorithmNameRS256;
}

@end

@implementation JWTAlgorithmRS384

- (size_t)ccSHANumberDigestLength {
    return CC_SHA384_DIGEST_LENGTH;
}

#if TARGET_OS_MAC && TARGET_OS_IPHONE
- (uint32_t)secPaddingPKCS1SHANumber {
    return kSecPaddingPKCS1SHA384;
}
#endif

- (unsigned char *)CC_SHANumberWithData:(const void *)data withLength:(CC_LONG)len withHashBytes:(unsigned char *)hashBytes {
    return CC_SHA384(data, len, hashBytes);
}

- (NSString *)name {
    return JWTAlgorithmNameRS384;
}

@end

@implementation JWTAlgorithmRS512

- (size_t)ccSHANumberDigestLength {
    return CC_SHA512_DIGEST_LENGTH;
}

#if TARGET_OS_MAC && TARGET_OS_IPHONE
- (uint32_t)secPaddingPKCS1SHANumber {
    return kSecPaddingPKCS1SHA512;
}
#endif

- (unsigned char *)CC_SHANumberWithData:(const void *)data withLength:(CC_LONG)len withHashBytes:(unsigned char *)hashBytes {
    return CC_SHA512(data, len, hashBytes);
}

- (NSString *)name {
    return JWTAlgorithmNameRS512;
}

@end


@interface JWTAlgorithmRSFamilyMemberMutable : JWTAlgorithmRSFamilyMember

@property (assign, nonatomic, readwrite) size_t ccSHANumberDigestLength;
@property (assign, nonatomic, readwrite) uint32_t secPaddingPKCS1SHANumber;
@property (copy, nonatomic, readwrite) unsigned char * (^ccShaNumberWithData)(const void *data, CC_LONG len, unsigned char *hashBytes);
@property (copy, nonatomic, readwrite) NSString *name;
@end

@implementation JWTAlgorithmRSFamilyMemberMutable

@synthesize ccSHANumberDigestLength = _ccSHANumberDigestLength;
@synthesize secPaddingPKCS1SHANumber = _secPaddingPKCS1SHANumber;
@synthesize name = _name;

- (size_t)ccSHANumberDigestLength {
    return _ccSHANumberDigestLength;
}

- (uint32_t)secPaddingPKCS1SHANumber {
    return _secPaddingPKCS1SHANumber;
}

- (unsigned char *)CC_SHANumberWithData:(const void *)data withLength:(uint32_t)len withHashBytes:(unsigned char *)hashBytes {
    unsigned char *result = [super CC_SHANumberWithData:data withLength:len withHashBytes:hashBytes];
    if (!result && self.ccShaNumberWithData) {
        result = self.ccShaNumberWithData(data, len, hashBytes);
    }
    return result;
}

@end


@implementation JWTAlgorithmRSBase (Create)

+ (instancetype)algorithm256 {
    return [JWTAlgorithmRS256 new];
}

+ (instancetype)algorithm384 {
    return [JWTAlgorithmRS384 new];
}

+ (instancetype)algorithm512 {
    return [JWTAlgorithmRS512 new];
}

+ (instancetype)mutableAlgorithm {
    JWTAlgorithmRSFamilyMemberMutable *base = [JWTAlgorithmRSFamilyMemberMutable new];
    base.ccSHANumberDigestLength = CC_SHA256_DIGEST_LENGTH;

    //set to something ok
    //base.secPaddingPKCS1SHANumber = kSecPaddingPKCS1SHA256;
    base.ccShaNumberWithData = ^unsigned char *(const void *data, CC_LONG len, unsigned char *hashBytes){
        return CC_SHA256(data, len, hashBytes);
    };
    base.name = @"RS256";
    return base;
}

@end
