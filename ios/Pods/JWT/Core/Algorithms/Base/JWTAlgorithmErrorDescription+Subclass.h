//
//  JWTAlgorithmErrorDescription+Subclass.h
//  JWT
//
//  Created by Dmitry on 7/29/18.
//  Copyright © 2018 JWTIO. All rights reserved.
//

#import "JWTAlgorithmErrorDescription.h"

@interface JWTAlgorithmErrorDescription (Subclass)
+ (NSString *)errorDomain;

// Default error code.
// UnexpectedError for example.
+ (NSInteger)defaultErrorCode;

// Well, the code for internal error wrapper.
// in Swift equivalent is:
// case .internalError(let internalError):
+ (NSInteger)externalCodeForInternalError;

// Mapping errorCode -> NSLocalizedDescriptionKey
+ (NSDictionary *)codesAndUserDescriptions;

// Mapping errorCode -> Description.
// in Swift equivalent is:
// StringConvertable or enum with String value.
+ (NSDictionary *)codesAndDescriptions;
@end
