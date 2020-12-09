import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {HistoryModel} from '../../Models/taiyaki';
import {ListRow, ThemedSurface, ThemedText} from '../Components';
import {EmptyScreen} from './empty_screen';
import TimeAgo from 'react-native-timeago';
import {useTheme} from '../../Stores';

const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryModel[]>([]);
  const {getItem, removeItem} = useAsyncStorage('history');
  const navigation = useNavigation();
  const theme = useTheme((_) => _.theme);

  useFocusEffect(
    useCallback(() => {
      _searchDatabase();
    }, []),
  );

  useEffect(() => {
    if (history.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <Icon
            name={'trash-can'}
            type={'MaterialCommunityIcons'}
            style={{marginRight: 12}}
            onPress={() => {
              Alert.alert('Remove History?', 'This action is irreversible', [
                {text: 'Cancel'},
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: () => {
                    removeItem();
                    setHistory([]);
                  },
                },
              ]);
            }}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }, [history]);

  const _searchDatabase = async () => {
    const items = await getItem();
    if (items) {
      const model = (await JSON.parse(items)) as HistoryModel[];
      setHistory(model);
    }
  };

  const _renderItem = ({item}: {item: HistoryModel}) => {
    return (
      <ListRow
        title={item.data.detail.title}
        image={item.data.detail.coverImage}
        onPress={() =>
          navigation.navigate('Detail', {id: item.data.detail.ids.anilist})
        }
        bottomComponent={
          <View style={styles.row}>
            <View>
              <ThemedText style={{fontWeight: '500', fontSize: 13}}>
                Episode {item.data.episode.episode}
              </ThemedText>
              <ThemedText style={{color: theme.colors.accent, fontSize: 13}}>
                {item.data.episode.sourceName}
              </ThemedText>
            </View>
            <TimeAgo
              time={item.lastModified}
              style={{color: 'grey', alignSelf: 'flex-end'}}
            />
          </View>
        }
      />
    );
  };
  return (
    <ThemedSurface style={styles.view}>
      {history.length === 0 ? (
        <EmptyScreen message={'No history recorded'} />
      ) : (
        <FlatList
          data={history}
          renderItem={_renderItem}
          keyExtractor={(item, index) =>
            item.data.detail.ids.anilist?.toString() ?? index.toString()
          }
        />
      )}
    </ThemedSurface>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HistoryScreen;
