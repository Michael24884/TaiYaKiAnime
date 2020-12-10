// Copyright 2015 Google Inc.

/** @cond ENABLE_FEATURE_GUI */

#import <GoogleCast/GCKCommon.h>
#import <GoogleCast/GCKDefines.h>

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A subclass of <a href="https://goo.gl/VK61wU"><b>UIButton</b></a> that implements a "Cast"
 * button.
 *
 * @since 3.0
 */
GCK_EXPORT
@interface GCKUICastButton : UIButton

/**
 * A flag that indicates whether a touch event on this button will trigger the display of the
 * Cast dialog that is provided by the framework. By default this property is set to
 * <code>YES</code>. If an application wishes to handle touch events itself, it should set the
 * property to <code>NO</code> and register an appropriate target and action for the touch event.
 */
@property(nonatomic, assign) BOOL triggersDefaultCastDialog;

/**
 * Constructs a new GCKUICastButton using the given decoder.
 */
- (instancetype)initWithCoder:(NSCoder *)decoder;

/**
 * Constructs a new GCKUICastButton with the given frame.
 */
- (instancetype)initWithFrame:(CGRect)frame;

/**
 * Sets the icons for the active, inactive, and animated states of the button. The supplied images
 * should all be single-color with a transparent background. The color of the images is not
 * significant, as the button's tint color (<code>tintColor</code> property) determines the color
 * that they are rendered in.
 */
- (void)setInactiveIcon:(UIImage *)inactiveIcon
             activeIcon:(UIImage *)activeIcon
         animationIcons:(NSArray<UIImage *> *)animationIcons;

/**
 * Sets the accessibility label for the cast states of the button.
 * This is the recommended way to set accessibility label for the button.
 * Label set by setAccessibilityLabel: is applied to all cast states.
 */
- (void)setAccessibilityLabel:(NSString *)label
                 forCastState:(GCKCastState)state;

@end

NS_ASSUME_NONNULL_END

/** @endcond */
