import React, { FC } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedText } from '../../Components';

interface BaseProps {
    title: string;
    desc?: string;
    
}

export const BaseSettingsSwitch:FC<BaseProps & {value: boolean; onValue: (arg0: boolean) => void;}> = (props) => {
    const {title, desc, value, onValue} = props;

    return (
        <View style={styles.baseView.view}>
           <View>
           <ThemedText style={styles.baseView.title}>{title}</ThemedText>
           <View style={{width: '85%'}}>
           {desc ? <ThemedText style={styles.baseView.desc}>{desc}</ThemedText> : null}
           </View>
           </View>
           <Switch value={value} onValueChange={onValue} />
        </View>
    )
}

export const BaseSettingsPickers:FC<BaseProps & {value: any[]; currentChoice: string; handled?: () => void}> = (props) => {
    const {title, desc, value, currentChoice, handled} = props;

    return (
        <Pressable onPress={handled} disabled={!handled}>
            <View style={styles.baseView.view}>
           <View>
           <ThemedText style={styles.baseView.title}>{title}</ThemedText>
            <View style={{width: '83%'}}>
            {desc ? <ThemedText style={styles.baseView.desc}>{desc}</ThemedText> : null}
            </View>
           </View>
           <ThemedText style={styles.baseView.currentChoice}>{currentChoice}</ThemedText>
        </View>
        </Pressable>
    )
}

const styles = {
    baseView: StyleSheet.create({
        view: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: heightPercentageToDP(3.2)
        },
        title: {
            fontWeight: '700',
            fontSize: heightPercentageToDP(2)
        },
        desc: {
            fontSize: heightPercentageToDP(1.5)
        },
        currentChoice: {
            fontSize: heightPercentageToDP(1.5),
            fontWeight: '600'
        }
    })
}