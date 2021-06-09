import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum CustomizationSettingAction { action }

class CustomizationSettingActionCreator {
  static Action onAction() {
    return const Action(CustomizationSettingAction.action);
  }
}
