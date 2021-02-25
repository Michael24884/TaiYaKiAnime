import { TaiyakiSettingsModel } from '../../Models';
import {settingsStore} from './store';

export const setSettingsAction = (settings: TaiyakiSettingsModel) => settingsStore.setSettings(settings);