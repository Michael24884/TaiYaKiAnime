import {AppState} from './types';
import {combineReducers} from 'redux';
import { settingsReducer } from './Settings/reducer';

export const store = combineReducers(settingsReducer);
