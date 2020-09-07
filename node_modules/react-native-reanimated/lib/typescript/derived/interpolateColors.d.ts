/**
 * Use this if you want to interpolate an `Animated.Value` into color values.
 *
 * #### Why is this needed?
 *
 * Unfortunately, if you'll pass color values directly into the `outputRange` option
 * of `interpolate()` function, that won't really work (at least at the moment).
 * See https://github.com/software-mansion/react-native-reanimated/issues/181 .
 *
 * So, for now you can just use this helper instead.
 */
export default function interpolateColors(animationValue: any, options: any): import("../core/AnimatedNode").default<number> | import("../core/AnimatedNode").default<string>;
