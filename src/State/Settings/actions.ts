import { set } from "react-native-reanimated";
import { TaiyakiSettingsModel } from "../../Models";
import { SetSettingsAction } from "../types";

export enum SETTINGS_ACTION_TYPES {
    SET_SETTINGS = 'SETTINGS/SET_SETTINGS',
}

export const setSettings = (settings: TaiyakiSettingsModel): SetSettingsAction => ({type: SETTINGS_ACTION_TYPES.SET_SETTINGS, settings})