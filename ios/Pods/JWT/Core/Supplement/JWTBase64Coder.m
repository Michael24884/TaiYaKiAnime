//
//  JWTBase64Coder.m
//  Pods
//
//  Created by Lobanov Dmitry on 05.10.16.
//
//

#import "JWTBase64Coder.h"

#ifndef HAS_INCLUDE_MF_Base64Additions_AS_FRAMEWORK
#define HAS_INCLUDE_MF_Base64Additions_AS_FRAMEWORK (__has_include(<Base64/MF_Base64Additions.h>))
#endif

#ifndef HAS_INCLUDE_MF_Base64Additions_AS_PLAIN_LIBRARY
#define HAS_INCLUDE_MF_Base64Additions_AS_PLAIN_LIBRARY (__has_include("MF_Base64Additions.h"))
#endif

#ifndef HAS_INCLUDE_MF_Base64Additions
#define HAS_INCLUDE_MF_Base64Additions (HAS_INCLUDE_MF_Base64Additions_AS_FRAMEWORK || HAS_INCLUDE_MF_Base64Additions_AS_PLAIN_LIBRARY)
#endif

#if HAS_INCLUDE_MF_Base64Additions_AS_FRAMEWORK
#import <Base64/MF_Base64Additions.h>
#elif HAS_INCLUDE_MF_Base64Additions_AS_PLAIN_LIBRARY
#import "MF_Base64Additions.h"
#endif

@interface JWTBase64Coder ()
@property (assign, nonatomic, readwrite) BOOL isBase64String;
@end

@implementation JWTBase64Coder
+ (instancetype)withBase64String {
    JWTBase64Coder* coder = [[self alloc] init];
    coder.isBase64String = YES;
    return coder;
}

+ (instancetype)withPlainString {
    JWTBase64Coder* coder = [[self alloc] init];
    coder.isBase64String = NO;
    return coder;
}
+ (NSString *)base64UrlEncodedStringWithData:(NSData *)data {
#if HAS_INCLUDE_MF_Base64Additions
    if ([data respondsToSelector:@selector(base64UrlEncodedString)]) {
        return [data performSelector:@selector(base64UrlEncodedString)];
    }
    else {
#endif
        return [data base64EncodedStringWithOptions:0];
#if HAS_INCLUDE_MF_Base64Additions
    }
#endif
}

+ (NSData *)dataWithBase64UrlEncodedString:(NSString *)urlEncodedString {
#if HAS_INCLUDE_MF_Base64Additions
    if ([[NSData class] respondsToSelector:@selector(dataWithBase64UrlEncodedString:)]) {
        return [[NSData class] performSelector:@selector(dataWithBase64UrlEncodedString:) withObject:urlEncodedString];
    }
    else {
#endif
        return [[NSData alloc] initWithBase64EncodedString:urlEncodedString options:0];
#if HAS_INCLUDE_MF_Base64Additions
    }
#endif
}

//+ (NSData *)dataWithString:(NSString *)string {
//    // check if base64.
//    if (string == nil) {
//        return nil;
//    }
//
//    // check that string is base64 encoded
////    NSData *data = [[NSData alloc] initWithBase64EncodedString:string options:0];
////
////    NSString *stringToPass = data != nil ? string : [[string dataUsingEncoding:NSUTF8StringEncoding] base64EncodedStringWithOptions:0];
//
//    NSData *result = [self dataWithBase64UrlEncodedString:string];
//    return result;
//}
//
//+ (NSString *)stringWithData:(NSData *)data {
//    return [self.class base64UrlEncodedStringWithData:data];
//}

@end

@implementation JWTBase64Coder (JWTStringCoder__Protocol)
- (NSString *)stringWithData:(NSData *)data {
    NSString *result = nil;
    if (self.isBase64String) {
        result = [self.class base64UrlEncodedStringWithData:data];
    }
    else {
        result = [self.class base64UrlEncodedStringWithData:data];
    }
    return result;
}
- (NSData *)dataWithString:(NSString *)string {
    NSData *result = nil;
    if (self.isBase64String) {
        result = [self.class dataWithBase64UrlEncodedString:string];
    }
    else {
        result = [self.class dataWithBase64UrlEncodedString:[[string dataUsingEncoding:NSUTF8StringEncoding] base64EncodedStringWithOptions:0]];
    }
    return result;
}
@end

@implementation JWTStringCoder__For__Encoding
+ (instancetype)utf8Encoding {
    JWTStringCoder__For__Encoding *coding = [self new];
    coding.stringEncoding = NSUTF8StringEncoding;
    return coding;
}
@end
@implementation JWTStringCoder__For__Encoding (JWTStringCoder__Protocol)
- (NSString *)stringWithData:(NSData *)data {
    return [[NSString alloc] initWithData:data encoding:self.stringEncoding];
}
- (NSData *)dataWithString:(NSString *)string {
    return [string dataUsingEncoding:self.stringEncoding];
}
@end
