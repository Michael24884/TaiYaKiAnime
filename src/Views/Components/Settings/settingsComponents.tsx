import React, {FC} from 'react';
import {Dimensions, Switch, Image, StyleSheet, View} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../../Stores';
import {Divider, ThemedText} from '../base';

const {height, width} = Dimensions.get('window');

export const SettingsRow: FC<{
  title: string;
  value?: boolean | number | string;
  hasSwitcher?: boolean;
  onPress?: () => void;
  onValueChange?: (arg0: boolean) => void;
}> = (props) => {
  const {onPress, title, value, hasSwitcher, onValueChange} = props;
  if (hasSwitcher && !onValueChange)
    throw new Error('A boolean callback must be set for the switcher value');

  const _enabled = (value: boolean): 'Enabled' | 'Disabled' => {
    if (value) return 'Enabled';
    return 'Disabled';
  };

  return (
    <TouchableOpacity
      disabled={(typeof value === 'boolean' && hasSwitcher) || !onPress}
      onPress={onPress}>
      <View style={styles.settingRow.view}>
        <View>
          <ThemedText style={styles.settingRow.title}>{title}</ThemedText>
          <ThemedText style={styles.settingRow.desc}>
            {typeof value === 'boolean' ? _enabled(value) : value}
          </ThemedText>
        </View>
        {typeof value === 'boolean' && hasSwitcher ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{true: 'green', false: 'grey'}}
          />
        ) : onPress ? (
          <Icon
            name={'chevron-right'}
            type={'MaterialCommunityIcons'}
            size={30}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export const TaiyakiSettingsHeader = () => {
  return (
    <View style={styles.image.image}>
      <Image
        source={require('../../../assets/images/icon_round.png')}
        style={{height: '100%', width: '100%', marginBottom: 10}}
        resizeMode={'contain'}
      />
      <ThemedText style={styles.image.title}>Taiyaki</ThemedText>
      <ThemedText style={styles.image.moto}>Sync and Watch Anime</ThemedText>
    </View>
  );
};

export const SettingsHead: FC<{
  iconName: string;
  title: string;
  community?: boolean;
}> = (props) => {
  const {iconName, title, children, community} = props;
  const theme = useTheme((_) => _.theme);

  return (
    <>
      <View style={styles.settingHead.view}>
        <Icon
          name={iconName}
          type={community ? 'MaterialCommunityIcons' : 'MaterialIcons'}
          size={20}
          color={'grey'}
        />
        <ThemedText style={styles.settingHead.title}>{title}</ThemedText>
      </View>
      <View style={styles.settingHead.bottomView}>{children}</View>
      <View style={styles.settingHead.divider}>
        <Divider />
      </View>
    </>
  );
};

const styles = {
  settingRow: StyleSheet.create({
    view: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: width * 0.05,
      marginTop: height * 0.014,
      marginBottom: 4,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 15,
      fontWeight: '400',
    },
    desc: {
      fontSize: 13,
      fontWeight: '500',
      color: 'grey',
    },
  }),
  settingHead: StyleSheet.create({
    view: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: width * 0.05,
      marginTop: height * 0.02,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 12,
      color: 'grey',
    },
    bottomView: {
      marginBottom: 15,
    },
    divider: {
      paddingHorizontal: width * 0.05,
    },
  }),
  rows: StyleSheet.create({
    view: {
      width,
      padding: height * 0.01,
    },
  }),
  image: StyleSheet.create({
    image: {
      height: height * 0.15,
      width,
      marginBottom: height * 0.1,
    },
    moto: {
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'center',
      marginTop: 5,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  }),
};
