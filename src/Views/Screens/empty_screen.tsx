import React, {FC} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {useTheme} from '../../Stores';
import {ThemedSurface, ThemedText} from '../Components';

const {height} = Dimensions.get('window');

interface Props {
  message: string;
  hasHeader?: boolean;
}
export const EmptyScreen: FC<Props> = (props) => {
  const {message, hasHeader} = props;
  const surface = useTheme((_) => _.theme).colors.surface;

  return (
    <View
      style={{
        height,
        backgroundColor: surface,
      }}>
      <ThemedSurface style={styles.container}>
        <View
          style={[
            hasHeader ? styles.iconViewWithHeader : styles.iconView,
            {
              marginBottom: height * 0.3,
            },
          ]}>
          <Icon name="error" type={'MaterialIcons'} size={50} color={'red'} />
          <ThemedText style={styles.text}>{message}</ThemedText>
        </View>
      </ThemedSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  iconView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconViewWithHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 8,
    textAlign: 'center',
  },
});
