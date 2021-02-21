//
//  JWTCryptoKeyExtractor.m
//  JWT
//
//  Created by Lobanov Dmitry on 04.02.17.
//  Copyright © 2017 JWTIO. All rights reserved.
//

#import "JWTCryptoKeyExtractor.h"
#import "JWTCryptoKey.h"
#import "JWTBase64Coder.h"

@interface JWTCryptoKeyExtractor ()
@property (strong, nonatomic, readwrite) JWTCryptoKeyBuilder *internalKeyBuilder;
@property (copy, nonatomic, readwrite) JWTCryptoKeyExtractor * (^keyBuilder)(JWTCryptoKeyBuilder *keyBuilder);
@end

@interface JWTCryptoKeyExtractor (Parameters)
- (NSDictionary *)enhancedParameters:(NSDictionary *)parameters;
@end

@implementation JWTCryptoKeyExtractor (Parameters)
- (NSDictionary *)enhancedParameters:(NSDictionary *)parameters {
    if (self.internalKeyBuilder != nil) {
        NSMutableDictionary *theParameters = [NSMutableDictionary dictionaryWithDictionary:parameters ?: @{}];
        [theParameters setObject:self.internalKeyBuilder forKeyedSubscript:JWTCryptoKey.parametersKeyBuilder];
    }
    return parameters;
}
@end

@implementation JWTCryptoKeyExtractor
- (NSString *)type {
    return self.class.type;
}
+ (NSString *)type {
	return NSStringFromClass(self);
}
+ (NSString *)parametersKeyCertificatePassphrase {
    return NSStringFromSelector(_cmd);
}

- (instancetype)init {
    if (self = [super init]) {
        [self setupFluent];
    }
    return self;
}

#pragma mark - Fluent
- (void)setupFluent {
    __weak typeof(self) weakSelf = self;
    self.keyBuilder = ^(JWTCryptoKeyBuilder *keyBuilder) {
        return [weakSelf configuredByKeyBuilder:keyBuilder];
    };
}

#pragma mark - <JWTCryptoKeyExtractorProtocol>
- (id<JWTCryptoKeyProtocol>)keyFromData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
//#pragma message "Not Implemented"
    if (error) {
        *error = [NSError errorWithDomain:@"io.jwt.crypto.rsa" code:-100 userInfo:@{
                                                                                    NSLocalizedDescriptionKey : @"Method not implemented"
                                                                                    }];
    }
    return nil;
}
- (id<JWTCryptoKeyProtocol>)keyFromString:(NSString *)string parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    if (error) {
        *error = [NSError errorWithDomain:@"io.jwt.crypto.rsa" code:-100 userInfo:@{
                                                                           NSLocalizedDescriptionKey : @"Method not implemented"
                                                                           }];
    }
    return nil;
}
@end

@implementation JWTCryptoKeyExtractor (Setters)
- (instancetype)configuredByKeyBuilder:(JWTCryptoKeyBuilder *)keyBuilder {
    self.internalKeyBuilder = keyBuilder;
    return self;
}
@end

@interface JWTCryptoKeyExtractor_Public_Pem_Certificate : JWTCryptoKeyExtractor @end

@implementation JWTCryptoKeyExtractor_Public_Pem_Certificate
- (id<JWTCryptoKeyProtocol>)keyFromData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    NSDictionary *theParameters = [self enhancedParameters:parameters];
    return [[JWTCryptoKeyPublic alloc] initWithCertificateData:data parameters:theParameters error:error];
}
@end

@interface JWTCryptoKeyExtractor_Private_P12 : JWTCryptoKeyExtractor @end

@implementation JWTCryptoKeyExtractor_Private_P12
- (id<JWTCryptoKeyProtocol>)keyFromData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    NSString *certificatePassphrase = parameters[self.class.parametersKeyCertificatePassphrase];
    if ([certificatePassphrase isEqual:[NSNull null]]) {
        certificatePassphrase = nil;
    }
    NSDictionary *theParameters = [self enhancedParameters:parameters];
    return [[JWTCryptoKeyPrivate alloc] initWithP12Data:data withPassphrase:certificatePassphrase parameters:theParameters error:error];
}
@end

@interface JWTCryptoKeyExtractor_Public_Pem_Key : JWTCryptoKeyExtractor @end

@implementation JWTCryptoKeyExtractor_Public_Pem_Key
- (id<JWTCryptoKeyProtocol>)keyFromData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    return [self keyFromString:[JWTBase64Coder base64UrlEncodedStringWithData:data] parameters:parameters error:error];
}
- (id<JWTCryptoKeyProtocol>)keyFromString:(NSString *)string parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    NSDictionary *theParameters = [self enhancedParameters:parameters];
    return [[JWTCryptoKeyPublic alloc] initWithPemEncoded:string parameters:theParameters error:error];
}
@end

@interface JWTCryptoKeyExtractor_Private_Pem_Key : JWTCryptoKeyExtractor @end

@implementation JWTCryptoKeyExtractor_Private_Pem_Key
- (id<JWTCryptoKeyProtocol>)keyFromData:(NSData *)data parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    return [self keyFromString:[JWTBase64Coder base64UrlEncodedStringWithData:data] parameters:parameters error:error];
}
- (id<JWTCryptoKeyProtocol>)keyFromString:(NSString *)string parameters:(NSDictionary *)parameters error:(NSError *__autoreleasing *)error {
    NSDictionary *theParameters = [self enhancedParameters:parameters];
    return [[JWTCryptoKeyPrivate alloc] initWithPemEncoded:string parameters:theParameters error:error];
}
@end

@implementation JWTCryptoKeyExtractor (ClassCluster)
+ (instancetype)publicKeyWithCertificate {
    return [JWTCryptoKeyExtractor_Public_Pem_Certificate new];
}
+ (instancetype)privateKeyInP12 {
    return [JWTCryptoKeyExtractor_Private_P12 new];
}
+ (instancetype)publicKeyWithPEMBase64 {
    return [JWTCryptoKeyExtractor_Public_Pem_Key new];
}
+ (instancetype)privateKeyWithPEMBase64 {
    return [JWTCryptoKeyExtractor_Private_Pem_Key new];
}
+ (NSArray *)availableExtractors {
    return @[
             [self publicKeyWithCertificate],
             [self privateKeyInP12],
             [self publicKeyWithPEMBase64],
             [self privateKeyWithPEMBase64]
             ];
}
+ (NSDictionary *)typesAndExtractors {
    static NSDictionary *dictionary = nil;
    return dictionary ?: (dictionary = [[NSDictionary alloc] initWithObjects:[self availableExtractors] forKeys:[[self availableExtractors] valueForKey:@"type"]]);
}
+ (instancetype)createWithType:(NSString *)type {
	return [self typesAndExtractors][type];
}
@end
