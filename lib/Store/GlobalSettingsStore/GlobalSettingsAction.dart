import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';

enum GlobalSettingsAction { updateSettings }

class GlobalSettingsActionCreator {
  static Action onUpdateSettings(AppSettingsModel model) {
    return Action(GlobalSettingsAction.updateSettings, payload: model);
  }
}
