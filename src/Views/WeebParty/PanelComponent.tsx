import React, { createRef, FC, memo, useEffect, useRef, useState } from 'react';
import ViewPager from '@react-native-community/viewpager';
import { Dimensions, Image, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Avatars, DangoImage, ThemedButton, ThemedText } from '../Components';
import { useFirebaseAuth, useTheme } from '../../Stores';
import { ChatInput } from '.';
import database from '@react-native-firebase/database'
import { RoomsModelInnerData } from './AvailableRooms';
import Icon from 'react-native-dynamic-vector-icons';
import { useWeebStore } from '../../Stores/rootModal';
import { StackActions } from '@react-navigation/native';


const {height, width} = Dimensions.get('window');

export type WeebMessages = {
    user: {
        username: string;
        id: string;
        avatar?: string;
    },
    message: string;
    time: Date;
    height?: number;
}

interface WeebChatProps {
    messages: WeebMessages[];
    roomID: string;

}

interface WeebQueueProps {
    roomID: string;
    onChangeSelected: (id: number) => void;
}

interface Props {
    roomID: string;
    messages: WeebMessages[];
    onChangeSelected: (id: number) => void;
}


const SHARED_HEIGHT = height * 0.55

const _WeebViewPager: FC<Props> = (props) => {
    const {roomID, messages} = props;
    const pageRef = createRef<ViewPager>();
    const [currentPage, setPage] = useState<number>(0);
    const theme = useTheme((_) => _.theme);
   
    const ViewTitle = (title: string, index: number) => {
        return (
            <TouchableOpacity
            containerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
                if (title === 'Chat') {
                    pageRef.current?.setPage(0)
                    setPage(0);
                } else {
                    pageRef.current?.setPage(1);
                    setPage(1);
                }
            }}
            >
                <View style={{alignItems: 'center', justifyContent: 'center', }}>
                <ThemedText style={{
                    color: currentPage === index ? theme.colors.accent : theme.colors.text
                }} >{title}</ThemedText>
            </View>
            </TouchableOpacity>
        )
    }

    return <View style={{flex: 1}}>
        <View style={{flexDirection: 'row',  justifyContent: 'space-around', height: height * 0.06}}>
            {ViewTitle('Chat', 0)}
            {ViewTitle('Queue', 1)}
        </View>
        <View style={{height: 0.5, backgroundColor: 'grey', width: '100%'}} />
         <ViewPager scrollEnabled={false} style={{height: SHARED_HEIGHT}} ref={pageRef} >
        <WeebChat key={'0'} messages={messages} roomID={roomID} />
        <WeebQueue key={'1'} roomID={roomID} onChangeSelected={props.onChangeSelected} />
    </ViewPager>
    </View>
}

export const WeebViewPager = memo(_WeebViewPager, (pp: Props, np: Props) => pp.messages.length === np.messages.length)


