import {ScaledSheet, moderateVerticalScale, moderateScale} from 'react-native-size-matters';
import {Platform, Dimensions} from 'react-native';
import {isTablet} from 'react-native-device-info';

const {height, width} = Dimensions.get('window');

export const styles = ScaledSheet.create({
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowView: { flexDirection: 'row' },
    titleView: {
        paddingHorizontal: moderateScale(width * 0.02),
        paddingTop: '10@ms',
        marginBottom: moderateScale(height * 0.03),
        flexShrink: 0.8,
        height: moderateVerticalScale(height * 0.14),
        
    },
    scroller: {
        flex: 1,
        // transform: [{translateY: -height * 0.13}],
    },
    surface: {
        marginHorizontal: width * 0.025,
        paddingHorizontal: width * 0.03,
        borderRadius: 4,
        ...Platform.select({
            android: { elevation: 4 },
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
        }),
        paddingBottom: '10@mvs',
        marginBottom: moderateVerticalScale(height * 0.022),
    },
    subTitle: {
        fontSize: '19@ms',
        fontWeight: '700',
        marginTop: moderateScale(height * 0.01),
        marginBottom: moderateScale(height * 0.02),
    },
    shadowView: {
        ...Platform.select({
            android: { elevation: 4 },
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: -1, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
        }),
        // position: 'absolute',
        marginTop: -height * 0.07,
        marginLeft: width * 0.04,
    },
    image: {
        width: isTablet() ? moderateScale(180) : moderateScale(width * 0.34),
        height: isTablet() ? '300@mvs' : Platform.OS === 'ios' ? moderateVerticalScale(height * 0.21) : moderateVerticalScale(height * 0.26),
        marginBottom: isTablet() ? '20@mvs' : Platform.OS === 'ios' ? undefined : moderateScale(height * 0.03),
    },
    title: {
        fontSize: '17@ms0.4',
        fontWeight: 'bold',
    },
    englishTitle: {
        color: 'grey',
        fontSize: '13@ms0.3',
        fontWeight: '400',
    },
    synopsis: {
        fontSize: '13@ms0.3',
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genrePills: {
        margin: '4@ms',
        borderRadius: 4,
        justifyContent: 'center',
        padding: '8@ms',
    },
    genreText: {
        color: 'white',
        fontSize: '13@ms',
        fontWeight: '600',
    },
    infoRowView: {
        justifyContent: 'space-around',
    },
    infoRowTitle: {
        textAlign: 'center',
        fontSize: '22@ms',
        fontWeight: '700',
        color: 'grey',
    },
    infoRowData: {
        textAlign: 'center',
        fontSize: '14@ms',
        fontWeight: '400',
        color: 'grey',
        marginVertical: 4,
    },
    infoParentChildWrap: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    imageItems: {
        height: isTablet() ? '360@mvs' : Platform.OS === 'ios' ? height * 0.25 : height * 0.3,
        width: width * 0.34,
        marginHorizontal: width * 0.02,
        marginBottom: 5,
    },
    titleItems: {
        fontSize: '14@ms',
        marginTop: 8,
    },
});