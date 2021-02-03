import { useNavigation } from '@react-navigation/native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Share, Image, Dimensions, Keyboard, Switch, ActivityIndicator, TouchableWithoutFeedback, Alert, Button } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Avatars, DangoImage, ThemedButton, ThemedText } from '../Components';
import { useFirebaseAuth, useTheme } from '../../Stores';
import database from '@react-native-firebase/database';
import { RoomsModelInner, RoomsModelInnerData } from './AvailableRooms';
import { randomCodeChallenge } from '../../Models/MyAnimeList';
import { EmbededResolvedModel } from '../../Models';
import Icon from 'react-native-dynamic-vector-icons';
import { useWeebStore } from '../../Stores/rootModal';
import {moderateScale, moderateVerticalScale, ScaledSheet} from 'react-native-size-matters'
import { isTablet } from 'react-native-device-info';


const {width, height}  = Dimensions.get('window');

export const WeebPartyComponent= () => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate('WeebAvailableRooms');
        }}>
            <View style={styles.view}>
            <Image resizeMode={'cover'} source={require('../../assets/images/background/weebBackground.jpg')} style={styles.background} />
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1.4, y: 0}} colors={['#2b163f', '#c13c3c']} style={[styles.absolute, styles.blendView]}  />
            <View style={[styles.absolute, {padding: 8, justifyContent: 'space-between', flex: 1}]}>
                <View>
                <ThemedText style={styles.title}>WeebParty</ThemedText>
                <ThemedText style={styles.subtitle}>Watch anime with other users</ThemedText>
                </View>
                <ThemedText style={styles.featured}>Featured</ThemedText>
            </View>
        </View>
        </TouchableOpacity>
    );
}


type UserMessage = {
    id: string;
    text: string;
    createdAt: string;
    user: {
        _id: number;
    }
}

// interface ChatProps {
// messages: MessagePorpsType[];
// onSendMessage: (message: UserMessage[]) => void;
// roomID: string;
// }

// const _WeebChat: FC<ChatProps> = (props) => {
//     const {messages, roomID, onSendMessage} = props;
//     const user = useFirebaseAuth((_) => _.user!);
//    // const navigation = useNavigation();
//     const theme = useTheme((_) => _.theme);

//     useEffect(() => {
//         // setTimeout(() => {
//         //     setMessageList([...messages]);
//         // }, 2500)
//      //   navigation.dangerouslyGetParent()?.setOptions({tabBarVisible: false});
//        // return () =>  navigation.dangerouslyGetParent()?.setOptions({tabBarVisible: true});
//     }, [])

//     return (
//         <View style={{flex: 1, overflow: 'hidden', backgroundColor: theme.colors.backgroundColor}}>
//             <ChatUI 
            
//         chatWindowStyle={{backgroundColor: theme.colors.backgroundColor, height: height * 0.5}}
//         useVoice={false}
//         placeholder={'Send a message'}
//         allPanelHeight={height * 0.4}
//         chatType={'group'}
//         inverted={false}
//         showUserName={true}
//         messageList={messages}
//         androidHeaderHeight={25}
//         lastReadAt={new Date(Date.now())}
//         sendMessage={() => {}}
//         chatId={'2'}
        

//       />
        
//         </View>
//     )
// }

// export const WeebChat = _WeebChat;

export const InfoBar: FC<{onModal: () => void; onCog: () => void;}> = (props) => {
    const {onModal, onCog} = props;
    
    const theme = useTheme((_) => _.theme);
    return (
        <View style={[styles.shadow, {justifyContent: 'space-between', paddingHorizontal: 8, flex: 1, flexDirection: 'row', alignItems: 'center',}]}>
            <TouchableOpacity 
            onPress={onModal}
            >
            <ThemedText style={[styles.infoBarText, {color: theme.colors.accent}]}>Room Info</ThemedText>
            </TouchableOpacity>
            {/* <ThemedText style={styles.userCountText}>{watchingCount} Users Watching</ThemedText> */}
            <Icon name={'cog'} type={'MaterialCommunityIcons'} color={theme.colors.text} size={35} onPress={onCog} />
        </View>
    )
}

interface InfoPageProps {
roomID: string;
onLeave: () => void;
pause: () => void;
}

