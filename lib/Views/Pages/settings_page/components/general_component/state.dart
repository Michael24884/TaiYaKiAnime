import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';

import '../../state.dart';

class GeneralComponentState implements Cloneable<GeneralComponentState> {
  AppSettingsModel? appSettingsModel;

  @override
  GeneralComponentState clone() {
    return GeneralComponentState()..appSettingsModel = appSettingsModel;
  }
}

class GeneralComponentConnector
    extends ConnOp<SettingsState, GeneralComponentState> {
  @override
  GeneralComponentState get(SettingsState state) {
    final subState = GeneralComponentState().clone();
    subState.appSettingsModel = state.appSettings;
    return subState;
  }
}
