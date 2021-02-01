import React, {Component, Ref} from 'react';
import {Dimensions, Animated, Platform, StyleSheet, View} from 'react-native';
import { Easing } from 'react-native-reanimated';
import { ThemedText } from './base';

const {height, width} = Dimensions.get('window');

type MessageType = 'SUCCESS' | 'INFO' | 'ERROR';

interface Props {
    ref?: Ref<DropDownAlert>;
}

interface State {
    options: Options | undefined;
    controller: Animated.Value;
};

type Options = {
    title: string;
    duration?: number;
    message?: string;
    type?: MessageType;
}

const messageTypeToColor = new Map<MessageType, string>([
    ['ERROR', 'red'],
    ['INFO', 'blue'],
    ['SUCCESS', 'green'],
]);

class DropDownAlert extends Component<Props, State> {
    
    constructor(props: Props) {
        super(props)
        this.state = {
            options: undefined,
            controller: new Animated.Value(0),
        }
    }

    // animation = Animated.timing(this.state.controller, {
    //     toValue: 1,
    //     useNativeDriver: true,
    //     duration: 750,
    //     easing: Easing.inOut(Easing.linear),
    // });

//    

    show(options: Options) {
        this.setState(() => ({options}));
         Animated.timing(this.state.controller, {
            toValue: 1,
            useNativeDriver: true,
            duration: 750,
            easing: Easing.inOut(Easing.linear),
        }).start(() => {
            if (this.state.options?.duration)
            setTimeout(() => {
                Animated.timing(this.state.controller, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: 750,
                    easing: Easing.inOut(Easing.linear),
                }).start();
            }, this.state.options.duration);
        })
    }


    render() {
        if (!this.state || !this.state.options) return null;
        const {title, message, type} = this.state.options;
        const translateY = this.state.controller.interpolate({
            inputRange: [0, 1],
            outputRange: [-height, 0]
        })

        return (
            <Animated.View style={[styles.view, {backgroundColor: messageTypeToColor.get(type || 'SUCCESS')!, transform: [{translateY}]}]}>
                <View style={{height: '100%', justifyContent: 'flex-end', padding: 10}}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? height * 0.13 : height * 0.11,
        zIndex: 400,
        justifyContent: 'center'
    },
    textView: {
        padding: width * 0.2,
        backgroundColor: 'orange'
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
    },
    message: {
        fontSize: 14,
    }
});

export default DropDownAlert;