export const InfoPage: FC<InfoPageProps> = (props) => {
    const {roomID, onLeave, pause} = props;
    const [hostInfo, setHost] = useState<{username: string; id: string}>();
    const [userList, setUserList] = useState<{name: string; avatar?: string; id: string}[]>([]);
    const firebaseUser = useFirebaseAuth((_) => _.user);
    const styles = StyleSheet.create({
        view: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
        },
        roomInfo: {
            fontSize: 21,
            fontWeight: '600',
        },

        userView: {
            
            alignItems: 'center',
            marginVertical: 10,
            paddingHorizontal: 8,
        },
        userText: {
            fontSize: 15,
            fontWeight: '500',
            marginHorizontal: 5
        },
        userTitle: {
            marginTop: 12,
        },
        hostName: {
            color: 'orange',
        }
        
    })

    useEffect(() => {
        database()
        .ref('/rooms/' + roomID )
        .on('value', (snapshot) => {
            if (snapshot.val()) {
                const {host,} = (snapshot.val() as RoomsModelInner);
                setHost(host);

                if (snapshot.val().users) {
                    const users = Object.values(snapshot.val()['users']) as {id: string; name: string; avatar?: string}[];
                    setUserList(users.reverse());
                    
                }
            }
        });

        return () => database()
        .ref('/rooms/' + roomID )
        .off();
    }, [])

    const _shareRoom = async () => {
        console.log('sharing')
        pause();
        try {
            const share = await Share.share({
                title: `Taiyaki WeebParty`,
                url: 'taiyaki://weebparty/' + hostInfo?.username + '/' + roomID
            }, {
                dialogTitle: 'Weeb Party Invitation'
            });
            if (share.action !== 'dismissedAction') {
                
            }
        } catch(e) {
            console.log(e)
        }
    }

    const _renderItem = ({item} : {item: {name: string; avatar?: string; id: string}}) => {
        
        return (
            <View style={[{flexDirection: 'row'}, styles.userView]}>
            <Avatars size={35} url={item.avatar} />
            <ThemedText style={styles.userText}>{item.name}</ThemedText>
            {hostInfo?.id === item.id ? <Icon name={'crown'} type={'MaterialCommunityIcons'} color={'orange'} size={25} /> : null}
            </View>
        )
    }

    return (
        <View style={styles.view}>
            <ThemedText style={styles.roomInfo}>Room Info</ThemedText>
            {hostInfo ? <View>
            
            <ThemedText style={{marginTop: 4}}>Host</ThemedText>
            <ThemedText style={styles.hostName}>{hostInfo?.username}</ThemedText>
            <Button title={'Share room link'} onPress={_shareRoom}  />

            <ThemedText style={styles.userTitle}>Users - {userList.length} {userList.length === 1 ? 'viewer' : 'viewers'} </ThemedText>
            <FlatList
                style={{height: height * 0.36,}}
                data={userList}
                renderItem={_renderItem}
                keyExtractor={(itm, index) => index.toString()}
            />
                <ThemedButton title={'Leave Room'} color={'red'} onPress={onLeave} />

            </View> : 
            <View style={{height: height * 0.4, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator />
                <ThemedText>Fetching data...</ThemedText>
            </View>}

        </View>
    )
}


interface ChatTextProps {
onSent: (arg0: string) => void;
roomID: string;
}

export const ChatInput: FC<ChatTextProps> = (props) => {
    const user = useFirebaseAuth((_) => _.user!);
    const {onSent, roomID} = props;
    const theme = useTheme((_) => _.theme);

    const [textValue, setValue] = useState<string>('');
    return (
       
            <View style={{flexDirection: 'row', backgroundColor: theme.colors.backgroundColor }}>
                {/* <View style={{flexDirection: 'row', height: height * 0.04, flex: 1 }}>

                </View> */}
            <TextInput 
        style={[styles.input, {borderColor: theme.colors.text, color: theme.colors.text}]}
        placeholder={'Type something...'}
        placeholderTextColor={theme.colors.text}
        onChangeText={setValue}
        clearButtonMode={'while-editing'}
        numberOfLines={5}
        shouldCancelWhenOutside
        value={textValue}
        onSubmitEditing={(event) => {
            if (event.nativeEvent.text.length < 1) return;
            setValue('');
            Keyboard.dismiss();
            database()
            .ref('/rooms/' + roomID + '/users/' + user.username)
            .update({
                message: event.nativeEvent.text,
                time: Date.now(),
                name: user.username,
                id: user.uuid,
                avatar: user.avatar,
            }).then(() => setValue(''))
            
        }}
        />
        {/* <TouchableOpacity
        // disabled={false}
        onPress={() => {
            Keyboard.dismiss();
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            onSent(textValue);
            setValue('');
        }}>
        <View style={[styles.sendButton, {backgroundColor: !textValue ? 'grey' : theme.colors.accent }]}>
            <Icon name={'send'} type={'MaterialCommunityIcons'} color={'white'} size={30} />
        </View>
        </TouchableOpacity> */}
        </View>
    )
}


export const WeebLoadingVideo: FC<{roomID: string; coverImage: string; canJoin: (arg0: boolean) => void; videoLink: (arg0: {
    [key: string]: {
        link: string;
    };
}) => void}> = (props) => {
    const {roomID, videoLink, coverImage } = props;

   // const navigation = useNavigation();
   const ref = useWeebStore((_) => _.ref);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [canJoin, setCanJoin] = useState<boolean>(true);

    database()
    .ref('/rooms/' + roomID)
    .once('value', (snapshot) => {
        const {userCount, queue, stream, maxCount, isPrivate} = (snapshot.val() as RoomsModelInner);
        setCanJoin(userCount < maxCount && !isPrivate);
        
        // const formData = Object.entries(snapshot.val().queue as {[key: number] : RoomsModelInnerData});
        // const highestSort = formData.filter((i) => i[1].votes !== undefined).sort((a, b) => Object.values(b[1].votes!).length - Object.values(a[1].votes!).length);
        // const prep = formData.filter((i) => i[1].votes === highestSort[0][1].votes);
        // const randomSelection = prep[Math.floor(Math.random()*prep.length)];
        // const streamObj = convertArrayToObject(Object.values(randomSelection[1].stream!), 'quality');
        

        setIsLoading(false);
        if (!stream) {
            setCanJoin(false);
        } else 
            videoLink(stream)
    });
    
    useEffect(() => {
        if (!canJoin) {
          Alert.alert('Looks like this room is unavailable', 'The host has set this room to private or the max limit of users has been reached', [{text: 'Dismiss', style: 'destructive', onPress: () => ref.current?.destroyRoom()}])
        }
    }, [canJoin])

    return (
        <View style={{flex: 1}}>
            <DangoImage url={coverImage} style={{height: '100%', width: '100%'}} />
            <View >
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}/>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>

                </View>
            </View>

        </View>
    )
}
interface WeebRoomWizardProps {
    reject: () => void;
    hardReject: () => void;
    animeID: number;
    title: string;
    animeCover: string;
    episodeNumber: number;
    streams: EmbededResolvedModel[];
    play: (arg0: string) => void;

}

