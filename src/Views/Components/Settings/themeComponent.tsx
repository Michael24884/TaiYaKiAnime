import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { BaseTheme, LightTheme, TaiyakiBlackTheme, TaiyakiDarkTheme, TaiyakiLightTheme } from '../../../Models';
import { ThemedText } from '../base';
import { useThemeComponentState } from '../storeConnect';

export const ThemeModal: FC<{onPress: (theme: BaseTheme) => void;}> = (props) => {
    const {onPress} = props;
    return (
        <View style={styles.view}>
            <ColorBlocks theme={TaiyakiLightTheme} onPress={onPress} />
            <ColorBlocks theme={TaiyakiDarkTheme} onPress={onPress}/>
            <ColorBlocks theme={TaiyakiBlackTheme} onPress={onPress}/>
        </View>
    )
}

const ColorBlocks: FC<{theme: BaseTheme, onPress: (theme: BaseTheme) => void;}> = (props) => {
    const {theme, onPress} = props;
    
    return (
        <Pressable onPress={() => onPress(theme)}>
            <View style={{flexDirection: 'column', alignItems: 'center', marginBottom: heightPercentageToDP(4), marginTop: heightPercentageToDP(1)}}>
        <View  style={[styles.colorView, {backgroundColor: theme.colors.backgroundColor}]} />
        <ThemedText style={styles.themeName}>{theme.name}</ThemedText>
        </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    colorView: {
        height: heightPercentageToDP(25),
        width: widthPercentageToDP(45),
        margin: heightPercentageToDP(0.8),
        borderWidth: 2,
        borderRadius: 4,
        borderColor: 'grey',
    },
    themeName: {
        fontSize: heightPercentageToDP(1.86),
        fontWeight: '700',
        color: 'white'
    }
});
