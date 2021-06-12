import 'package:fish_redux/fish_redux.dart';

import 'state.dart';
import 'view.dart';

class StatsComponent extends Component<StatsState> {
  StatsComponent()
      : super(
          view: buildView,
          dependencies: Dependencies<StatsState>(
              adapter: null, slots: <String, Dependent<StatsState>>{}),
        );
}
