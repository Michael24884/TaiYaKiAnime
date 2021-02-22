import { TaiyakiSettingsModel } from '../../Models';
import {settingsStore} from './store';

export const setSettings = (settings: TaiyakiSettingsModel) => settingsStore.setSettings(settings);