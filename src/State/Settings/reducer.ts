import { SettingsActionUnion, SettingsType } from "../types";
import { SETTINGS_ACTION_TYPES } from "./actions";

export const settingsReducer = (state: SettingsType, action: SettingsActionUnion): SettingsType => {
    switch(action.type) {
        case SETTINGS_ACTION_TYPES.SET_SETTINGS:
            return ({...state, settings: action.settings});
        default:
            return state;
    }
}