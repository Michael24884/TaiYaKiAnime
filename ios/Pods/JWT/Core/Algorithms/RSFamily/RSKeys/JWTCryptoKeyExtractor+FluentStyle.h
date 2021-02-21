//
//  JWTCryptoKeyExtractor+FluentStyle.h
//  JWT
//
//  Created by Dmitry Lobanov on 07/06/2019.
//  Copyright © 2019 JWTIO. All rights reserved.
//

#import "JWTCryptoKeyExtractor.h"
#import "JWTDeprecations.h"

#if DEPLOYMENT_RUNTIME_SWIFT
#else
NS_ASSUME_NONNULL_BEGIN

// Fluent ( Objective-C exclusive ).
@interface JWTCryptoKeyExtractor (FluentStyle)
@property (copy, nonatomic, readonly) JWTCryptoKeyExtractor * (^keyBuilder)(JWTCryptoKeyBuilder *keyBuilder);
@end

NS_ASSUME_NONNULL_END
#endif
