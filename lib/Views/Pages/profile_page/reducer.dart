import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<ProfileState> buildReducer() {
  return asReducer(
    <Object, Reducer<ProfileState>>{
      ProfileAction.action: _onAction,
      ProfileAction.updateStats: _updateStats,
    },
  );
}

ProfileState _onAction(ProfileState state, Action action) {
  final ProfileState newState = state.clone();
  return newState;
}

ProfileState _updateStats(ProfileState state, Action action) {
  final ProfileState newState = state.clone();
  newState.anilistStats = action.payload;
  return newState;
}
