import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<NotificationSettingsState> buildReducer() {
  return asReducer(
    <Object, Reducer<NotificationSettingsState>>{
      NotificationSettingsAction.action: _onAction,
    },
  );
}

NotificationSettingsState _onAction(
    NotificationSettingsState state, Action action) {
  final NotificationSettingsState newState = state.clone();
  return newState;
}
