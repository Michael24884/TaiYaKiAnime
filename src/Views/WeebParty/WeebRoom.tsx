import React, { FC, useState, useEffect, useRef, createRef } from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, ActivityIndicator, LayoutAnimation, Alert, AppState, AppStateStatus } from 'react-native';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import Video, { OnBufferData, OnLoadData, OnProgressData } from 'react-native-video';
import { InfoBar, InfoPage, WeebLoadingVideo, WeebRoomOverlayController } from './Component';
import { Divider, ThemedSurface, ThemedText } from '../Components';
import { Modalize } from 'react-native-modalize';
import { RoomsModelInner, RoomsModelInnerData } from './AvailableRooms';
import { useFirebaseAuth, useTheme } from '../../Stores';
import { WeebMessages, WeebViewPager } from './PanelComponent';
import { useWeebStore } from '../../Stores/rootModal';
import Orientation from 'react-native-orientation-locker';
import {HomeIndicator} from 'react-native-home-indicator';
import Icon from 'react-native-dynamic-vector-icons';
import { convertArrayToObject } from '../../Util';
import { OverlayFullScreenChat } from './OverlayChat';
import {hasNotch} from 'react-native-device-info';
import ImmersiveMode from 'react-native-immersive-mode';

const {height, width} = Dimensions.get('window');

interface Props {
  roomID: string;
  coverImage: string;
}

