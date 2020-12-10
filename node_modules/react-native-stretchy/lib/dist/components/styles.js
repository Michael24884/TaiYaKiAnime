import { StyleSheet, Dimensions } from 'react-native';
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        backgroundColor: 'transparent'
    },
    foregroundContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    }
});
export const stretchyImageStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'absolute',
    },
    animatedImageBackground: {
        width: Dimensions.get('window').width,
        flex: 1,
    },
});
