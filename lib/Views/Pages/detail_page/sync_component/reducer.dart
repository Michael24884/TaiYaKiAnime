import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<SyncState> buildReducer() {
  return asReducer(
    <Object, Reducer<SyncState>>{
      SyncAction.action: _onAction,
      SyncAction.onUpdateAnilist: _onUpdateAnilist,
      SyncAction.onUpdateMAL: _onUpdateMAL,
      SyncAction.onUpdateSimkl: _onUpdateSimkl
    },
  );
}

SyncState _onAction(SyncState state, Action action) {
  final SyncState newState = state.clone();
  return newState;
}

SyncState _onUpdateAnilist(SyncState state, Action action) {
  final SyncState newState = state.clone();
  newState.anilistSync = action.payload;
  return newState;
}

SyncState _onUpdateMAL(SyncState state, Action action) {
  final SyncState newState = state.clone();
  newState.malSync = action.payload;
  return newState;
}

SyncState _onUpdateSimkl(SyncState state, Action action) {
  final SyncState newState = state.clone();
  newState.simklSync = action.payload;
  return newState;
}
