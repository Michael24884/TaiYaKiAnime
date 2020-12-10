/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  SectionList,
  SectionListData,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {build} from '../../../package.json';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import Icon from 'react-native-dynamic-vector-icons';
import {useTheme} from '../../Stores';
import {DetailedDatabaseModel, TaiyakiArchiveModel} from '../../Models/taiyaki';
import {
  Avatars,
  Divider,
  ThemedButton,
  ThemedCard,
  ThemedSurface,
  ThemedText,
} from '../Components';

export type DynamicUserData = {
  username: string;
  userID: number;
  token: string;
};

const {height, width} = Dimensions.get('window');

export const ArchiveListScreen = () => {
  const {getItem, setItem} = useAsyncStorage('my_sources');
  const theme = useTheme((_) => _.theme);
  const navigation = useNavigation();
  const [archives, setArchives] = useState<TaiyakiArchiveModel[]>([]);
  const [mySources, setMySource] = useState<TaiyakiArchiveModel[]>([]);

  const [, setWebViewData] = useState<{
    open: boolean;
    uri: string;
    currentUri?: string;
    storageID: string;
  }>();

  const [modalUpdateVisible, setModalUpdateVisible] = useState<boolean>(false);
  const [archiveBeingUpdated, setArchiveToUpdate] = useState<
    TaiyakiArchiveModel
  >();

  const [dynamicSources, setDynamicSources] = useState<
    {id: string; data: DynamicUserData}[]
  >([]);

  const _findMyLists = useCallback(async () => {
    const lists = await getItem();
    if (lists) {
      const _sources = JSON.parse(lists) as TaiyakiArchiveModel[];
      setMySource(_sources.filter((i) => i));
    }
  }, [getItem]);

  useEffect(() => {
    _findMyLists();
    const _fetch = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/Michael24884/taiyaki-repos/master/src/sources_list.json',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok) {
        response.json().then((json: TaiyakiArchiveModel[]) => {
          setArchives(json);
        });
      }
      // setArchives([]);
      // setArchives((i) => [
      // 	...i,
      // 	list[7],
      // 	list[0],
      // 	list[1],
      // 	list[2],
      // 	list[3],
      // 	list[4],
      // 	list[5],
      // 	list[6],
      // ]);
    };
    _fetch();
    return () => {
      //mergeItem(JSON.stringify(mySources));
    };
  }, []);

  useEffect(() => {
    async function getSource() {
      for (let source of mySources) {
        if (source.hasOptions) {
          const data = await AsyncStorage.getItem(source.requiredOptions!.id);
          if (data) {
            const userProfile = JSON.parse(data) as DynamicUserData;
            setDynamicSources((i) => [
              ...i,
              {id: source.requiredOptions!.id, data: userProfile},
            ]);
          }
        }
      }
    }
    getSource();
  }, [mySources]);
  // const filterLanguages = () => {
  // 	if (!archives) return [];

  // 	let items: TaiyakiArchiveModel[] = [];

  // 	const _filter = archives
  // 	if (_filter.length > 0) {
  // 		for (let i = 0; i < _filter.length; i++) {
  // 			const current = _filter[i];
  // 			const semi = items.find((a) => a.language === current.language);
  // 			if (semi) {
  // 				items.push(current);
  // 			} else {
  // 				items.push({
  // 					title: nativeToRelations.get(current.relationType)!,
  // 					data: [current],
  // 				});
  // 			}
  // 		}

  // 		return items;
  // 	} else return [];
  // };

  const _filteredArchives = (): SectionListData<{
    title: string;
    data: TaiyakiArchiveModel[];
  }>[] => {
    if (archives.length == 0) return [];

    const items: {title: string; data: TaiyakiArchiveModel[]}[] = [];

    const _filter = archives;

    for (let i = 0; i < _filter.length; i++) {
      const current = _filter[i];
      const semi = items.find((a) => a.title === current.language);
      if (semi) {
        semi.data.push(current);
      } else {
        items.push({
          title: current.language,
          data: [current],
        });
      }
    }
    //@ts-ignore
    return items;
  };

  async function loginToAuth(name: string) {
    //TODO: Individual classes
    if (name === 'Aniwatch') {
    }
  }

  const _saveSource = async (
    sourceData: TaiyakiArchiveModel,
    hasUpdate: boolean = false,
  ) => {
    if (hasUpdate) {
      setArchiveToUpdate(sourceData);
      setModalUpdateVisible(true);
    } else {
      const item = mySources.find((i) => i.name === sourceData.name);
      const version = sourceData.contraVersion ?? build;
      if (version < build) {
        Alert.alert(
          'Incompatible Build',
          'This source requires a newer version of Taiyaki to be installed',
          [{text: 'Dismiss', style: 'destructive'}],
        );
        return;
      }

      if (item) {
        //Remove
        setMySource((i) => i.filter((o) => o.name !== item.name));
        await setItem(
          JSON.stringify([...mySources.filter((i) => i.name !== item.name)]),
        );
      } else {
        //Add
        if (
          sourceData.hasOptions &&
          (sourceData.requiredOptions?.requiresAuth ?? false)
        ) {
          setWebViewData({
            open: true,
            uri: 'https://aniwatch.me',
            storageID: sourceData.requiredOptions!.id,
          });
          await loginToAuth('Aniwatch').then(async () => {
            setMySource((list) => [...list, sourceData]);
            await setItem(JSON.stringify([...mySources, sourceData]));
          });
          return;
        }
        setMySource((list) => [...list, sourceData]);
        await setItem(JSON.stringify([...mySources, sourceData]));
      }
      // 	let hasMark = false;
      // for (let m = 0; m < mySources.length; m++) {
      // 	const source = mySources[m];
      // 	if (source.name === sourceData.name) {
      // 		setMySource((list) => list.filter((i) => i.name !== sourceData.name));
      // 		hasMark = true;
      // 		if (hasUpdate) {
      // 			await setItem(JSON.stringify(mySources));
      // 			hasMark = false;
      // 			setMySource((list) => [...list, sourceData]);
      // 			await setItem(JSON.stringify([...mySources, sourceData]));
      // 		}
      // 		break;
      // 	}
      // }
      // if (!hasMark) {
      // 	setMySource((list) => [...list, sourceData]);
      // 	await setItem(JSON.stringify([...mySources, sourceData]));
      // }
    }
  };

  const _renderItem = ({item}: {item: TaiyakiArchiveModel}) => {
    const synced = mySources.find((i) => i.baseUrl === item.baseUrl);
    let needsUpdate: boolean = false;
    if (synced && synced.version !== item.version) needsUpdate = true;
    return (
      <ThemedCard style={{margin: 8}}>
        <View style={{flexDirection: 'row', flex: 1}}></View>
        <ThemedText
          style={{
            fontSize: 21,
            fontWeight: '600',
            margin: 8,
            textAlign: 'center',
          }}>
          {item.name}
        </ThemedText>
        {dynamicSources.find((i) => i.id === item.requiredOptions?.id) ? (
          <ThemedText style={{marginVertical: 4, color: 'grey'}}>
            Logged in as:
            {
              dynamicSources.find((i) => i.id === item.requiredOptions!.id)!
                .data.username
            }
          </ThemedText>
        ) : null}
        {item.description ? <ThemedText>{item.description}</ThemedText> : null}
        <Divider />
        <ThemedText style={{margin: width * 0.03, textAlign: 'center'}}>
          Version {item.version}
        </ThemedText>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {item.hasOptions && synced ? (
            <ThemedButton
              style={{transform: [{scale: 0.9}]}}
              title={'Options'}
            />
          ) : null}
          <ThemedButton
            style={{transform: [{scale: 0.9}]}}
            color={needsUpdate || !synced ? 'orange' : theme.colors.accent}
            onPress={() => _saveSource(item, needsUpdate)}
            title={needsUpdate ? 'Update' : synced ? 'Remove' : 'Install'}
          />
        </View>
      </ThemedCard>
    );
  };

  //   if (webViewData && webViewData.open) {
  //     const navigationHandler = (event: WebViewNavigation) => {
  //       const userValue: DynamicUserData = {
  //         token: '',
  //         userID: 0,
  //         username: '',
  //       };
  //       const baseURL = 'https://aniwatch.me';
  //       const {navigationType, url} = event;
  //       setWebViewData((i) => ({...i!, currentUri: url}));
  //       if (url === baseURL + '/home') {
  //         console.log('reattempting...');
  //         CookieManager.get(baseURL).then((cookies: any) => {
  //           const cookie = cookies as {
  //             [key: string]: {[key: string]: string};
  //           };
  //           if (cookie.hasOwnProperty('SESSION')) {
  //             const session = cookie['SESSION']['value'];
  //             const decodedJSON = decodeURIComponent(session);
  //             if (decodedJSON) {
  //               const json = JSON.parse(decodedJSON) as {
  //                 userid: number;
  //                 auth: string;
  //                 username: string;
  //               };
  //               userValue.userID = json.userid;
  //               userValue.token = json.auth;
  //               userValue.username = json.username;

  //               Alert.alert(
  //                 'Data Retreival Successful',
  //                 'Your data has been obtained, Tayiaki will now continue.',
  //                 [
  //                   {
  //                     ThemedText: 'Close',
  //                     onPress: () => {
  //                       AsyncStorage.setItem(
  //                         webViewData.storageID,
  //                         JSON.stringify(userValue),
  //                       ).then(() => setWebViewData(undefined));
  //                     },
  //                   },
  //                 ],
  //               );
  //             }
  //           }
  //         });
  //       }
  //     };

  //     return (
  //       <View style={{flex: 1}}>
  //         <Appbar.Header>
  //           <Appbar.BackAction onPress={() => setWebViewData(undefined)} />
  //           <Appbar.Content
  //             title={'Aniwatch'}
  //             subtitle={webViewData.currentUri}
  //           />
  //         </Appbar.Header>
  //         <WebView
  //           source={{uri: webViewData.uri}}
  //           sharedCookiesEnabled
  //           thirdPartyCookiesEnabled
  //           onNavigationStateChange={navigationHandler}
  //         />
  //       </View>
  //     );
  //   }

  return (
    <ThemedSurface style={{flex: 1}}>
      <Modal
        visible={modalUpdateVisible}
        onDismiss={() => setModalUpdateVisible(false)}
        presentationStyle={'formSheet'}
        animationType={'slide'}
        hardwareAccelerated>
        <UpdateList
          archive={archiveBeingUpdated!}
          dismiss={async (value: boolean) => {
            setModalUpdateVisible(false);
            if (value) {
              setMySource((list) =>
                list.filter((i) => i.name !== archiveBeingUpdated!.name),
              );
              setMySource((list) => [...list, archiveBeingUpdated!]);
              await setItem(
                JSON.stringify([
                  ...mySources.filter(
                    (i) => i.name !== archiveBeingUpdated!.name,
                  ),
                  archiveBeingUpdated!,
                ]),
              );
            }
          }}
        />
      </Modal>
      {archives.length === 0 ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator style={{alignSelf: 'center'}} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <SectionList
            sections={_filteredArchives()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.name}
            renderItem={_renderItem}
            renderSectionHeader={({section: {title}}) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    padding: 8,
                    backgroundColor: theme.colors.backgroundColor,
                  }}>
                  <ThemedText
                    style={{fontSize: 14, fontWeight: '500', color: 'grey'}}>
                    {title}
                  </ThemedText>
                </View>
              );
            }}
          />
        </View>
      )}
    </ThemedSurface>
  );
};

