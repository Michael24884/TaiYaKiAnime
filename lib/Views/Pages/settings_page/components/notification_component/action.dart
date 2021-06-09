import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum NotificationSettingsAction { action }

class NotificationSettingsActionCreator {
  static Action onAction() {
    return const Action(NotificationSettingsAction.action);
  }
}
