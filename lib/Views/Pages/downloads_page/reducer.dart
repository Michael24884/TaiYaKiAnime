import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<DownloadsState> buildReducer() {
  return asReducer(
    <Object, Reducer<DownloadsState>>{
      DownloadsAction.action: _onAction,
    },
  );
}

DownloadsState _onAction(DownloadsState state, Action action) {
  final DownloadsState newState = state.clone();
  return newState;
}
