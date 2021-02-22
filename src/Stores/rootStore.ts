// import {createContext, useReducer} from 'react';
// import { BaseTheme, LightTheme, TaiyakiDefaultSettings, TaiyakiSettingsModel } from '../Models';
// import {Actions} from './actions';




// interface State {
//     theme: BaseTheme;
//     settings: TaiyakiSettingsModel;
// }

// export const TaiyakiInitialState: State = {
//     theme: LightTheme,
//     settings: TaiyakiDefaultSettings,
// }

// export const TaiyakiReducer = (state: State, action: Actions): State => {
//     switch(action.type) {
//         case 'UpdateTheme':
//             return {...state, theme: action.payload};
//         case 'UpdateAccent':
//             return {...state, theme: {...state.theme, colors: {...state.theme.colors, accent: action.payload}}};
//         case 'UpdateSettings':
//             return {...state, settings: action.payload};
//         default: return state;
//     }
// }

// export const TaiyakiContext = createContext<{ state: State; dispatch: React.Dispatch<Actions>; }>({});

import {useState, useCallback} from 'react';
import constate from 'constate';
import { BaseTheme, LightTheme, TaiyakiDefaultSettings, TaiyakiSettingsModel } from '../Models';

export const useTheme = () => {
 const [memoTheme, setTheme] = useState<BaseTheme>(LightTheme);
 
 const updateAccent = (accent: string) => setTheme((t) => ({...t, colors: {...t.colors, accent}}));
 
 return {memoTheme, updateAccent};
}

export const useSettings = () => {
    const [settings, setSettings] = useState<TaiyakiSettingsModel>(TaiyakiDefaultSettings);

    const updateSettings = (setting: TaiyakiSettingsModel) => setSettings(setting)

    return {settings, updateSettings};
}

export const [SettingsProvider, useTaiyakiSettings, useUpdateSettings] = constate(
    useSettings,
    value => value.settings,
    value => value.updateSettings
)


export const [ThemeProvider, useTaiyakiTheme, useUpdateAccent] = constate(
    useTheme,
    value => value.memoTheme,
    value => value.updateAccent,
    );