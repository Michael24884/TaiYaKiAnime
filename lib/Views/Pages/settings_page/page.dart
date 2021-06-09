import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/customization_component/component.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/customization_component/state.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/general_component/component.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/general_component/state.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/notification_component/component.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/notification_component/state.dart';
import 'package:taiyaki/Views/Pages/settings_page/components/trackers_component/state.dart';

import 'components/trackers_component/component.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class SettingsPage extends Page<SettingsState, Map<String, dynamic>> {
  SettingsPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<SettingsState>(
              adapter: null,
              slots: <String, Dependent<SettingsState>>{
                'trackers':
                    SettingsTrackersConnector() + SettingsTrackersComponent(),
                'general':
                    GeneralComponentConnector() + GeneralComponentComponent(),
                'notification': NotificationSettingConnector() +
                    NotificationSettingsComponent(),
                'customization': CustomizationSettingConnector() +
                    CustomizationSettingComponent(),
              }),
          middleware: <Middleware<SettingsState>>[],
        );
}
