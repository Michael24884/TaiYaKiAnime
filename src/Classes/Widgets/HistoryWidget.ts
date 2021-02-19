import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedGroup from 'react-native-shared-group-preferences';
import { HistoryModel } from '../../Models';

const GROUP_IDENTIFIER = 'group.com.izanamiNightz';

class WidgetHandler {
 async getLatestHistory() {
   try {
     const file = await AsyncStorage.getItem('history');
     if (!file) return;
     const json = JSON.parse(file) as HistoryModel[];
     if (json.length > 0) {
         await SharedGroup.setItem('historyWidgetData', json[0], GROUP_IDENTIFIER);
     }
   } catch(error) {
    console.log('Error in widget: ', error);
   } 
 }

}

export const widgetHandler = new WidgetHandler();