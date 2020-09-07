export default Animation;
declare class Animation {
    static springDefaultState(): {
        position: AnimatedValue<0>;
        finished: AnimatedValue<0>;
        velocity: AnimatedValue<0>;
        time: AnimatedValue<0>;
    };
    static decayDefaultState(): {
        position: AnimatedValue<0>;
        finished: AnimatedValue<0>;
        velocity: AnimatedValue<0>;
        time: AnimatedValue<0>;
    };
    static timingDefaultState(): {
        position: AnimatedValue<0>;
        finished: AnimatedValue<0>;
        time: AnimatedValue<0>;
        frameTime: AnimatedValue<0>;
    };
}
import AnimatedValue from "../core/InternalAnimatedValue";