const _WeebQueue: FC<WeebQueueProps> = (props) => {
    const {roomID} = props;
    const [data, setData] = useState<RoomsModelInnerData[]>([]);
    const host = useRef<{username: string; id: string}>();
    const [isCommunityBased, setCommunityBased] = useState<'HOST' | 'VOTE'>('HOST');
    const firebaseUser = useFirebaseAuth((_) => _.user);
    const ROOM_STRING: string = '/rooms/' + roomID;
    const modalRef = useWeebStore((_) => _.ref);
    const navigationRef = useWeebStore((_) => _.navigationRef);

    
   

    

    useEffect(() => {
        database()
        .ref(ROOM_STRING)
        .once('value', (snapshot) => {
            setCommunityBased(snapshot.val().communityType);
            if (snapshot.val().host)
                host.current = snapshot.val().host;
            if (snapshot.val().queue) {
                const data = snapshot.val().queue as {[key: string] : RoomsModelInnerData};
                const formData = Object.values(data).filter((o) => o.episode);
                setData(formData);
            }
        } );
        // return () => database()
        // .ref(ROOM_STRING)
        // .child('queue')
        // .off('value', queueData);
    }, []);

   

    const updateValue = (value: boolean, animeID: number) => {
        if (value)
                    database()
                    .ref(ROOM_STRING + '/queue/' + animeID + '/votes/' + firebaseUser!.username)
                    .remove();
                    else 
                    database()
                    .ref(ROOM_STRING + '/queue/' + animeID + '/votes/' + firebaseUser!.username)
                    .set(database.ServerValue.increment(1));
    }

    useEffect(() => {
        database()
        .ref(ROOM_STRING)
        .child('queue')
        .on('value', (snapshot) => {
            const data = snapshot.val() as {[key: number] : RoomsModelInnerData};
            if (!data) {
                setData([]);
               
            } else {
                const formData = Object.values(data);
                setData(formData);
            };
        } );
        return () => {
            database()
            .ref(ROOM_STRING)
            .child('queue')
            .off('value');
        };
    }, [])

    const renderItem = ({item, index} : {item: RoomsModelInnerData, index: number}) => {
        return (
            <>
            <View style={{flexDirection: 'row', marginVertical: 8, paddingHorizontal: 8}}>
                <TouchableOpacity
                onPress={() => {
                    
                    modalRef.current?.minimize();
                    navigationRef.current?.dispatch(StackActions.push('Detail', {id: item.animeID}));
                }}
                >
                <TouchableOpacity
                disabled={(host.current?.id !== firebaseUser?.uuid) ?? false }
                onPress={() => {
                    props.onChangeSelected(item.animeID)
                }}
                >
                <View style={{height: height * 0.18, width: width * 0.3, overflow: 'hidden'}}>
                <DangoImage url={item.cover} style={{flex: 1}} />
                {host.current?.id === firebaseUser?.uuid ? <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={'play'} type={'MaterialCommunityIcons'} size={35} color={'white'} />
                </View>: null}
                </View>
                </TouchableOpacity>
                
                </TouchableOpacity>
                <View style={{flexShrink: 0.8, paddingHorizontal: 8, justifyContent: 'space-between'}}>
                   <View>
                   <ThemedText numberOfLines={1} style={{fontSize: 15, fontWeight: '500'}}>{item.title}</ThemedText>
                    <ThemedText style={{color: 'orange'}}>Episode {item.episode}</ThemedText>
                    <ThemedText numberOfLines={1} style={{fontSize: 12, fontWeight: '800', color: 'pink'}}>Requested by: {item.requester?.username}</ThemedText>
                </View>

                    {isCommunityBased === 'VOTE' ? <View style={{flexDirection: 'row', alignItems: 'flex-end', width: '100%'}}>
                <TouchableOpacity
                onPress={() => updateValue((item.votes && item.votes[firebaseUser!.username] !== undefined) ?? false, item.animeID)}
                >
                <View style={{borderRadius: 4, width: width * 0.12, aspectRatio: 1 / 1, justifyContent: 'center', alignItems: 'center', backgroundColor: item.votes && item.votes[firebaseUser!.username] ? 'green' : 'grey'  }}>
                    <Icon color={item.votes && item.votes[firebaseUser!.username] ? 'white' : 'rgba(0,0,0,0.5)'  } name={'plus-one'} type={'MaterialIcons'} size={25}  />
                </View>
                </TouchableOpacity>
                <ThemedText style={{marginLeft: 8}}>{(item.votes) ? Object.keys(item.votes).length : 0} {Object.keys(item.votes ?? []).length === 1 ? 'Vote' : 'Votes'}</ThemedText>
                </View>: null}
                
                </View>
                
            </View>
                </>
        )
    }

    return (
        <View style={{height: SHARED_HEIGHT}}>
            {isCommunityBased === 'VOTE' ?
            <ThemedButton title={'Submit Episode'} onPress={() => modalRef.current?.minimize()} />
            : <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 10}}>
                <ThemedText>Host has turned off community queueing</ThemedText>
                </View>}
            <FlatList 
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            />
        </View>
    )
}
const WeebQueue = memo(_WeebQueue, (pp: WeebQueueProps, np: WeebQueueProps) => pp.roomID === np.roomID)


