/**
 * @format
 */

 import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { SettingProvider } from './src/Stores/Settings/store';

// const Base = () => {
//     return <SettingProvider>
//         <App/>
//     </SettingProvider>
// }

AppRegistry.registerComponent(appName, () => App);
