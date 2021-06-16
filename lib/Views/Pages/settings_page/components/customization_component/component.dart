import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class CustomizationSettingComponent
    extends Component<CustomizationSettingState> {
  CustomizationSettingComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<CustomizationSettingState>(
              adapter: null,
              slots: <String, Dependent<CustomizationSettingState>>{}),
        );
}
