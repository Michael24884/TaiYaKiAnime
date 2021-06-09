import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';

import 'GlobalUserAction.dart';
import 'GlobalUserState.dart';

Reducer<GlobalUserState> buildReducer() {
  return asReducer(
    <Object, Reducer<GlobalUserState>>{
      GlobalUserAction.updateUser: _onUpdateModel,
      GlobalUserAction.onOnboarding: _onUpdateOnboard,
      GlobalUserAction.updateUserList: _onUpdateUserList,
      GlobalUserAction.removeUser: _onRemoveUser,
    },
  );
}

GlobalUserState _onUpdateOnboard(GlobalUserState state, Action action) {
  final newState = state.clone();
  newState.passedOnboarding = true;
  return newState;
}

GlobalUserState _onUpdateUserList(GlobalUserState state, Action action) {
  final newState = state.clone();
  final Map<ThirdPartyTrackersEnum, List<AnimeListModel>> data = action.payload;

  switch (data.keys.first) {
    case ThirdPartyTrackersEnum.anilist:
      newState.anilistUserList = data.values.first;
      break;
    case ThirdPartyTrackersEnum.myanimelist:
      newState.myanimelistUserList = data.values.first;
      break;
    case ThirdPartyTrackersEnum.simkl:
      newState.simklUserList = data.values.first;
      break;
  }

  return newState;
}

GlobalUserState _onUpdateModel(GlobalUserState state, Action action) {
  final UpdateModel model = action.payload;
  final clone = state.clone();
  switch (model.tracker) {
    case ThirdPartyTrackersEnum.anilist:
      clone..anilistUser = model.model;
      break;
    case ThirdPartyTrackersEnum.myanimelist:
      clone..myanimelistUser = model.model;
      break;
    case ThirdPartyTrackersEnum.simkl:
      clone..simklUser = model.model;
      break;
  }
  return clone;
}

GlobalUserState _onRemoveUser(GlobalUserState state, Action action) {
  final ThirdPartyTrackersEnum tracker = action.payload;
  final clone = state.clone();
  switch (tracker) {
    case ThirdPartyTrackersEnum.anilist:
      clone..anilistUser = null;
      break;
    case ThirdPartyTrackersEnum.myanimelist:
      clone..myanimelistUser = null;
      break;
    case ThirdPartyTrackersEnum.simkl:
      clone..simklUser = null;
      break;
  }
  return clone;
}
