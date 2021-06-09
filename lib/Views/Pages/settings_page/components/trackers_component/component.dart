import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'state.dart';
import 'view.dart';

class SettingsTrackersComponent extends Component<SettingsTrackersState> {
  SettingsTrackersComponent()
      : super(
          effect: buildEffect(),
          view: buildView,
          dependencies: Dependencies<SettingsTrackersState>(
              adapter: null,
              slots: <String, Dependent<SettingsTrackersState>>{}),
        );
}