export const WeebRoomSetupWizard: FC<WeebRoomWizardProps> = (props) => {
    const { hardReject, reject, animeCover, animeID, title, episodeNumber, streams, play } = props;
 //   const navigation = useNavigation();
    const theme = useTheme((_) => _.theme);
    const firebaseUser = useFirebaseAuth((_) => _.user);
    
    

    const styles = StyleSheet.create({
        view: {
            width: width * 0.9,
            height: height * 0.5,
            alignSelf: 'center',
            backgroundColor: theme.colors.card,
            borderRadius: 6
        },
        textInput: {
            height: height * 0.05,
            width: '90%',
            backgroundColor: 'white',
            padding: 4,
            paddingLeft: 4,
            borderRadius: 4
        },
        textInputTitle: {
            fontSize: 19,
            fontWeight: '500',
            marginBottom: 5
        },
        customView: {
            padding: 8,
            marginBottom: 12
        },
        row: {
            flexDirection: 'row'
        },
        message: {
            fontWeight: '300',
            color: 'grey',
            fontSize: 14,
            padding: 8,
            textAlign: 'center'
        }
    });

    const [roomName, setRoomName] = useState<string>('');
    const [maxUsers, setMaxUsers] = useState<number>(12);
    const [isPrivate, setPrivate] = useState<boolean>(false);


    function StartRoom() {
        if (roomName.length < 2 || !firebaseUser) return;
        const trimmedName = roomName.trim();
    
        const innerRoom: RoomsModelInner = {
            communityType: 'VOTE',
            currentTime: 0,
            duration: 0,
            isPlaying: true,
            isPrivate: isPrivate,
            id: Number(randomCodeChallenge(12, true)),
            maxCount: maxUsers,
            userCount: 0,
            host: {
                id: firebaseUser.uuid,
                username: firebaseUser.username
            },
            data: {
                animeID,
                cover: animeCover,
                episode: episodeNumber,
                title
            },
            stream: streams,
            queue: []
        }
        database()
        .ref('/rooms')
        .update({
            [trimmedName]: innerRoom
        })
        .then(() => {
            play(trimmedName);
            
           // reject();
       //     navigation.goBack();
         //   navigation.navigate('WeebRoom', {roomID: trimmedName})
        });
    }

    useEffect(() => {
        return () => database()
        .ref('/rooms/' + roomName)
        .off();
    }, []);

    const TextField = (textName: string, onChangeText: (arg0: string) => void, isNumber: boolean = false) => {
        return (
            <View style={styles.customView}>
            <ThemedText style={styles.textInputTitle}>{textName}</ThemedText>
            <TextInput
              keyboardType={isNumber ? 'number-pad' : 'default'} 
              style={styles.textInput}
              placeholder={isNumber ? 'Leave empty to set default: 12' :'Insert text'}
              onChangeText={onChangeText}
            />
            </View>
        )
    }

    const SwitchField = () => {
        return (
            <View style={styles.customView}>
            <View style={[ styles.row, {justifyContent: 'space-between'}]}>
                <ThemedText style={styles.textInputTitle}>Private</ThemedText>
                <Switch onValueChange={setPrivate} value={isPrivate} />
            </View>
            <ThemedText style={{fontWeight: '300', fontSize: 12, color: 'grey'}}>Private mode will not show in public and will require a link to join the room</ThemedText>
            </View>
        )
    }

    return (
        <View style={{height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0, 0.75)'}}>
            <View style={styles.view}>
                {TextField('Room Name', setRoomName)}
                {SwitchField()}
                {TextField('Max Users (max 12)', (count) => {
                    const counter = Number(count);
                    if (counter > 12) setMaxUsers(12);
                    else setMaxUsers(counter)
                }, true)}
                <ThemedText style={styles.message}>The current selected servers and qualities will be used for streaming. If you do not want this server then change them before starting the room</ThemedText>
            </View>
            <ThemedButton title={'Start'} style={{marginTop: 12}} disabled={roomName.length <= 2} onPress={StartRoom} />
            <ThemedButton title={'Cancel Room Setup'} color={'red'} onPress={hardReject} />
        </View>
    );
}

interface WeebRoomOverlayControllerProps {
    isFullScreen: boolean; 
    isPaused: boolean;
    isBuffering: boolean;
    isHost: boolean;
    onForward: () => void;
    onRewind: () => void;
    onPausedTap: () => void;
    onFsTap: () => void;
    currentTime: number;
    duration: number;
    chatVisible: boolean;
    onChat: () => void;
    onPausePlay: () => void;
}


const _WeebRoomOverlayController: FC<WeebRoomOverlayControllerProps> = (props) => {
    const {isFullScreen, chatVisible, onChat, onForward, onPausePlay, isHost, currentTime, duration, isPaused, isBuffering, onFsTap, onPausedTap} = props;

    const overlayTimer = useRef<NodeJS.Timer>();
    const [isVisible, setVisible] = useState<boolean>(true);
    // const [chatVisible, setChatVisible] = useState<boolean>(true);

    useEffect(() => {
        if (isVisible && !isPaused) {
            activateControls();
        }
        else {
           // setVisible(true)
           if (overlayTimer.current)
            clearTimeout(overlayTimer.current);
        }
    }, [isVisible, isPaused])

    function activateControls() {
        overlayTimer.current = setTimeout(() => {
            setVisible(false);
        }, 6500)
    }

    function invokeControls() {
        setVisible((v) => !v);
    }

    const styles = StyleSheet.create({
        absolute: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom:0,
            right: 0,
        },
        view: {
            flex: 1,
            justifyContent: 'space-between',
        },
        containerView: {
            width: '100%',
            flex: 1 / 3,
        },
        topView: {
            paddingRight: 21,
            paddingTop: 8
            
        },
        centerView: {
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            height: '25%',
        },
        bottomView: {
          height: '100%'  
        },
        viewContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between', 
            paddingHorizontal: 8
        }
    });

    
    return (
       <TouchableWithoutFeedback
       onPress={invokeControls}
       >
            <View style={[styles.view, styles.absolute]}>
           
               
           <TouchableWithoutFeedback
           onPress={invokeControls}
           >
           {isVisible ? <>
            <View style={[styles.containerView]}>
            <LinearGradient style={styles.bottomView} colors={['rgba(0,0,0,0.8)', 'transparent',]}  />
                <View style={[styles.topView, styles.absolute, {justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}]}>
                    {isFullScreen ? <Icon style={{marginRight: 12}} name={chatVisible ? 'chat-minus' : 'chat'} type={'MaterialCommunityIcons'} color={'white'} size={30} onPress={onChat} />: <View />}
                {
                    isPaused ? <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <ThemedText>Host has paused the video</ThemedText>
                    <View />
                    </View>
                </View> : null
                }
                {isBuffering ? <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View />
                    <View style={{flexDirection: 'row'}}>
                        <ThemedText>Buffering... </ThemedText>
                    <ActivityIndicator color={'white'}/>
                    </View>
                </View> : null}
                </View>
            </View>
            <View>
                
            </View>
{/* //Bottom View */}
<View style={[styles.containerView, styles.bottomView]}>
   <LinearGradient style={styles.bottomView} colors={['transparent', 'rgba(0,0,0,0.8)',]}  />
   <View style={[styles.absolute, styles.viewContainer]}>
       <View style={{flexDirection: 'row', alignItems: 'center'}}>
           {
            isHost ?
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 18}}>
                <Icon style={{marginLeft: 15}} name={ isPaused ? 'play': 'pause'} type={'Feather'} color={'white'} size={30} onPress={onPausePlay} />
                <Icon style={{marginLeft: 10, marginRight: 3}} name={'skip-forward'} type={'Feather'} color={'white'} size={30} onPress={onForward} />
                <ThemedText style={{fontWeight: '600', fontSize: 13, color: 'orange'}}>Skip 15</ThemedText>
            </View>
            : null
           }
           
       {/* <Icon onPress={() => { 
           setVisible(true)
           onPausedTap()
       }} name={!isPaused ? 'pause':'play'} type={'MaterialCommunityIcons'} color={'white'} size={35}  /> */}
       <ThemedText style={{fontSize: 13, fontWeight: '300', color: 'orange'}}>- {(duration - currentTime).toFixed(0)} remaining</ThemedText>
       </View>
       <Icon onPress={onFsTap} name={isFullScreen ? 'fullscreen-exit':'fullscreen'} type={'MaterialCommunityIcons'} color={'white'} size={35}  />
   </View>
