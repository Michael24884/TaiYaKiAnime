//
//  JWTBuilder+FluentStyle.h
//  JWT
//
//  Created by Dmitry Lobanov on 15/06/2019.
//  Copyright © 2019 JWTIO. All rights reserved.
//

#import "JWTCoding+VersionTwo.h"
#import "JWTDeprecations.h"

#if DEPLOYMENT_RUNTIME_SWIFT
#else
NS_ASSUME_NONNULL_BEGIN

// Fluent ( Objective-C exclusive ).
@interface JWTBuilder (FluentStyle)
/**
 Sets jwtMessage and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^message)(NSString *message);

/**
 Sets jwtPayload and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^payload)(NSDictionary *payload);

/**
 Sets jwtHeaders and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^headers)(NSDictionary *headers);

/**
 Sets jwtClaimsSet and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^claimsSet)(JWTClaimsSet *claimsSet);

/**
 Sets jwtSecret and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^secret)(NSString *secret);

/**
 Sets jwtSecretData and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^secretData)(NSData *secretData);

/**
 Sets jwtPrivateKeyCertificatePassphrase and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^privateKeyCertificatePassphrase)(NSString *privateKeyCertificatePassphrase);

/**
 Sets jwtAlgorithm and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^algorithm)(id<JWTAlgorithm>algorithm);

/**
 Sets jwtAlgorithmName and returns the JWTBuilder to allow for method chaining. See list of names in appropriate headers.
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^algorithmName)(NSString *algorithmName);

/**
 Sets jwtOptions and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^options)(NSNumber *options);

/**
 Sets algorithmWhitelist and returns the JWTBuilder to allow for method chaining
 */
@property (copy, nonatomic, readonly) JWTBuilder *(^whitelist)(NSArray *whitelist);
@end

NS_ASSUME_NONNULL_END
#endif
