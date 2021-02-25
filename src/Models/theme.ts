import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export interface BaseTheme {
  name: string;
  dark: boolean;
  colors: {
    primary: string;
    secondaryBackgroundColor: string;
    backgroundColor: string;
    surface: string;
    text: 'white' | 'black';
    accent: string;
    card: string;
  };
};

export const LightTheme: BaseTheme = {
  name: 'Light',
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5D07B2',
    accent: '#F570C0',
    backgroundColor: 'white',
    secondaryBackgroundColor: '#ededed',
    surface: '#f0f0f0',
    text: 'black',
  },
};
export const TaiyakiLightTheme: BaseTheme = {
  name: 'Light',
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5D07B2',
    accent: '#F570C0',
    backgroundColor: '#ffffff',
    secondaryBackgroundColor: '#ededed',
    surface: '#f0f0f0',
    text: 'black',
  },
};
export const TaiyakiDarkTheme: BaseTheme = {
  name: 'Dark',
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    accent: '#247ba0',
    backgroundColor: '#242a38',
    secondaryBackgroundColor: '#242a38a8',
    card: '#202532',
    surface: '#f0f0f0',
    text: 'white',
  },
};
export const TaiyakiBlackTheme: BaseTheme = {
  name: 'Darker than Black',
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    accent: '#247ba0',
    backgroundColor: '#000000',
    secondaryBackgroundColor : '#000000a8', 
    card: '#171a17',
    surface: '#f0f0f0',
    text: 'white',
  },
};