</View>
           </> : <View style={styles.view}/> }
           </TouchableWithoutFeedback> 
       
    </View>
       </TouchableWithoutFeedback>

    )
}

export const WeebRoomOverlayController = memo(_WeebRoomOverlayController, (pp: WeebRoomOverlayControllerProps, np: WeebRoomOverlayControllerProps) => pp === np)

const styles = ScaledSheet.create({
    shadow: {
       borderBottomColor: 'grey',
       borderBottomWidth: 1,
    },
    input: {
        paddingHorizontal: 8,
        width: width * 0.9,
        height: height * 0.06,
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    view: {
        borderRadius: 8,
        width:  width * 0.94,
        height: isTablet() ? moderateVerticalScale(225  ) : height * 0.2,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    background: {
        width: '100%',
        height: '100%',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    blendView: {
        opacity: 0.6
    },
    title: {
        fontSize: '26@ms',
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: '12@ms',
        color: 'white'
    },
    featured: {
        fontWeight: '700',
        color: 'orange',
        fontSize: '14@ms'
    },
    sendButton: {
        width: width * 0.12,
        aspectRatio: 1 / 1,
        borderRadius: width * 0.2 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    infoBarText: {
        fontWeight: '600',
    },
    userCountText: {
        fontWeight: '300',
        fontSize: '12@ms0.2',
        color: 'orange'
    }
});
