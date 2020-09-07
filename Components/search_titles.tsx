import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import {
	ActivityIndicator,
	Searchbar,
	Surface,
	Text,
} from "react-native-paper";

/**
 * Responsible for searching anime on third parties
 */

interface Props {
	query: string;
	callBack: () => void;
}
export const SearchTitles: FC<Props> = (props) => {
	const { query } = props;

	const [customQuery, setQuery] = useState<string>(query);

	//useEffect(() => setQuery(query), []);
	useEffect(() => {}, [customQuery]);

	return (
		<Surface style={{ height: "100%" }}>
			<Searchbar
				style={{ margin: 8 }}
				value={customQuery}
				numberOfLines={1}
				placeholder={"Search for a title"}
				onChangeText={setQuery}
			/>
			<Text
				style={{
					fontWeight: "400",
					fontSize: 14,
					textAlign: "center",
					margin: 8,
				}}>
				This page lets you bind a title on a third party site to Taiyaki. Use a
				custom search if Taiyaki can't find the same anime.
			</Text>
			<View
				style={{
					marginTop: 50,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<ActivityIndicator />
			</View>
		</Surface>
	);
};
