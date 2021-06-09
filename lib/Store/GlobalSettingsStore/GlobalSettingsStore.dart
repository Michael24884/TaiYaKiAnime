import 'package:fish_redux/fish_redux.dart';

import 'GlobalSettingsReducer.dart';
import 'GlobalSettingsState.dart';

class GlobalSettingsStore {
  static Store<GlobalSettingsState>? _globalStore;

  static Store<GlobalSettingsState> get store => _globalStore ??=
      createStore<GlobalSettingsState>(GlobalSettingsState(), buildReducer());
}
