import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardPage1State> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardPage1State>>{
      OnboardPage1Action.action: _onAction,
      OnboardPage1Action.updateTheme: _onUpdateTheme,
    },
  );
}

OnboardPage1State _onAction(OnboardPage1State state, Action action) {
  final OnboardPage1State newState = state.clone();
  return newState;
}

OnboardPage1State _onUpdateTheme(OnboardPage1State state, Action action) {
  final OnboardPage1State newState = state.clone();
  final String themeName = action.payload;

  switch (themeName) {
    case 'Light':
      newState.appSettingsModel = state.appSettingsModel!..isDarkMode = false;
      break;
    case 'Dark':
      newState.appSettingsModel = state.appSettingsModel!..isDarkMode = true;
      break;
    default:
      break;
  }

  return newState;
}
