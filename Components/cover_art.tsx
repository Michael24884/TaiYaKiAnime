import React, { FC, memo, useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface CoverProps {
	title: string;
	image: string;
	shouldClose: boolean;
}

const CoverArt: FC<CoverProps> = (props) => {
	const { title, image, shouldClose } = props;

	const _scaleController = useRef(new Animated.Value(0)).current;
	const _coverController = useRef(new Animated.Value(0)).current;
	const _closing = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		scaleIn();
	}, []);

	useEffect(() => {
		if (shouldClose) _closingAnimator.start();
	}, [shouldClose]);

	const _animator = Animated.loop(
		Animated.sequence([
			Animated.timing(_scaleController, {
				toValue: 1,
				useNativeDriver: true,
				duration: 15000,
				delay: 500,
				easing: Easing.out(Easing.ease),
				isInteraction: true,
			}),
			Animated.timing(_scaleController, {
				toValue: 0,
				useNativeDriver: true,
				duration: 15000,
				delay: 500,
				easing: Easing.out(Easing.ease),
				isInteraction: true,
			}),
		]),
		{}
	);
	const _coverAnimator = Animated.timing(_coverController, {
		toValue: 1,
		useNativeDriver: true,
		delay: 1475,
		duration: 1500,
		easing: Easing.out(Easing.ease),
		isInteraction: true,
	});

	const _closingAnimator = Animated.timing(_closing, {
		toValue: 0,
		useNativeDriver: true,
		duration: 1500,
		easing: Easing.ease,
	});

	const scaleIn = () => {
		_animator.start();
		_coverAnimator.start();
	};

	useEffect(() => {
		return () => {
			console.log("closed animations");
			_animator.stop();
			_coverAnimator.stop();
			_closingAnimator.stop();
		};
	}, []);

	return (
		<Animated.View
			style={{
				opacity: _closing,
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			}}>
			<Animated.Image
				source={{ uri: image }}
				style={[
					styles.cover,
					{
						transform: [
							{
								scale: _scaleController.interpolate({
									inputRange: [0, 1],
									outputRange: [1, 1.5],
								}),
							},
						],
					},
				]}
			/>
			<Animated.View
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					opacity: _coverController,
				}}
			/>
			<Animated.View
				style={[
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: Dimensions.get("window").height * 0.5,
						justifyContent: "center",
						alignItems: "center",
					},
				]}>
				<Animated.Text
					numberOfLines={3}
					style={[
						styles.titleCover,
						{
							marginBottom: 20,
							marginHorizontal: 5,
							textAlign: "center",
							transform: [
								{
									translateY: _coverController.interpolate({
										inputRange: [0, 1],
										outputRange: [-(Dimensions.get("window").height * 0.25), 0],
									}),
								},
							],
						},
					]}>
					{title}
				</Animated.Text>
				<ActivityIndicator color={"white"} />
			</Animated.View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	cover: {
		height: "100%",
		width: "100%",
	},

	titleCover: {
		color: "white",
		fontWeight: "bold",
		fontSize: 25,
	},
});

function _areEqual(op: CoverProps, np: CoverProps): boolean {
	return op.shouldClose === np.shouldClose;
}
export default memo(CoverArt, _areEqual);
