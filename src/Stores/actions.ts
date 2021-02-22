import { BaseTheme, TaiyakiSettingsModel } from "../Models";

export interface DispatchActions {
    type: string;
}

 type UpdateSettingsAction = {
    type: 'UpdateSettings',
    payload: TaiyakiSettingsModel
}

 type UpdateThemeAction = {
    type: 'UpdateTheme',
    payload: BaseTheme
}

 type UpdateAccentAction = {
    type: 'UpdateAccent',
    payload: string;
}

export type Actions = UpdateSettingsAction | UpdateThemeAction | UpdateAccentAction;