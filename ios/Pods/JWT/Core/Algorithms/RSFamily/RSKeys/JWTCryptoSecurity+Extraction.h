//
//  JWTCryptoSecurity+Extraction.h
//  JWT
//
//  Created by Dmitry on 7/31/18.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTCryptoSecurity.h"

// content is Base64 string, all '\n' are removed.
@interface JWTCryptoSecurityComponent : NSObject
@property (copy, nonatomic, readwrite) NSString *content;
@property (copy, nonatomic, readwrite) NSString *type;
- (instancetype)initWithContent:(NSString *)content type:(NSString *)type;
@end

@interface JWTCryptoSecurityComponents : NSObject
@property (copy, nonatomic, readonly, class) NSString *Certificate;
@property (copy, nonatomic, readonly, class) NSString *PrivateKey;
@property (copy, nonatomic, readonly, class) NSString *PublicKey;
@property (copy, nonatomic, readonly, class) NSString *Key; // Public or Private

@property (copy, nonatomic, readonly) NSArray *components;

+ (NSArray *)components:(NSArray *)components ofType:(NSString *)type;
- (NSArray *)componentsOfType:(NSString *)type;
@end

@interface JWTCryptoSecurity (Extraction)
+ (JWTCryptoSecurityComponents *)componentsFromFile:(NSURL *)url;
+ (JWTCryptoSecurityComponents *)componentsFromFileContent:(NSString *)content;
@end