const _ChatContainer: FC<{item: WeebMessages}> = (props) => {
    const {item} = props;
    const theme = useTheme((_) => _.theme);
    
return (
    <View style={styles.messageView}>
                {item.user.avatar ? 
                <Avatars url={item.user.avatar} size={45} />    
                : <Image source={require('../../assets/images/icon_round.png')} style={styles.avatar} />
            }
            <View style={styles.messageContentView}>
                <ThemedText numberOfLines={1} style={[styles.userName, {color: theme.colors.accent}]}>{item.user.username}</ThemedText>
                <ThemedText>{item.message}</ThemedText>
            </View>
            </View>
)
}
const ChatContainer = memo(_ChatContainer, (pp: {item: WeebMessages}, np: {item: WeebMessages}) => false);

const WeebChat: FC<WeebChatProps> = (props) => {
    const theme = useTheme((_) => _.theme);
    const {messages, roomID} = props;
    const flatListController = createRef<FlatList<WeebMessages>>();

    useEffect(() => {
    
        setTimeout(() => flatListController.current?.scrollToEnd({animated: true}), 650);
    }, [messages.length])

    // const dataProvider = new DataProvider((r1, r2) => (r1 !== r2)).cloneWithRows(texts);
    // const layoutProvider = new LayoutProvider((index) => index, ((type, dim, index) => {
    //     if (index === 0) {
    //         dim.height = 20;
    //         dim.width = width;
    //     } else {
    //         dim.width = width;
            
    //         console.log('the position height', console.log(texts[messages.length-1]))
    //         if (texts.length === 0) {
    //             dim.height = height * 0.08;
    //         } else dim.height = texts[index] + (height * 0.08);
        
    //     }
        
    // }))

    // const rowRender = (_: any, data:  WeebMessages, index: number) => {
    //     if (index === 0) 
    //     return <ThemedText style={{fontStyle: 'italic', color: 'grey', fontSize: 13, margin: 8}}>Welcome! Remember to respect other members!</ThemedText>
    //     if (!data.user) return null;
    //     return <ChatContainer item={data} />
    // }

    const renderMessages = ({item, index} : {item: WeebMessages; index: number}) => {
        if (index === 0 || !item.user)
            return <ThemedText style={{fontWeight: '600', fontStyle: 'italic', fontSize: 12, color: 'grey', textAlign: 'center', marginVertical: 8}}>{item.message}</ThemedText>
        return <ChatContainer item={item} /> 
    }

    return (
        <View style={[{justifyContent: 'space-between'}]}>
           <View style={{height: height * 0.47}}>
           <FlatList
           showsVerticalScrollIndicator={false}
           style={{marginBottom: 10}}
           contentInset={{bottom: height * 0.055}}
           fadingEdgeLength={25}
            ref={flatListController}
            data={messages}
            renderItem={renderMessages}
            keyExtractor={(item, index) => item?.time?.toLocaleTimeString() ?? index.toString()}
            maxToRenderPerBatch={35}
            removeClippedSubviews={messages.length > 75}
            updateCellsBatchingPeriod={100}
           />
           </View>
          <KeyboardAvoidingView
          behavior={'position'}
          keyboardVerticalOffset={height * 0.46}          
          >
          <ChatInput roomID={roomID} onSent={(message) => {}} />
          </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    messageView: {
        flexDirection: 'row',
        minHeight: height * 0.05,
        justifyContent: 'flex-start',
        paddingHorizontal: width * 0.04,
        marginVertical: height * 0.01,
        flexShrink: 0.9,
    },
    avatar: {
        width: width * 0.13,
        aspectRatio: 1 / 1,
        borderRadius: width * 0.13 / 2,
        overflow: 'hidden',
    },
    messageContentView: {
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        flexShrink: 0.95,
        marginBottom: 4
    },
    userName: {
        fontWeight: '600',
    },
    message: {
        
    }
});