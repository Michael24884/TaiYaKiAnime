import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DiscoveryScreen from "../Screens/discovery";
import DetailedScreen from "../Screens/details";
import HScreen from "../Screens/history";
import MQScreen from "../Screens/my_queue";

import {
	BottomTabBarOptions,
	BottomTabNavigationOptions,
	createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import { default as theme } from "../Util/custom-theme.json";
import AuthenticationScreen from "../Screens/Settings/authenticate";
import MyAnimeList from "../Screens/my_anime_list";

const { Navigator, Screen } = createStackNavigator();
const { Navigator: List, Screen: ListScreen } = createStackNavigator();
const { Navigator: History, Screen: HistoryScreen } = createStackNavigator();
const { Navigator: MyQueue, Screen: MyQueueScreen } = createStackNavigator();

const Tab = createBottomTabNavigator();

const HomeNavigator = () => (
	<Navigator headerMode="none">
		<Screen name="Discovery" component={DiscoveryScreen} />
		<Screen name="Detailed" component={DetailedScreen} />
		<Screen name="Trackers" component={AuthenticationScreen} />
	</Navigator>
);

const ListNavigator = () => (
	<List headerMode="none">
		<ListScreen name={"My AnimeList"} component={MyAnimeList} />
		<ListScreen name={"Detailed"} component={DetailedScreen} />
	</List>
);
const HistoryNavigator = () => (
	<History headerMode="none">
		<HistoryScreen name={"History"} component={HScreen} />
		<HistoryScreen name={"Detailed"} component={DetailedScreen} />
	</History>
);
const MyQueueNavigator = () => (
	<MyQueue headerMode="none">
		<MyQueueScreen name={"My Queue"} component={MQScreen} />
		<MyQueueScreen name={"Detailed"} component={DetailedScreen} />
	</MyQueue>
);

export const AppNavigator = () => {
	const options: BottomTabBarOptions = {
		activeTintColor: "white",
		inactiveTintColor: "gray",
		style: {
			backgroundColor: useTheme().dark
				? "rgba(0,0,0,0.85)"
				: useTheme().colors.primary,
		},
	};
	return (
		<NavigationContainer>
			<Tab.Navigator tabBarOptions={options}>
				<Tab.Screen name={"Discovery"} component={HomeNavigator} />
				<Tab.Screen name={"My List"} component={ListNavigator} />
				<Tab.Screen name={"History"} component={HistoryNavigator} />
				<Tab.Screen name={"My Queue"} component={MyQueueNavigator} />
			</Tab.Navigator>
		</NavigationContainer>
	);
};
