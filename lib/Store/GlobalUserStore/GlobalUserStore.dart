import 'package:fish_redux/fish_redux.dart';

import 'GlobalUserReducer.dart';
import 'GlobalUserState.dart';

class GlobalUserStore {
  static Store<GlobalUserState>? _globalStore;

  static Store<GlobalUserState> get store => _globalStore ??=
      createStore<GlobalUserState>(GlobalUserState(), buildReducer());
}
