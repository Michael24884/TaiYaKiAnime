import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsAction.dart';

import 'GlobalSettingsState.dart';

Reducer<GlobalSettingsState> buildReducer() {
  return asReducer(
    <Object, Reducer<GlobalSettingsState>>{
      GlobalSettingsAction.updateSettings: _updateSettings,
    },
  );
}

GlobalSettingsState _updateSettings(GlobalSettingsState state, Action action) {
  final _state = state.clone();
  _state.appSettings = action.payload;
  return _state;
}
