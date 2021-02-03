import { Platform, Dimensions } from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import {isTablet} from 'react-native-device-info';

const {height, width} = Dimensions.get('window');

export const styles = {
	continueTile: ScaledSheet.create({
		view: {
			width: '100%',
			paddingBottom: 5,
		},
		text: {
			fontSize: 14,
			fontWeight: '400',
			marginBottom: 5,
			alignSelf: 'flex-end',
		},
	}),
	listRow: ScaledSheet.create({
		shadowView: {
			...Platform.select({
				ios: {
					shadowColor: 'black',
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.3,
					shadowRadius: 5,
				},
			}),
		},
		view: {
			borderRadius: 6,
			overflow: 'hidden',
			flexDirection: 'row',
			height: isTablet() ? '205@mvs' :  Platform.OS === 'ios' ? moderateScale(height * 0.15) : moderateScale(height * 0.17),
			margin: isTablet() ? '8@ms' : moderateScale(width * 0.02),
		},
		image: {
			height: '100%',
			width: '28%',
		},
		textView: {
			paddingVertical: height * 0.005,
			paddingHorizontal: width * 0.02,
			flexShrink: 0.9,
			justifyContent: 'space-between',
		},
		title: {
			fontSize: '15@ms',
			fontWeight: '500',
		},
    })
}

export const queueStyle = ScaledSheet.create({
	container: {
		flex: 1,
	},
	header: {
		color: 'gray',
		fontSize: 14,
	},
	upNextView: {
		marginHorizontal: 10,
	},
	upNextImage: {
		borderRadius: 6,
		marginBottom: 5,
	},
	upNextEpisode: {
		fontSize: 13,
	},
	upNextTitle: {
		fontWeight: '600',
		fontSize: 18,
	},
	upNextDesc: {
		fontWeight: '400',
		color: 'gray',
		fontSize: 15,
	},
	emptyMessage: {
		fontSize: 21,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	queueItemImage: {
		marginRight: 5,
		marginLeft: -10,
	},
	queueItemTitle: {
		fontSize: 15,
		fontWeight: '400',
	},
	queueItemNumber: {
		fontSize: 15,
		marginBottom: 4,
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		paddingLeft: 15,
	},

	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75,
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75,
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0,
	},
});