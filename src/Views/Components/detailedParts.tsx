/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {createRef, FC, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {QueryCache} from 'react-query';
import {StatusInfo} from '.';
import {SourceBase} from '../../Classes/SourceBase';
import Picker from 'react-native-picker-select';
import {
  DetailedDatabaseIDSModel,
  TaiyakiArchiveModel,
  TaiyakiScrapedTitleModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../Models/taiyaki';
import {useSettingsStore, useTheme, useUserProfiles} from '../../Stores';
import {ThemedButton, ThemedCard, ThemedSurface, ThemedText} from './base';
import {ListRow} from './list_rows';
import {FlavoredButtons} from './rows';
import {AnilistBase, MyAnimeList} from '../../Classes/Trackers';
import {SIMKL} from '../../Classes/Trackers/SIMKL';
import {Modalize} from 'react-native-modalize';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

const statusWatchingArray: WatchingStatus[] = [
  'Watching',
  'Planning',
  'Completed',
  'Paused',
  'Dropped',
];

interface Props {
  route: {
    params: {title: string; id: number};
  };
}

const SearchBindPage: FC<Props> = (props) => {
  const {title, id} = props.route.params;
  const navigation = useNavigation();
  const [archives, setArchives] = useState<TaiyakiArchiveModel[]>([]);
  const theme = useTheme((_) => _.theme);
  const [query, setQuery] = useState<string>(title);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [currentArchive, setCurrentArchive] = useState<TaiyakiArchiveModel>();

  const [results, setResults] = useState<TaiyakiScrapedTitleModel[]>([]);

  const archiveRef = createRef<Modalize>();

  useEffect(() => {
    navigation.setOptions({title: 'Binding Anime...'});
  }, [navigation]);

  const getItems = useCallback(async () => {
    const file = await AsyncStorage.getItem('my_sources');
    if (file) {
      const archives = JSON.parse(file) as TaiyakiArchiveModel[];
      setArchives(archives);
      setCurrentArchive(archives[0]);
      setLoading(true);
      new SourceBase(archives[0]).scrapeTitle(query).then((results) => {
        setResults(results.results);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    if (currentArchive) _findTitles();
  }, [currentArchive]);

  const _findTitles = async () => {
    const source = new SourceBase(currentArchive!);
    setLoading(true);
    source
      .scrapeTitle(query)
      .then((results) => {
        setResults(results.results);
        setLoading(results.loading);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  if (archives.length === 0 || !currentArchive)
    return (
      <View
        style={[
          styles.bindPage.view,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Icon
          name={'newspaper'}
          type={'MaterialCommunityIcons'}
          size={50}
          color="grey"
        />
        <ThemedText
          style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
          No sources installed. You can install them in the Settings
        </ThemedText>
        <ThemedButton
          title={'Open Settings'}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('Settings', {screen: 'ArchivePage'});
          }}
        />
      </View>
    );

  const _renderItem = ({item}: {item: TaiyakiScrapedTitleModel}) => {
    return (
      <ListRow
        image={item.image}
        title={item.title}
        onPress={async () => {
          const ids: DetailedDatabaseIDSModel = {
            anilist: id,
          };
          await AsyncStorage.mergeItem(
            id.toString(),
            JSON.stringify({
              link: item.embedLink,
              source: currentArchive!,
              ids,
            }),
          );
          navigation.navigate('Detail', {embedLink: item.embedLink});
        }}
      />
    );
  };

  const _renderArchives = ({item}: {item: TaiyakiArchiveModel}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          archiveRef.current?.close();
          setCurrentArchive(item);
        }}>
        <ThemedCard
          style={{
            paddingVertical: 15,
            paddingHorizontal: 4,
            justifyContent: 'center',
          }}>
          <ThemedText
            style={{textAlign: 'center', fontSize: 18, fontWeight: '600'}}>
            {item.name}
          </ThemedText>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedSurface style={styles.bindPage.view}>
      <ThemedText style={styles.bindPage.text}>
        This page allows you to bind an anime with a third party source. If
        Taiyaki can't find an anime you can use a custom search title
      </ThemedText>
      <TextInput
        style={[
          styles.bindPage.input,
          {backgroundColor: theme.colors.card, color: theme.colors.text},
        ]}
        autoCapitalize={'none'}
        autoCorrect={false}
        autoCompleteType="off"
        placeholder={'Use a custom search'}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={_findTitles}
      />
      <View style={{marginBottom: 10}}>
        <ThemedText style={styles.bindPage.sourceName}>
          Current source:
        </ThemedText>
        <Button
          title={currentArchive.name}
          onPress={() => {
            archiveRef.current?.open();
          }}
        />
      </View>
      {isLoading ? (
        <View
          style={[
            styles.bindPage.view,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator />
          <ThemedText style={styles.bindPage.emptyResultsText}>
            Looking for title...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.embedLink}
          renderItem={_renderItem}
          ListEmptyComponent={
            <View
              style={[
                styles.bindPage.view,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: height * 0.2,
                },
              ]}>
              <Icon
                name={'error'}
                type={'MaterialIcons'}
                size={50}
                color={'red'}
              />
              <ThemedText style={styles.bindPage.emptyResultsText}>
                No results
              </ThemedText>
            </View>
          }
        />
      )}
      <Modalize
        ref={archiveRef}
        modalHeight={height * 0.4}
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        flatListProps={{
          data: archives,
          renderItem: _renderArchives,
          keyExtractor: (item) => item.name,
        }}
      />
    </ThemedSurface>
  );
};

export const StatusCards: FC<{onPress: () => void}> = (props) => {
  const settings = useSettingsStore((_) => _.settings);

  const {onPress} = props;
  const profiles = useUserProfiles((_) => _.profiles);

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedCard style={styles.statusCards.view}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <ThemedText
            style={[
              styles.statusCards.title,
              {color: settings.sync.autoSync ? 'green' : 'red'},
            ]}>
            {settings.sync.autoSync
              ? 'Auto Tracking Enabled!'
              : 'Auto Tracking Disabled'}
          </ThemedText>
          <Icon
            name={settings.sync.autoSync ? 'check-circle' : 'error'}
            color={settings.sync.autoSync ? 'green' : 'red'}
            type={'MaterialIcons'}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <ThemedText>Tap to view your status</ThemedText>
          <ThemedText style={styles.statusCards.subTitle}>
            On {profiles.length} source
          </ThemedText>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};

export const UpdatingAnimeStatusPage: FC<{
  totalEpisodes: number;
  ids: {anilist: number; myanimelist?: string};
  initialData?: StatusInfo;
  update: (arg0: StatusInfo | undefined) => void;
  dismiss: () => void;
  tracker?: TrackingServiceTypes;
}> = (props) => {
  const {update, ids, dismiss, totalEpisodes, tracker} = props;
  const theme = useTheme((_) => _.theme);
  const profiles = useUserProfiles((_) => _.profiles);
  const queryCache = new QueryCache();

  const [updating, setUpdating] = useState<boolean>(false);
  const initialData =
    props.initialData ??
    ({
      progress: 0,
      status: 'Add to List',
      totalEpisodes: 0,
      score: 0,
    } as StatusInfo);

  //Update properties
  const [status, setStatus] = useState<WatchingStatus | undefined>(
    initialData.status,
  );
  const [score, setScore] = useState<number>(initialData.score ?? 0);
  const [progress, setProgress] = useState<number>(initialData.progress);

  //Date Props
  const [startedDate, setStartedDate] = useState<string | undefined>(
    initialData.started,
  );
  const [completedDate, setCompletedDate] = useState<string | undefined>(
    initialData.ended,
  );

  const [showStarted, setShowStarted] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const _watchPills = () => {
    return (
      <View style={styles.updatePage.pillView}>
        {statusWatchingArray.map((i) => (
          <TouchableWithoutFeedback key={i} onPress={() => setStatus(i)}>
            <View
              key={i}
              style={[
                styles.updatePage.statusPills,
                {backgroundColor: status && status === i ? 'green' : 'grey'},
              ]}>
              <ThemedText
                style={{color: status && status === i ? 'white' : 'black'}}>
                {i}
              </ThemedText>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  };

  const toDate = (value?: string): Date => {
    if (value) {
      return new Date(value);
    }
    return new Date(Date.now());
  };
  const dateToString = (value: Date): string => {
    const date = value.toLocaleDateString([], {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
    return date;
  };

  const updateData = async (): Promise<StatusInfo | undefined> => {
    setUpdating(true);
    const user = profiles.map((i) => i.source);
    if (
      (!tracker || tracker === 'MyAnimeList') &&
      user.includes('MyAnimeList')
    ) {
      queryCache.invalidateQueries('mal' + ids.myanimelist);
      await new MyAnimeList().updateStatus(
        Number(ids.myanimelist),
        progress,
        status ?? 'Planning',
        score !== initialData.score ? score : undefined,
        startedDate ? toDate(startedDate) : undefined,
        completedDate ? toDate(completedDate) : undefined,
      );
    }

    if ((!tracker || tracker === 'SIMKL') && user.includes('SIMKL')) {
      await new SIMKL().updateStatus(
        Number(ids.myanimelist),
        progress,
        status ?? 'Planning',
        score !== initialData.score ? score : undefined,
        startedDate ? toDate(startedDate) : undefined,
        completedDate ? toDate(completedDate) : undefined,
      );
    }

    if ((!tracker || tracker === 'Anilist') && user.includes('Anilist')) {
      queryCache.invalidateQueries('Detailed' + ids.anilist.toString());
      return await new AnilistBase().updateStatus(
        ids.anilist,
        progress,
        status ?? 'Planning',
        score !== initialData.score ? score : undefined,
        startedDate ? toDate(startedDate) : undefined,
        completedDate ? toDate(completedDate) : undefined,
      );
    }
    setUpdating(false);
  };

  return (
    <>
      <ScrollView
        style={{height, backgroundColor: theme.colors.backgroundColor}}
        keyboardShouldPersistTaps="handled">
        <ThemedSurface style={styles.bindPage.view}>
          <View style={styles.updatePage.subView}>
            <View style={styles.updatePage.subTitleView}>
              <ThemedText style={styles.updatePage.subTitle}>Status</ThemedText>
              <ThemedText style={styles.updatePage.subTitleDesc}>
                {initialData.status}
              </ThemedText>
            </View>
            {_watchPills()}
          </View>
          <View style={styles.updatePage.subView}>
            <View style={styles.updatePage.subTitleView}>
              <ThemedText style={styles.updatePage.subTitle}>
                Progress
              </ThemedText>
              <ThemedText style={styles.updatePage.subTitleDesc}>
                Current Episode: {initialData.progress ?? 0}
              </ThemedText>
            </View>
            <View style={{alignSelf: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.updatePage.scoreButtons}>
                  <FlavoredButtons
                    name={'arrow-up'}
                    onPress={() =>
                      setProgress((progress) => {
                        const newProgress = progress + 1;
                        if (initialData.totalEpisodes) {
                          if (newProgress > initialData.totalEpisodes) {
                            return progress;
                          } else return newProgress;
                        } else return newProgress;
                      })
                    }
                  />
                </View>
                <TextInput
                  value={progress.toString()}
                  underlineColorAndroid={theme.colors.text}
                  keyboardType={'number-pad'}
                  onChangeText={(text) => setProgress(Number(text))}
                  enablesReturnKeyAutomatically
                  style={[
                    styles.updatePage.progressText,
                    {color: theme.colors.text},
                  ]}
                />
                <ThemedText style={{color: 'grey'}}>
                  out of {totalEpisodes ?? '???'}
                </ThemedText>
                <View style={styles.updatePage.scoreButtons}>
                  <FlavoredButtons
                    name={'arrow-down'}
                    onPress={() => {
                      setProgress((progress) => {
                        const newProgress = progress - 1;
                        if (newProgress >= 0) return newProgress;
                        return 0;
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.updatePage.subView}>
            <View style={styles.updatePage.subTitleView}>
              <ThemedText style={styles.updatePage.subTitle}>Score</ThemedText>
              <ThemedText style={styles.updatePage.subTitleDesc}>
                Current Score: {initialData.score ?? 'N/A'}
              </ThemedText>
            </View>
            <Picker
              value={score}
              placeholder={{label: (score ?? 0).toString(), value: 0}}
              style={{
                placeholder: {
                  fontSize: 31,
                  fontWeight: '700',
                  textAlign: 'center',
                  fontFamily: 'Poppins',
                },
              }}
              onValueChange={(value: number) => setScore(value)}
              items={[...Array(100).keys()].reverse().map((i) => ({
                label: (i + 1).toString(),
                value: i + 1,
              }))}
            />
          </View>

          <View style={styles.updatePage.subView}>
            <View style={styles.updatePage.subTitleView}>
              <ThemedText style={styles.updatePage.subTitle}>
                Start Date
              </ThemedText>
              <ThemedText style={styles.updatePage.subTitleDesc}>
                When you watch episode 1 a start date is automatically provided
                for you
              </ThemedText>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                if (!startedDate) {
                  setStartedDate(dateToString(new Date(Date.now())));
                }
                setShowStarted((v) => !v);
              }}>
              <ThemedText
                style={[
                  styles.updatePage.progressText,
                  {marginTop: height * 0.03},
                ]}>
                {startedDate
                  ? new Date(startedDate).toLocaleDateString([], {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </ThemedText>
            </TouchableWithoutFeedback>
            {showStarted && (
              <DateTimePicker
                value={toDate(startedDate)}
                mode={'date'}
                style={{height: height * 0.1}}
                display={'calendar'}
                onChange={(_, date?: Date) => {
                  setStartedDate(dateToString(date ?? new Date(Date.now())));
                  setShowStarted(false);
                }}
              />
            )}
          </View>

          <View style={styles.updatePage.subView}>
            <View style={styles.updatePage.subTitleView}>
              <ThemedText style={styles.updatePage.subTitle}>
                Completed Date
              </ThemedText>
              <ThemedText style={styles.updatePage.subTitleDesc}>
                When you watch the last episode a completed date is
                automatically provided for you
              </ThemedText>
            </View>
            <TouchableWithoutFeedback
              onPress={() => setShowCompleted((v) => !v)}>
              <ThemedText
                style={[
                  styles.updatePage.progressText,
                  {marginTop: height * 0.03},
                ]}>
                {completedDate
                  ? new Date(completedDate).toLocaleDateString([], {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </ThemedText>
            </TouchableWithoutFeedback>
            {showCompleted && (
              <DateTimePicker
                value={toDate(completedDate)}
                mode={'date'}
                style={{height: height * 0.1}}
                display={'calendar'}
                onChange={(_, date?: Date) => {
                  setCompletedDate(dateToString(date ?? new Date(Date.now())));
                  setShowCompleted(false);
                }}
              />
            )}
          </View>
          <ThemedButton
            disabled={updating}
            color={updating ? 'green' : undefined}
            style={{marginVertical: height * 0.04}}
            onPress={() => updateData().then(update)}
            title={updating ? 'Updating...' : 'Update'}
          />
        </ThemedSurface>
      </ScrollView>
      <Icon
        name={'close'}
        type={'MaterialIcons'}
        color={'red'}
        style={styles.updatePage.close}
        size={30}
        onPress={dismiss}
      />
    </>
  );
};

const styles = {
  updatePage: StyleSheet.create({
    scoreButtons: {
      marginHorizontal: width * 0.1,
    },
    progressText: {
      fontSize: 31,
      fontWeight: '800',
      marginRight: 5,
      textAlign: 'center',
    },
    pillView: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
    },
    statusPills: {
      marginHorizontal: width * 0.03,
      marginVertical: width * 0.04,
      backgroundColor: 'grey',
      padding: 8,
      borderRadius: 4,
    },
    close: {
      position: 'absolute',
      top: height * 0.01,
      right: width * 0.01,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.05,
    },
    subTitleDesc: {
      fontSize: 14,
      fontWeight: '500',
      color: 'grey',
    },
    subTitleView: {
      marginBottom: height * 0.03,
    },
    subView: {
      paddingHorizontal: width * 0.04,
    },
  }),
  statusCards: StyleSheet.create({
    view: {
      padding: width * 0.05,

      marginHorizontal: width * 0.012,
    },
    flex: {
      height: '100%',
      flex: 1 / 3,
      flexDirection: 'row',
    },
    image: {
      width: width * 0.14,
      aspectRatio: 1 / 1,
      borderRadius: (width * 0.15) / 2,
    },
    title: {
      fontWeight: '700',
    },
    subTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: 'grey',
    },
  }),
  updatingPage: StyleSheet.create({
    view: {
      flex: 1,
    },
  }),
  bindPage: StyleSheet.create({
    view: {
      flex: 1,
    },
    text: {
      fontSize: 15,
      fontWeight: '600',
      margin: 8,
    },
    input: {
      height: height * 0.05,
      width: '90%',
      alignSelf: 'center',
      marginTop: 5,
      borderRadius: 6,
    },
    emptyResultsText: {
      fontSize: 21,
      fontWeight: '400',
    },
    sourceName: {
      textAlign: 'center',
      marginTop: height * 0.015,
      fontSize: 17,
      fontWeight: '600',
    },
  }),
};

export default SearchBindPage;