type FirebaseMessageModel = {
      id: string;
      name: string;
      message: string;
      time: number;
      avatar?: string;
}
const WeebRoom: FC<Props> = (props) => {
    const {roomID, coverImage} = props;
    const theme = useTheme((_) => _.theme);
    const modalRef = useWeebStore((_) => _.ref);
    const setRoomID = useWeebStore((_) => _.setRoomID);
    const firebaseUser = useFirebaseAuth((_) => _.user);

    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [isPaused, setPaused] = useState<boolean>(false);
    const [isBuffering, setBuffering] = useState<boolean>(false);

    const [currentTimeState, setCurrentTime] = useState<number>();
    const refCurrentTime = useRef<number>(0);
    const [durationState, setDuration] = useState<number>();

    const [rawLinks, setRawLinks] = useState<{
      [key: string]: {
          link: string;
      };
  }>();

    const [videoLink, setVideoLink] = useState<string>();
    const [availableQualities, setAvailableQualities] = useState<{link: string; quality: string}[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isPip, setPipActive] = useState<boolean>(false);


    const [totalUsersIn, setUserCountIn] = useState<number>(1);
    const host = useRef<{username: string; id: string}>();

    const infoRef = useRef<Modalize>();
    const settingsRef = useRef<Modalize>();

    const videoRef = useWeebStore((_) => _.videoRef);

    const [messages, setMessages] = useState<WeebMessages[]>([]);
    const [fsChatVisible, setFSChatVisible] = useState<boolean>(true);

    useEffect(() => {
      if (messages.length === 0) {
        setMessages([{message: 'Welcome! Make sure to respect other users!'} as WeebMessages])
      }
    }, [messages])

   
    const snapper = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      const obj = snapshot.val() as FirebaseMessageModel;
      

      if (!obj.message) return;
      const message: WeebMessages = {
        message: obj.message,
        time: new Date(),
        user: {
          username: obj.name,
          id: obj.id,
          avatar: obj.avatar
        }
      }
      setMessages((prev) => prev.concat(message));
    }

    useEffect(() => {
      
      if (!host && totalUsersIn !== 0) {
       Alert.alert('Host left the room', 'Stream will now end', [{text: 'Dismiss', style: 'destructive', onPress: () => modalRef.current?.destroyRoom()}])
      }

    }, [host])

    useEffect(() => {
      Alert.alert('Caution', 'A friendly reminder that the use of spoiling an anime will get you banned. This will pop up everytime you join for the remainder of the beta', [{text: 'Dismiss', style: 'destructive'}])
     if (Platform.OS === 'android')
      ImmersiveMode.setBarMode('FullSticky');
      return () => {
        if (Platform.OS === 'android')
          ImmersiveMode.setBarMode('Normal');
      }
    }, [])

    const _handleState = (state: AppStateStatus) => {
      setTimeout(() => {
        if (state === 'inactive' && !isPip) {
          _disconnect();
          modalRef.current?.destroyRoom();
        }
      }, 60000 )

    }

    useEffect(() => {
      AppState.addEventListener('change', _handleState)
      return () => AppState.removeEventListener('change', _handleState);
    }, [isPip]);

    useEffect(() => {
      setRoomID(roomID);
      return () => {
        _disconnect();
       }
    }, []);

    useEffect(() => {
      onPausePlay();
      onPausePlay();
      if (totalUsersIn === 0)
        _hostDisconnected();
    }, [totalUsersIn])

    const _disconnect = () =>  {
      if (host.current) {
        if (firebaseUser!.uuid === host.current.id ) {
          setUserCountIn(0)
          //Current user is host. Should close stream upon leaving the scene
          database()
          .ref('/rooms/' + roomID)
          .remove();
        } else {
       
          database()
                .ref('/rooms/' + roomID )
                .update({userCount: database.ServerValue.increment(-1)})
                database()
                .ref('/rooms/' + roomID + '/users/' + firebaseUser!.username)
                .remove();
        }
      }
    }

    // useEffect(() => {
    //   if (firebaseUser?.uuid === host.current?.id) {
    //     database()
    //     .ref('/rooms/' + roomID)
    //     .update({'isPlaying': isPaused})  
    //   }

    // }, [isPaused])


    const onPausePlay = () => {
      if (firebaseUser?.uuid === host.current?.id) {
        setPaused((p) => {
          database()
        .ref('/rooms/' + roomID)
        .update({'isPaused': !p})  
          return !p;
        })
        
      }
    }

    useEffect(() => {
      if (fullScreen)
        Orientation.lockToLandscape();
      else 
        Orientation.lockToPortrait();
      return () => Orientation.lockToPortrait();
      
    }, [fullScreen])

    useEffect(() => {
      if (videoLink && currentTimeState)
        videoRef.current?.seek(currentTimeState);
    }, [videoLink])

    useEffect(() => {
      if (modalRef.current?.state.isMinimized) {
        setFSChatVisible(false);
      }
    }, [modalRef.current?.state.isMinimized])

    useEffect(() => {

      database()
      .ref('/rooms/' + roomID + '/currentTime')
      
      .on('value', (snapshot) => {
        
        
        if (snapshot.val() && snapshot.val() !== 0) {
          if (Number((refCurrentTime.current ?? 0).toFixed(0)) + 7 < Number(snapshot.val().toFixed(0))) {
            refCurrentTime.current = snapshot.val();
            videoRef.current?.seek(refCurrentTime.current);
            setCurrentTime(refCurrentTime.current);

          }
        }
        
      })
      
      database()
      .ref('/rooms/' + roomID + '/users')
      .on('child_added', snapper)
      
      database()
      .ref('/rooms/' + roomID + '/users')
      .on('child_changed', snapper);

      database()
      .ref('/rooms/' + roomID + '/users/' + firebaseUser!.username)
      .set({
        id: firebaseUser!.uuid,
        avatar: firebaseUser!.avatar,
        name: firebaseUser!.username,
      })
      
      database()
      .ref('/rooms/' + roomID )
      .update({userCount: database.ServerValue.increment(1)})
      
        
      database()
      .ref('/rooms/' + roomID)
      .on('value', (snapshot) => {  
        if (snapshot.val() && snapshot.val()['users']) {
          const {users} = snapshot.val();
          const item = users ? Object.keys(users).length : 1;
          if (item !== 0 && item > totalUsersIn) {
           
            setUserCountIn(item);
          }
        } 

       if (snapshot.val()) {         
        const { isPaused, userCount, users, stream} = (snapshot.val() as RoomsModelInner);
        if (users) {
          const userValue = Object.values(users);
          setUserCountIn(userValue.length);

          // if (userValue.length > totalUsersIn) 
          //   setMessages((p) => p.concat({message: userValue.pop()?.name + ' has joined the party'} as WeebMessages))
        }
        if (stream && rawLinks) {
          const compare = Object.keys(stream);
          const compareSecond = Object.keys(rawLinks);
          if (compare[0] !== compareSecond[0])
           setVideoLink(undefined);
        }

        setPaused(isPaused);
       
        if (snapshot.val().host) {
          host.current = snapshot.val().host;

        }
        else _hostDisconnected();
       }
      })

       return () => {

        database()
        .ref('/rooms/' + roomID)
        .off('value');


        database()
        .ref('/users/messages')
        .off('child_added');

        database()
        .ref('/users/messages')
        .off('child_changed');

        database()
      .ref('/rooms/' + roomID + '/users')
      .off('child_added');
        
       }
    }, []);

    const _hostDisconnected = () => {
      modalRef.current?.destroyRoom()
      Alert.alert('The party has ended', 'Host has left the room')
    }
    
    if (!videoLink)
      return <WeebLoadingVideo 
      coverImage={coverImage}
      roomID={roomID}
      canJoin={(value) => {}} 
      videoLink={(stream) => {
        setRawLinks(stream);
        setLoading(false);
        const streamObj = Object.entries(stream);
          setVideoLink(streamObj[0][1].link);
          setAvailableQualities(streamObj.map((i) => ({quality: i[0], link: i[1].link})));
      }} />


    const _onLoad = (data: OnLoadData) => {
      if (currentTimeState) {
        videoRef.current?.seek(currentTimeState)
      }
      setDuration(data.duration);
    }

    const _onProgress = (data: OnProgressData) => {
      const {currentTime} = data;
     setCurrentTime(currentTime);
     refCurrentTime.current = currentTime;

      if ((Number(currentTime.toFixed(0)) % 12) === 0 && currentTime.toFixed(0) !== '0' && !isPaused) {
        database()
        .ref('/rooms/' + roomID)
        .child('currentTime')
        .set(currentTime)
      }
    }

    const _onBuffer = (data: OnBufferData) => {
      const {isBuffering} = data;
      setBuffering(isBuffering);
    }

    const _onChangeVideo = (id?: number) => {      
      database()
      .ref('/rooms/' + roomID)
      .child('queue')
      .once('value', (snapshot) => {
        const data = snapshot.val() as {[key: number] : RoomsModelInnerData};
        if (!data) {
          //TODO: Add notification for non existent queue
          return;
        }
        const formData = Object.entries(data);
        
        if (!id) {
        const highestSort = formData.filter((i) => i[1].votes !== undefined).sort((a, b) => Object.values(b[1].votes!).length - Object.values(a[1].votes!).length);
        const prep = formData.filter((i) => i[1].votes === highestSort[0][1].votes);
        const randomSelection = prep[Math.floor(Math.random()*prep.length)];
        const streamObj: {[key: string]: {link: string;}} = convertArrayToObject(Object.values(randomSelection[1].stream!), 'quality');
        database()
        .ref('/rooms/' + roomID)
        .update({
          stream: streamObj,
          currentTime: 0,
          data: randomSelection[1],
        })
        .then(() => {
          setLoading(false);
          const entries = Object.entries(streamObj);
          setVideoLink(entries[0][1].link);
          setAvailableQualities(entries.map((i) => ({quality: i[0], link: i[1].link})));
        })
        .finally(() => {
          //Load the anime and remove from queue
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          database()
          .ref('/rooms/' + roomID)
          .child('queue')
          .child(randomSelection[1].animeID.toString())
          .remove();
        })
       } else {
        const selected = formData.find((i) => i[0] === id.toString());
        if (!selected) {
          Alert.alert('This queue could not be found on the server', )
          return;
        }
        const streamObj: {[key: string]: {link: string;}} = convertArrayToObject(Object.values(selected[1].stream!), 'quality');
        
        database()
        .ref('/rooms/' + roomID)
        .update({
          stream: streamObj,
          currentTime: 0,
          data: selected[1],
        })
        .then(() => {
          setLoading(false);
          const entries = Object.entries(streamObj);
          setVideoLink(entries[0][1].link);
          setAvailableQualities(entries.map((i) => ({quality: i[0], link: i[1].link})));
        })
        .finally(() => {
          //Load the anime and remove from queue
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          database()
          .ref('/rooms/' + roomID)
          .child('queue')
          .child(selected[1].animeID.toString())
          .remove();
        })

       }
      }) 
    }



    const _onVideoEnd = () => {
      console.log('the video has ended')
      setLoading(true);
     //if (firebaseUser!.uuid !== host.current?.id) return;
     _onChangeVideo();
      
    }
    

    const heightSize = (): number | string => {
      if (!modalRef.current?.state.isMinimized) 
        return fullScreen ? '100%': height;
      return height * 0.15;
    }

    const FloatingButton = (name: string, onPress: () => void, color: string = theme.colors.backgroundColor) => {
      return (
       <TouchableOpacity onPress={onPress}>
          <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: color, width: width * 0.12, borderRadius: width * 0.2 / 2, marginHorizontal: 6, aspectRatio: 1/1, overflow: 'hidden'}}>
          <Icon name={name} type={'MaterialCommunityIcons'} size={35} color={'white'} />
        </View>
       </TouchableOpacity>
      )
    }

    const OnSkip = (type: 'REWIND' | 'SKIP') => {
      const newTime = type === 'SKIP' ? (currentTimeState ?? 0) + 15 : (currentTimeState ?? 15) - 15;
      setPaused(true);
      videoRef.current?.seek(newTime)
      database()
      .ref('/rooms/' + roomID)
      .child('currentTime')
      .set(newTime, (error) => {
        if (error) {
          Alert.alert('An error has occured', 'Reason: ' + error.message);
          setPaused(false);
          return;
        }
        setCurrentTime(newTime)
        refCurrentTime.current = newTime;
        setPaused(false);
      })
    }


    const renderAvailableQualities = ({item} : {item: {link: string; quality: string}}) => {
      return (
        <TouchableOpacity
        onPress={() => {
          setVideoLink(item.link);
        }}
        >
          <View style={{height: height * 0.12, flexDirection: 'row', alignItems: 'center'}}>
          <ThemedText style={{marginHorizontal: 20, fontSize: 16, fontWeight: item.link === videoLink ? 'bold' : '400'}}>{item.quality}</ThemedText>
          {item.link === videoLink ? <Icon name={'check'} type={'MaterialCommunityIcons'} color={'green'} size={28} />: null}
        </View>
        </TouchableOpacity>
      )
    }
    
    return (
      <>
        <ThemedSurface style={[ {backgroundColor: fullScreen ? 'black' : theme.colors.backgroundColor,  height: heightSize(), width: '100%', paddingVertical: (modalRef.current?.state.isMinimized || fullScreen) ? 0 : 28}]}>
            <HomeIndicator autoHidden={true} />
            <View style={[modalRef.current?.state.isMinimized ? styles.queueingSize : fullScreen ? {height: width, width: height} : styles.videoViewPortrait, {flexDirection: 'row',  paddingLeft: (fsChatVisible && fullScreen) ? height * 0.05 : fullScreen ? hasNotch() ? fsChatVisible ? height * 0.08 : 0 :  0 : 0}]}>
                    <View style={{width: (fsChatVisible && fullScreen) ? height * 0.65 : '100%', height: '100%', flexDirection: 'row', justifyContent: (!fsChatVisible && fullScreen) ? 'center' : undefined, alignItems: (!fsChatVisible && fullScreen) ? 'center' : undefined, }}>
                    {
                      isLoading ? <View style={[modalRef.current?.state.isMinimized ? styles.videoInQueue : {height: '100%', width: '100%'}, {justifyContent: 'center', alignItems: 'center'}]}>
                        <ActivityIndicator />
                        <ThemedText style={{marginTop: 6}}>Loading your next video...</ThemedText>
                      </View> :
                      
                        <Video
                      ref={videoRef}
                      style={[modalRef.current?.state.isMinimized ? styles.videoInQueue : {height: '100%', width: '100%', alignSelf: 'center'},]}
                      source={{uri: videoLink}}
                      resizeMode={modalRef.current?.state.isMinimized ? 'cover' : 'contain'}
                      onProgress={_onProgress}
                      paused={isPaused}
                      ignoreSilentSwitch={'ignore'}
                      onLoad={_onLoad}
                      onEnd={_onVideoEnd}
                      onBuffer={_onBuffer}
                      pictureInPicture
                      onPictureInPictureStatusChanged={(data) => {
                        setPipActive(data.isActive)
                      }}
                      
                      />
                    }
                    {
                      modalRef.current?.state.isMinimized ? 
                      <View style={{flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'space-around', flex: 1}}>
                        {FloatingButton('arrow-up', () => {
                          modalRef.current?.openFull();
                        }, 'green')}
                        {FloatingButton('close', () => {
                          modalRef.current?.destroyRoom();
                        }, 'red')}
                      </View>
                      : null
                    }
                  { !modalRef.current?.state.isMinimized ? <WeebRoomOverlayController 
                  chatVisible={fsChatVisible || isPaused}
                  onChat={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    setFSChatVisible((vs) => !vs)
                  }}
                  isHost={host.current?.id === firebaseUser!.uuid}
                  currentTime={currentTimeState ?? 0}
                  duration={durationState ?? 0}
                    onFsTap={() => setFullScreen((fs) => !fs)}
                    onPausedTap={() => {}}
                    isFullScreen={fullScreen}
                    isBuffering={isBuffering}
                    isPaused={isPaused}
                    onForward={() => OnSkip('SKIP')}
                    onRewind={() => OnSkip('REWIND')}
                    onPausePlay={onPausePlay}
                    /> : null
                    }

                    </View>

                    {fsChatVisible && fullScreen ? <OverlayFullScreenChat messages={messages} roomID={roomID} viewWidth={fullScreen && fsChatVisible ? height * 0.35 : 0} /> : null}
            </View>

            {
                !fullScreen && !modalRef.current?.state.isMinimized ? 
                <View style={{flex: 1}}>
                <View style={{height: height * 0.07}}>
                    <InfoBar onModal={() => infoRef.current?.open()} onCog={() => settingsRef.current?.open()} />
                </View>
                <WeebViewPager roomID={roomID} messages={messages} onChangeSelected={(id) => {_onChangeVideo(id)}}  />
                </View>
                : null
            }
            <Modalize
            ref={infoRef}
            modalHeight={height * 0.64}
            scrollViewProps={{
              scrollEnabled: false,
            }}
            modalStyle={{backgroundColor: theme.colors.backgroundColor}}
            >
              <InfoPage roomID={roomID}
              pause={onPausePlay}
              onLeave={() => {
                modalRef.current?.destroyRoom();
              }} />
            </Modalize>
            
            <Modalize
            ref={settingsRef}
            adjustToContentHeight
            modalStyle={{backgroundColor: theme.colors.backgroundColor}}
            flatListProps={{
              data: availableQualities,
              renderItem: renderAvailableQualities,
              keyExtractor: (item) => item.link,
            }}
            />
        </ThemedSurface>
        {modalRef.current?.state.isMinimized ? <Divider /> : null}
        </>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    videoViewPortrait: {
        height: height * 0.28,
        width,
        backgroundColor: 'black'
    },
    videoFullScreen: {
      justifyContent: 'center',
      backgroundColor: 'black'
    },
    videoInQueue: {
      height: height * 0.11,
      width: width * 0.45,
      alignSelf: 'flex-start'
    },
    queueingSize: {
      height: height * 0.11,
      width: '100%',
      flexDirection: 'row',
    }
});

export default WeebRoom;