interface UpdateListProps {
  archive: TaiyakiArchiveModel;
  dismiss: (arg0: boolean) => void;
}

const UpdateList: FC<UpdateListProps> = (props) => {
  const {archive, dismiss} = props;
  const theme = useTheme((_) => _.theme);

  const [updatingStatus, setUpdatingStatus] = useState<
    'UPDATING' | 'IDLE' | 'UPDATED'
  >('IDLE');

  const [message, setMessage] = useState<string>('Searching the database...');
  const [searchingDatabase, setIsSearchingDatabase] = useState<boolean>(false);
  const [listOfUpdates, setListOfUpdates] = useState<DetailedDatabaseModel[]>(
    [],
  );

  const [progress, setProgress] = useState<number>(0);

  const searchUpdates = useCallback(async () => {
    setListOfUpdates([]);
    setIsSearchingDatabase(true);
    const keys = await AsyncStorage.getAllKeys();
    for await (let key of keys) {
      if (Number(key)) {
        const _key = Number(key);
        await AsyncStorage.getItem(_key.toString()).then((data) => {
          if (data) {
            let json = JSON.parse(data) as DetailedDatabaseModel;
            if (json.source.name === archive.name) {
              setListOfUpdates((list) => [...list, json]);
            }
          }
        });
      }
    }
    setIsSearchingDatabase(false);
  }, [archive.name]);

  useEffect(() => {
    searchUpdates();
  }, []);

  useEffect(() => {
    setMessage(`Items requiring an update: ${listOfUpdates.length} item(s)`);
  }, [listOfUpdates]);

  async function update() {
    setUpdatingStatus('UPDATING');
    for await (let models of listOfUpdates) {
      models.source = archive;
      await AsyncStorage.setItem(models.id.toString(), JSON.stringify(models));
      setProgress((progress) => progress++);
    }
    setMessage('Your sources have updated successfully');
    setListOfUpdates([]);
    setUpdatingStatus('UPDATED');
  }

  const _renderItem = ({item}: {item: DetailedDatabaseModel}) => {
    return (
      <View
        style={{
          flex: 1 / 3,
          height: height * 0.25,
          borderRadius: 4,
          margin: 8,
          marginBottom: 12,
          overflow: 'hidden',
        }}>
        <Image
          source={
            item.coverImage
              ? {uri: item.coverImage}
              : require('../../assets/images/icon_round.png')
          }
          style={{width: '100%', height: '70%', marginBottom: 8}}
        />
        <ThemedText style={{fontSize: 14, fontWeight: '400'}} numberOfLines={2}>
          {item.title}
        </ThemedText>
      </View>
    );
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: theme.colors.backgroundColor,
      }}>
      {updatingStatus === 'UPDATED' ? (
        <Icon
          type={'MaterialCommunityIcons'}
          name={'check'}
          color="green"
          size={height * 0.45}
          style={{marginBottom: height * 0.15, marginTop: height * 0.15}}
        />
      ) : (
        <FlatList
          numColumns={3}
          data={listOfUpdates}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <View
        style={{
          width: '100%',
          height: '25%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
        <ThemedText style={{marginBottom: height * 0.02}}>{message}</ThemedText>

        {!searchingDatabase ? (
          <>
            {updatingStatus === 'UPDATING' ? (
              <View style={{alignSelf: 'flex-end', marginHorizontal: 10}} />
            ) : (
              <View style={{width: '100%'}}>
                {updatingStatus === 'IDLE' ? (
                  <ThemedButton
                    disabled={searchingDatabase}
                    style={{
                      marginBottom: height * 0.02,
                      marginHorizontal: height * 0.03,
                      padding: 8,
                    }}
                    onPress={update}>
                    Update
                  </ThemedButton>
                ) : (
                  <ThemedButton
                    style={{
                      marginBottom: height * 0.05,
                      marginHorizontal: height * 0.03,
                      padding: 8,
                    }}
                    onPress={() => dismiss(updatingStatus === 'UPDATED')}>
                    Updated
                  </ThemedButton>
                )}
                {updatingStatus !== 'UPDATED' ? (
                  <ThemedButton
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      height: height * 0.05,
                    }}
                    color={'red'}
                    onPress={() => dismiss(false)}>
                    Dismiss
                  </ThemedButton>
                ) : null}
              </View>
            )}
          </>
        ) : (
          <ActivityIndicator style={{alignSelf: 'center'}} />
        )}
      </View>
    </View>
  );
};
