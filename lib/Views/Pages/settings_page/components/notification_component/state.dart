import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/settings_page/state.dart';

class NotificationSettingsState
    implements Cloneable<NotificationSettingsState> {
  @override
  NotificationSettingsState clone() {
    return NotificationSettingsState();
  }
}

class NotificationSettingConnector
    extends ConnOp<SettingsState, NotificationSettingsState> {
  @override
  NotificationSettingsState get(SettingsState state) {
    final subState = NotificationSettingsState().clone();
    return subState;
  }
}
