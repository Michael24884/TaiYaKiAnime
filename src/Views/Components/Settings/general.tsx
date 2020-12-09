import React from 'react';
import {StyleSheet} from 'react-native';
import {ThemedSurface} from '../base';

const GeneralPage = () => {
  return <ThemedSurface style={styles.view}></ThemedSurface>;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default GeneralPage;
