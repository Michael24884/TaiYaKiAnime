import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserAction.dart';

//TODO replace with your own action
enum SettingsAction { action, updateUserModel, updateSetting }

class SettingsActionCreator {
  static Action onAction() {
    return const Action(SettingsAction.action);
  }

  static Action onUpdateSetting(AppSettingsModel settings) {
    return Action(SettingsAction.updateSetting, payload: settings);
  }

  static Action updateUserModel(UpdateModel tracker) {
    return Action(SettingsAction.updateUserModel, payload: tracker);
  }
}
