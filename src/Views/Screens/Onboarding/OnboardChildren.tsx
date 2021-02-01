import React, { FC, useEffect, useRef } from 'react';
import {StyleSheet, View, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import { useTheme } from '../../../Stores';
import { ThemedButton, ThemedText } from '../../Components';
import { AnimatedLogo } from '../../Components/animated_logo';

const {height, width} = Dimensions.get('window');



interface Props {
    onNextButton: () => void;
}

export const OnboardChild1: FC<Props> = (props) => {
    const theme = useTheme((_) => _.theme);

    const controller = useRef(new Animated.Value(1.25)).current;
    const opacity = controller.interpolate({
        inputRange: [1, 1.25],
        outputRange: [1, 0]
    })

    const textController = useRef(new Animated.Value(0)).current;
    const translateX = textController.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.75, 0],
    });
    const subtitleController = useRef(new Animated.Value(0)).current;
    const translateX2 = textController.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 1.05, 0],
    });
    

    const imageController =  Animated.timing(controller, {
        toValue: 1,
        useNativeDriver: true,
        duration: 1150,
        delay: 650,
        easing: Easing.out(Easing.ease)
    });
    const textController1 = Animated.timing(textController, {
        toValue: 1,
        useNativeDriver: true,
        duration: 1000,
        delay: 250,
        easing: Easing.inOut(Easing.cubic),
    });
    const textController2 = Animated.timing(subtitleController, {
        toValue: 1,
        useNativeDriver: true,
        duration: 1150,
        delay: 550,
        easing: Easing.inOut(Easing.cubic),
    });

    useEffect(() => {
       Animated.sequence([
           imageController,
           textController1,
           textController2,
       ]).start();
    }, [])


    return (
        <View style={{height: '100%', overflow: 'hidden'}}>
            <Animated.View style={{flex: 1, opacity}}>
            <Animated.Image 
                source={require('../../../assets/images/customs/onboard11.png')}
                style={[styles.image, {transform: [{scale: controller}]}]}
                resizeMethod={'scale'}
                resizeMode={'cover'}
            />
            </Animated.View>
            <LinearGradient pointerEvents={'none'} colors={['rgba(0,0,0,0.25)', theme.colors.backgroundColor]} style={[styles.absolute]} locations={[0.0, 0.85]} />
            <View style={[styles.absolute, {paddingTop: height * 0.2, justifyContent: 'space-between', paddingBottom: height * 0.07}]}>
               <View>
               <AnimatedLogo height={height * 0.2} style={styles.logo} duration={1500} />
          
          <Animated.View style={[styles.textView, {transform: [{translateX}]}]}>
            <ThemedText style={styles.textTitle}>Welcome to Taiyaki!</ThemedText>
          </Animated.View>
          
          <Animated.View style={[styles.textView, { marginTop: height * 0.04 ,transform: [{translateX: translateX2}]}]}>
            <ThemedText style={styles.textSubTitle}>Let's get you set up so you can start watching anime to your preference</ThemedText>
          </Animated.View>
               </View>
            
                <Animated.View style={{
                    transform: [
                        {translateY: textController.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height + 200, 0]
                        })}
                    ]
                }}>
                <ThemedButton onPress={props.onNextButton} title={'Next'} />
                </Animated.View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
    },
    logo: {
        alignSelf: 'center',
    },
    textView: {
        marginTop: height * 0.07,
        paddingHorizontal: width * 0.07
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    textSubTitle: {
        fontWeight: '600',
        fontSize: 18,
    }
})