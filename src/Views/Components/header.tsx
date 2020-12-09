import React, {Component, FC, PureComponent, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {useTheme} from '../../Stores';
import {TaiyakiParsedText, ThemedText} from './base';
import LinearGradient from 'react-native-linear-gradient';
import {timeUntil} from '../../Util';

const {height, width} = Dimensions.get('window');

class TaiyakiHeader extends Component<{
  color: string;
  headerColor: string;
  opacity?: Animated.AnimatedInterpolation;
  onPress: () => void;
}> {
  shouldComponentUpdate(o) {
    return this.props.opacity !== o.opacity;
  }

  render() {
    return (
      <>
        <View style={[styles.view]}>
          <View style={[styles.view]}>
            <TouchableWithoutFeedback onPress={this.props.onPress}>
              <View style={[{flexDirection: 'row'}]}>
                <Icon
                  name={'arrow-back-ios'}
                  type={'MaterialIcons'}
                  color={'white'}
                  size={width * 0.07}
                />
                <ThemedText style={[styles.backtext]}>Back</ThemedText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <Animated.View
          style={[
            {
              backgroundColor: this.props.color,
              height: Platform.OS === 'ios' ? height * 0.13 : height * 0.16,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5,
              opacity: this.props.opacity ?? 1,
            },
          ]}
        />

        <View pointerEvents={'none'} style={styles.below} />
      </>
    );
  }
}

export const SynopsisExpander: FC<{
  synopsis?: string;
  nextAiringEpisode?: {episode: number; timeUntilAiring: number};
}> = (props) => {
  const [expand, setExpand] = useState<boolean>(false);
  const {synopsis, nextAiringEpisode} = props;
  const theme = useTheme((_) => _.theme);
  const styles = StyleSheet.create({
    surface: {
      backgroundColor: theme.colors.backgroundColor,
      marginHorizontal: width * 0.025,
      borderRadius: 4,
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
      }),
      marginBottom: height * 0.02,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.01,
      marginBottom: height * 0.01,
    },
    synopsis: {fontSize: 13, marginBottom: height * 0.01},
    floatingButton: {
      alignSelf: 'flex-end',
      marginRight: width * 0.03,
      marginBottom: width * 0.03,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }),
    },
    button: {
      backgroundColor: theme.colors.accent,
      width: width * 0.11,
      aspectRatio: 1 / 1,
      borderRadius: (width * 0.11) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gradientView: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: height * 0.1,
      overflow: 'hidden',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    airingView: {
      backgroundColor: '#008000',

      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    airingText: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      color: 'white',
      marginVertical: 2,
    },
  });

  return (
    <View style={styles.surface}>
      {nextAiringEpisode ? (
        <View style={styles.airingView}>
          <ThemedText style={styles.airingText}>
            Episode {nextAiringEpisode.episode} airs in{' '}
            {timeUntil(nextAiringEpisode.timeUntilAiring)}
          </ThemedText>
        </View>
      ) : null}
      <View style={{paddingHorizontal: width * 0.02}}>
        <ThemedText style={styles.subTitle}>Synopsis</ThemedText>
        <View
          style={{
            overflow: 'hidden',
          }}>
          <TaiyakiParsedText
            color={'grey'}
            style={styles.synopsis}
            numberOfLines={expand ? undefined : 4}>
            {synopsis ?? 'No synopsis has been provided at this time '}
          </TaiyakiParsedText>
        </View>
        {/* {expand ? null : (synopsis?.length ?? 0) > 85 ? (
          <View style={styles.gradientView}>
            <LinearGradient
              style={{flex: 1}}
              colors={[
                theme.dark ? '#00000000' : '#ffffff00',
                theme.colors.backgroundColor,
              ]}
            />
          </View>
        ) : null} */}
        {(synopsis?.length ?? 0) > 85 ? (
          <View style={styles.floatingButton}>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setExpand((ex) => !ex);
              }}>
              <View style={styles.button}>
                <Icon
                  name={expand ? 'arrow-upward' : 'arrow-downward'}
                  type={'MaterialIcons'}
                  size={height * 0.03}
                  color={'white'}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width,
    height: Platform.OS === 'ios' ? height * 0.13 : height * 0.16,
    justifyContent: 'flex-end',
    paddingBottom: height * 0.03,
    paddingHorizontal: width * 0.04,
    backgroundColor: 'transparent',
  },

  backtext: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
  below: {
    height: Platform.OS === 'ios' ? height * 0.13 : height * 0.16,
    backgroundColor: 'transparent',
  },
});

export default TaiyakiHeader;
