/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {
  Alert,
  ScrollView,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {
  LoginConfigModel,
  TaiyakiUserModel,
  TrackingServiceTypes,
} from '../../../Models/taiyaki';
import {useTheme, useUserProfiles} from '../../../Stores';
import {MapTrackingServiceToAssets} from '../../../Util';
import {ThemedSurface, ThemedText} from '../base';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from 'react-native-inappbrowser-reborn';
import {AnilistLoginModel} from '../../../Models/Anilist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnilistBase, MyAnimeList} from '../../../Classes/Trackers';
import {MyAnimeListLoginModel} from '../../../Models/MyAnimeList';
import {SIMKLLoginConfigModel} from '../../../Models/SIMKL';
import {SIMKL} from '../../../Classes/Trackers/SIMKL';

const {height, width} = Dimensions.get('window');

export const TrackerPage = () => {
  return (
    <ThemedSurface style={styles.tracker.view}>
      <ScrollView>
        <Card source={'Anilist'} />
        <Card source={'MyAnimeList'} />
        <Card source={'SIMKL'} />
      </ScrollView>
    </ThemedSurface>
  );
};

const Card: FC<{
  source: TrackingServiceTypes;
}> = (props) => {
  const {source} = props;
  const theme = useTheme((_) => _.theme);
  const isLoggedIn = useUserProfiles((_) => _.isLoggedIn);
  const addUser = useUserProfiles((_) => _.addToProfile);
  const removeUser = useUserProfiles((_) => _.removeProfile);
  const profiles = useUserProfiles((_) => _.profiles);

  const onSignIn = () => {
    if (isLoggedIn(source)) {
      removeUser(source);
      return;
    }
    let loginConfig: LoginConfigModel;
    switch (source) {
      case 'Anilist':
        loginConfig = AnilistLoginModel;
        break;
      case 'MyAnimeList':
        loginConfig = MyAnimeListLoginModel;
        break;
      case 'SIMKL':
        loginConfig = SIMKLLoginConfigModel;
        break;
      default:
        return;
    }
    authenticate(loginConfig);
  };

  const authenticate = async (model: LoginConfigModel) => {
    const {redirectUri, authUrl} = model;
    await InAppBrowser.isAvailable().then((available) => {
      if (!available)
        Alert.alert(
          'Sorry about this',
          "It seems like you can't use the browser at the moment, try again or report this.",
          [{text: 'Dismiss'}],
        );
      const authConfig: InAppBrowserOptions = {
        ephemeralWebSession: false,
        preferredBarTintColor: 'white',
        toolbarColor: theme.colors.primary,
      };
      InAppBrowser.openAuth(authUrl, redirectUri, authConfig).then(
        (response) => {
          const {type} = response;
          if (type === 'success') {
            //@ts-ignore
            const {url} = response;
            const codeExtractor = new RegExp(/=([^&]+)/);
            let code = url.match(codeExtractor);

            if (code) {
              code = code[1];
              if (source === 'Anilist') {
                const profile: TaiyakiUserModel = {
                  bearerToken: code,
                  source: 'Anilist',
                  profile: {},
                  class: new AnilistBase(),
                };
                addUser(profile).then(() => {
                  new AnilistBase().fetchProfile();
                });

                return;
              } else if (source === 'MyAnimeList') {
                new MyAnimeList()
                  .tradeCodeForBearer(code, model.randomCode!)
                  .then((objects) => {
                    const {access_token, refresh_token, expires_in} = objects;
                    const profile: TaiyakiUserModel = {
                      bearerToken: access_token,
                      refreshToken: refresh_token,
                      expiresIn: new Date(Date.now() + expires_in),
                      source: 'MyAnimeList',
                      profile: {},
                      class: new MyAnimeList(),
                    };
                    addUser(profile).then(() =>
                      new MyAnimeList().fetchProfile(),
                    );
                  });
                return;
              } else if (source === 'SIMKL') {
                const simkl = new SIMKL();
                simkl.tradeCodeForBearer(code).then((token) => {
                  const profile: TaiyakiUserModel = {
                    bearerToken: token,
                    class: new SIMKL(),
                    profile: {},
                    source: 'SIMKL',
                  };
                  addUser(profile).then((profile) => {
                    simkl.fetchProfile(profile, true);
                  });
                });
                return;
              }
            }
          }
        },
      );
    });
  };

  return (
    <ThemedSurface style={styles.card.view}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
        }}>
        <Image
          source={MapTrackingServiceToAssets.get(source)!}
          style={styles.card.image}
        />
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            width: '100%',
            flex: 1,
            alignItems: 'flex-end',
          }}>
          <View style={{width: '100%'}}>
            <ThemedText style={styles.card.username}>
              {isLoggedIn(source)
                ? isLoggedIn(source)?.profile.username
                : 'Not Logged In'}
            </ThemedText>
            <ThemedText style={styles.card.source}>{source}</ThemedText>
          </View>
          <Button
            title={isLoggedIn(source) ? 'Sign Out' : 'Sign In'}
            onPress={onSignIn}
            color={!isLoggedIn(source) ? undefined : 'red'}
          />
        </View>
      </View>
    </ThemedSurface>
  );
};

const styles = {
  card: StyleSheet.create({
    view: {
      height: height * 0.15,
      width: width * 0.96,
      alignSelf: 'center',
      borderRadius: 6,
      shadowRadius: 5,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowOffset: {width: 0, height: 1},
      marginVertical: height * 0.01,
      padding: width * 0.02,
    },
    image: {
      width: width * 0.15,
      aspectRatio: 1 / 1,
      borderRadius: (width * 0.15) / 2,
    },
    cardTitles: {
      fontSize: 17,
      fontWeight: '600',
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    source: {
      fontSize: 14,
      fontWeight: '300',
      color: 'grey',
    },
  }),
  tracker: StyleSheet.create({
    view: {
      flex: 1,
    },
  }),
};
