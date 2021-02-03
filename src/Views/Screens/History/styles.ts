import {ScaledSheet} from 'react-native-size-matters';

export const styles = ScaledSheet.create({
    view: {
      flex: 1,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    episodeNumber: {
        fontWeight: '500',
        fontSize: '13@ms'
    }
  });