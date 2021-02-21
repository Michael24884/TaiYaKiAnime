//
//  JWTCodingBuilder+FluentStyle.h
//  JWT
//
//  Created by Dmitry Lobanov on 07/06/2019.
//  Copyright © 2019 JWTIO. All rights reserved.
//

#import "JWTCoding+VersionThree.h"
#import <CoreFoundation/CoreFoundation.h>
#import "JWTDeprecations.h"

#if DEPLOYMENT_RUNTIME_SWIFT
#else
NS_ASSUME_NONNULL_BEGIN

// Fluent ( Objective-C exclusive ).
@interface JWTCodingBuilder (FluentStyle)
@property (copy, nonatomic, readonly) JWTCodingBuilder *(^chain)(JWTAlgorithmDataHolderChain *chain);
@property (copy, nonatomic, readonly) JWTCodingBuilder *(^constructChain)(JWTAlgorithmDataHolderChain *(^block)(void));
@property (copy, nonatomic, readonly) JWTCodingBuilder *(^modifyChain)(JWTAlgorithmDataHolderChain *(^block)(JWTAlgorithmDataHolderChain * chain));
@property (copy, nonatomic, readonly) JWTCodingBuilder *(^options)(NSNumber *options);
@property (copy, nonatomic, readonly) JWTCodingBuilder *(^addHolder)(id<JWTAlgorithmDataHolderProtocol> holder);
@end

@interface JWTEncodingBuilder (FluentStyle)
@property (copy, nonatomic, readonly) JWTEncodingBuilder *(^payload)(NSDictionary *payload);
@property (copy, nonatomic, readonly) JWTEncodingBuilder *(^headers)(NSDictionary *headers);
@property (copy, nonatomic, readonly) JWTEncodingBuilder *(^claimsSet)(JWTClaimsSet *claimsSet);
@end

@interface JWTDecodingBuilder (FluentStyle)
@property (copy, nonatomic, readonly) JWTDecodingBuilder *(^message)(NSString *message);
@property (copy, nonatomic, readonly) JWTDecodingBuilder *(^claimsSet)(JWTClaimsSet *claimsSet);
@end

NS_ASSUME_NONNULL_END
#endif
