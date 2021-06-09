import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserAction.dart';

import 'action.dart';
import 'state.dart';

Reducer<SettingsState> buildReducer() {
  return asReducer(
    <Object, Reducer<SettingsState>>{
      SettingsAction.action: _onAction,
      SettingsAction.updateUserModel: _updateTracker,
      SettingsAction.updateSetting: _updateSetting,
    },
  );
}

SettingsState _onAction(SettingsState state, Action action) {
  final SettingsState newState = state.clone();
  return newState;
}

SettingsState _updateSetting(SettingsState state, Action action) {
  final SettingsState newState = state.clone();
  newState.appSettings = action.payload;
  return newState;
}

SettingsState _updateTracker(SettingsState state, Action action) {
  final SettingsState newState = state.clone();
  final UpdateModel tracker = action.payload;

  switch (tracker.tracker) {
    case ThirdPartyTrackersEnum.simkl:
      newState.simklUser = state.simklUser?.copyWith(
        accessToken: tracker.model.accessToken,
        refreshToken: tracker.model.refreshToken,
        expiresIn: tracker.model.expiresIn,
      );
      break;
    case ThirdPartyTrackersEnum.myanimelist:
      newState.myanimelistUser = state.myanimelistUser?.copyWith(
        accessToken: tracker.model.accessToken,
        refreshToken: tracker.model.refreshToken,
        expiresIn: tracker.model.expiresIn,
      );
      break;
    case ThirdPartyTrackersEnum.anilist:
      newState.anilistUser = state.anilistUser?.copyWith(
        accessToken: tracker.model.accessToken,
        refreshToken: tracker.model.refreshToken,
        expiresIn: tracker.model.expiresIn,
      );
      break;
  }
  return newState;
}
