import React, {FC, useState} from 'react';
import {
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../Stores';

const {height, width} = Dimensions.get('window');

export const SearchBar: FC<{
  onSubmit: (arg0: string) => void;
  onClear: () => void;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
}> = (props) => {
  const {placeholder, onSubmit, style, onClear} = props;
  const [query, setQuery] = useState<string>('');

  const theme = useTheme((_) => _.theme);

  return (
    <View style={styles.searchBar.shadowView}>
      <View
        style={[
          styles.searchBar.view,
          {backgroundColor: theme.colors.backgroundColor},
          style,
        ]}>
        <TextInput
          value={query}
          placeholder={placeholder ?? 'Search for something'}
          placeholderTextColor={'grey'}
          style={{color: theme.colors.text, fontFamily: 'Poppins', flex: 1}}
          onChangeText={setQuery}
          onSubmitEditing={(event) => onSubmit(event.nativeEvent.text)}
          autoCapitalize={'none'}
          autoCompleteType={'off'}
          autoCorrect={false}
        />
        {query ? (
          <Icon
            name={'close'}
            type={'MaterialCommunityIcons'}
            color={'grey'}
            size={height * 0.04}
            onPress={() => {
              setQuery('');
              onClear();
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = {
  searchBar: StyleSheet.create({
    shadowView: {
      zIndex: 100,
      alignSelf: 'center',

      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
      }),
    },
    view: {
      marginTop: 12,
      borderRadius: 6,
      height: height * 0.06,
      width: width * 0.9,
      alignSelf: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: height * 0.01,
    },
  }),
};
