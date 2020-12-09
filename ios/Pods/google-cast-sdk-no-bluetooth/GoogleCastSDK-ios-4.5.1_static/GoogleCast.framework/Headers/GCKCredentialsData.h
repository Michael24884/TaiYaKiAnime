#import <Foundation/Foundation.h>

/**
 * A class to maintain the application specific credentials data to identify and
 * possibly authenticates the user.
 */
@interface GCKCredentialsData : NSObject

- (instancetype)init NS_UNAVAILABLE;

/**
 * Initializes and returns a newly allocated @c GCKCredentialsData object with the specified
 * credentials.
 *
 * The @c credentialsType is assigned "ios" as default value to indicate it comes from an iOS
 * sender.
 *
 * @param credentials A string to identify and possibly authenticate the user. May be
 * <code>nil</code>.
 */
- (nullable instancetype)initWithCredentials:(NSString *_Nullable)credentials;

/**
 * Initializes and returns a newly allocated @c GCKCredentialsData object with the specified
 * credentials and credentials type.
 *
 * @param credentials A string to identify and possibly authenticate the user. May be
 * <code>nil</code>.
 * @param credentialsType A string to identify the type of the credentials. May be <code>nil</code>.
 */
- (nullable instancetype)initWithCredentials:(NSString *_Nullable)credentials
                             credentialsType:(NSString *_Nullable)credentialsType
    NS_DESIGNATED_INITIALIZER;

- (NSString *_Nullable)credentials;
- (NSString *_Nullable)credentialsType;

@end
