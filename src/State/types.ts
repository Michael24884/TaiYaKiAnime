import { TaiyakiSettingsModel } from "../Models";
import { SETTINGS_ACTION_TYPES } from "./Settings/actions";

export type SettingsType = {
    settings: TaiyakiSettingsModel;
};

export type SetSettingsAction = {
    type: SETTINGS_ACTION_TYPES;
    settings: TaiyakiSettingsModel;
};

export type SettingsActionUnion = SetSettingsAction;
export type AppState = {
    settings: SettingsType,
}