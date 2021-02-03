import {ScaledSheet, moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {Platform, Dimensions} from 'react-native';
import {isTablet} from 'react-native-device-info';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = Platform.OS === 'ios' ? height * 0.23 : height * 0.45;


export const styles = {
	row: ScaledSheet.create({
		container: {
			height: isTablet() ? '480@mvs' : Platform.OS === 'ios' ? height * 0.41 : height * 0.47,
			width,
			marginVertical: height * 0.01,
        },
        seeAllButton: {
            transform: [{
                scale: isTablet() ? 1.5 : 1,
            }]
        },
		titleView: {
			marginBottom: height * 0.025,
			paddingHorizontal: width * 0.02,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		title: {
			fontSize: '21@ms0.4',
			fontWeight: 'bold',
		},
		subTitle: {
			fontSize: '14@ms0.35',
			fontWeight: '400',
			color: 'grey',
		},
	}),
	card: isTablet() ? ScaledSheet.create({
        view: {
			height: moderateVerticalScale(350),
			width: moderateScale(190),
			marginHorizontal: moderateScale(10),
		},
		image: {
			height: Platform.OS === 'ios' ? '94%' : '55%',
			width: '100%',
			...Platform.select({
				android: { elevation: 4, backgroundColor: 'white' },
				ios: {
					shadowOpacity: 0.2,
					shadowOffset: { width: 0, height: 1 },
					shadowRadius: 6,
					shadowColor: 'black',
				},
			}),
		},
		title: {
			fontSize:'14@ms0.3',
			marginTop: '8@ms',
		},
		subTitle: {
			fontSize: '19@ms',
			fontWeight: '700',
			marginTop: moderateScale(height * 0.01),
			marginBottom: moderateScale(height * 0.01),
		},
    }) :  ScaledSheet.create({
		view: {
			height: moderateVerticalScale(ITEM_HEIGHT),
			width: moderateScale(width * 0.36),
			marginHorizontal: moderateScale(width * 0.02),
		},
		image: {
			height: Platform.OS === 'ios' ? '94%' : '55%',
			width: '100%',
			...Platform.select({
				android: { elevation: 4, backgroundColor: 'white' },
				ios: {
					shadowOpacity: 0.2,
					shadowOffset: { width: 0, height: 1 },
					shadowRadius: 6,
					shadowColor: 'black',
				},
			}),
		},
		title: {
			fontSize: '14@ms0.2',
			marginTop: '8@ms',
		},
		subTitle: {
			fontSize: '19@ms0.1',
			fontWeight: '700',
			marginTop: moderateScale(height * 0.01),
			marginBottom: moderateScale(height * 0.01),
		},
	}),
	tiles: ScaledSheet.create({
		shadowView: {
			marginBottom: 10,
			...Platform.select({
				android: { elevation: 4 },
				ios: {
					shadowOpacity: 0.2,
					shadowOffset: { width: 0, height: 1 },
					shadowRadius: 6,
					shadowColor: 'black',
				},
			}),
		},
		view: {
			borderRadius: 6,
			height: height * 0.21,
			aspectRatio: 1 / 1,
			marginHorizontal: width * 0.02,
		},
		rowView: {
			flexDirection: 'row',
			flex: 1,
			padding: height * 0.01,
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		emptyView: {
			flexDirection: 'row',
			width: '95%',
			padding: height * 0.01,
			alignItems: 'center',
		},
		rowTitle: {
			fontSize: 20,
			fontWeight: '700',
			marginHorizontal: width * 0.02,
		},
		assetImage: {
			width: width * 0.1,
			aspectRatio: 1 / 1,
		},
	}),
	watchTile: ScaledSheet.create({
		view: {
			flex: 1,
			width: '95%',
			borderRadius: 6,
			overflow: 'hidden',
			flexDirection: 'row',
			height: height * 0.2,
			alignSelf: 'center',
			marginTop: height * 0.01,
			marginBottom: height * 0.02,
		},
		image: {
			width: width * 0.3,
		},
		thumbnail: {
			height: '100%',
			width: '100%',
		},
		textView: {
			paddingHorizontal: width * 0.02,
			flexShrink: 0.9,
		},
		title: {
			fontWeight: '600',
			fontSize: '16@ms',
		},
		desc: {
			color: 'grey',
			fontSize: '12@ms',
		},
	}),
};
