import React, { createRef, FC, useEffect, useRef, useState } from 'react';
import {ActivityIndicator, Alert, Dimensions, LayoutAnimation, StyleSheet, View} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import { Avatars, DangoImage, ThemedButton, ThemedSurface, ThemedText } from '../Components';
import { useNavigation } from '@react-navigation/native';
import { FirebaseUserModel, useFirebaseAuth } from '../../Stores';
import WeebRootComponent from './WeebRootComponent';
import { useWeebStore } from '../../Stores/rootModal';
import { Modalize } from 'react-native-modalize';
import { WeebRoomSetupWizard } from '.';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

const {width, height} = Dimensions.get('window');

type RoomsModel = {
    [key: string] : RoomsModelInner;
}
export type RoomsModelInner = 
    {
        id: number;
        isPrivate: boolean;
        maxCount: number;
        userCount: number;
        currentTime: number;
        isPaused: boolean;
        duration: number;
        host: {
            username: string;
            id: string;
        }
        stream: {
            [key: string]: {link: string};
        };
        data: RoomsModelInnerData;
        queue: {[key: number] : RoomsModelInnerData};
        communityType: 'VOTE' | 'HOST';
        users: {
            [key: string] : {id: string; name: string; avatar?: string}
        };
    }

export type RoomsModelInnerData = {
    animeID: number;
    cover: string;
    title: string;
    episode: number;
    stream?: {
        [key: string]: {link: string};
    };
    votes?: {
        [key: string] : number;
    };
    requester?: {
        username: string;
        id: string;
    }
}

type TaiyakiRoomModel = {
    roomName: string;
    data: RoomsModelInner;
}

export const AvailableWeebRooms = () => {
    const roomModal = useWeebStore((_) => _.ref);
    const firebaseUser = useFirebaseAuth((_) => _.user);
    const weebWizardModalizeRef = createRef<Modalize>();


    const [rooms, setRooms] = useState<TaiyakiRoomModel[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        database()
        .ref('/rooms')
        .on('value', (value) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            const data = value.val() as RoomsModel;
            if (!data) return;
            const obj = Object.entries(data);
        for (let items of obj) {
        setRooms((prev) => {
            if (prev.find((i) => i.roomName === items[0])) {
                const d = prev.find((i) => i.roomName === items[0]);
                const l = prev.filter((i) => i !== d);
                const nobj = {roomName: items[0], data: items[1]}
                return ([nobj, ...l]);
            }
            return [{roomName: items[0], data: items[1]}, ...prev];
        })
    }
        });
        return () => database()
        .ref('/rooms')
        .off('child_added');
    }, []);

    const _renderItem = ({item, index} : {item: TaiyakiRoomModel; index: number}) => {
        return <Items item={item} index={index} onPress={() => {
            if (!firebaseUser) {
                Alert.alert('Not logged in!', 'This feature only works for users logged in to Firebase. You can sign in through Settings', [{text: 'Dismiss', style: 'destructive'}])
                return;
              }
              if (!firebaseUser.canPlay) {
                Alert.alert("You can't join a room as you're connected on another device.", 'If you are sure this is incorrect try restarting the app', [{text: 'Dismiss', style: 'destructive'}])
                return;
            }
            if (firebaseUser.uuid === item.data.host.id) {
                Alert.alert("You can't join this room as you're the host on another device.", 'Please use a different account as using the same profile for similar rooms is not supported', [{text: 'Dismiss', style: 'destructive'}])
                return;
              }
              if (item.data.userCount + 1 > item.data.maxCount) {
                  Alert.alert('Max Numbers of users reached', 'Please try another room or wait until someone leaves', [{text: 'Dismiss'}]);
                  return;
              }
              roomModal.current?.startRoom(item.roomName);
          //navigation.navigate('WeebRoom', {roomID: item.roomName, coverImage: item.data.data.cover})

        }} />
    }

    function beginRoomSetup() {
        Alert.alert('Starting wizard...', 'Wizard has now started. Select/Play an episode to continue', [
            {text: 'Understood', onPress: () => {
                roomModal.current?.setupRoom();
                navigation.goBack();
            }},
             {text: 'Cancel', style: 'destructive'}])
    }

    return (
        <ThemedSurface style={styles.view}>
        <ThemedText style={styles.availableRooms}>Available Rooms</ThemedText>
        <FlatList
        pointerEvents={'box-none'}
        style={styles.view}
        data={rooms.filter((i) => i.data?.data?.cover).filter((i) => !i.data.isPrivate)}
        renderItem={_renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() => <View style={{justifyContent: 'center', alignItems: 'center', height: height * 0.75}}>
            <ActivityIndicator />
            <ThemedText style={[styles.roomName, {marginTop: 5}]}>Looking for rooms...</ThemedText>
        </View>}
        />
        {/* <ThemedButton  title={'Setup Room'} onPress={beginRoomSetup} /> */}
        {/* <Modalize
      ref={weebWizardModalizeRef}
      modalHeight={height}
      modalStyle={{backgroundColor: 'rgba(0,0,0,0.2)'}}
      >
        <WeebRoomSetupWizard
            animeCover={currentEpisode.detail.coverImage}
            animeID={currentEpisode.detail.ids.anilist!}
            episodeNumber={currentEpisode.episode.episode}
            streams={allScrapedServers}
            title={currentEpisode.detail.title}
        reject={() => weebWizardModalizeRef.current?.close()} />
      </Modalize> */}
      
        </ThemedSurface>
    )
};


const Items: FC<{item: TaiyakiRoomModel; onPress: () => void; index: number}> = (props) => {
    const {item, onPress} = props;  

    const userCount = Object.keys(item.data?.users ?? {}).length;
    const rowRenderer = ({item} : {item: {avatar?: string; name: string}}) => {
        return <View style={{marginRight: 10, }}>
             <Avatars url={item.avatar ?? item.name} size={45} />
        </View>
    }

    return (
        <TouchableOpacity
        onPress={onPress}
        >
            <View>
            <View style={{flexDirection: 'row', marginVertical: 8}}>
            <DangoImage url={item.data.data.cover} style={styles.image} />
            <View style={{paddingHorizontal: 8, justifyContent: 'space-between'}}>
               <View>
               <ThemedText style={styles.roomName}>{item.roomName}</ThemedText>
               <ThemedText style={styles.host}>{item.data.host.username}</ThemedText>
               <ThemedText >{userCount}{userCount === 1 ? ' user' : ' users'} / {item.data.maxCount} max</ThemedText>
               </View>
                <View style={{flexShrink: 0.8}}>
                <ThemedText style={{color: item.data.isPrivate ? 'red' : 'green', fontWeight: '700', fontSize: 13}}>{item.data.isPrivate ? 'Private' : 'Public'}</ThemedText>
                <ThemedText numberOfLines={2} shouldShrink>{item.data.data.title}</ThemedText>
                <ThemedText>Episode {item.data.data.episode}</ThemedText>
                </View>
            </View>

        </View>
        <View
        style={{height: '21%', width}}
        >
        <FlatList 
        horizontal
        data={item.data.users ? Object.values(item.data.users) : []}
        renderItem={rowRenderer}
        keyExtractor={(item) => item.id}
        />
        </View>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
view: {
    flex: 1,
    padding: 8
},
availableRooms: {
    fontSize: 25,
    fontWeight: '700',
},
image: {
    height: height * 0.19,
    width: width * 0.3,
},
roomName: {
    fontSize: 19,
    fontWeight: '600',
},
host: {
    color: 'orange',
    fontSize: 14,
}
});