import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class NotificationSettingsComponent
    extends Component<NotificationSettingsState> {
  NotificationSettingsComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<NotificationSettingsState>(
              adapter: null,
              slots: <String, Dependent<NotificationSettingsState>>{}),
        );
}
