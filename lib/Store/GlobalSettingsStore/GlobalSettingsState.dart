import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';

abstract class GlobalSettingsBaseState {
  AppSettingsModel appSettings = new AppSettingsModel();
}

class GlobalSettingsState
    implements GlobalSettingsBaseState, Cloneable<GlobalSettingsState> {
  @override
  GlobalSettingsState clone() =>
      GlobalSettingsState()..appSettings = appSettings;

  @override
  AppSettingsModel appSettings = new AppSettingsModel();
}
