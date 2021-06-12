import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class ContinueWatchingRowComponent extends Component<ContinueWatchingRowState> {
  ContinueWatchingRowComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<ContinueWatchingRowState>(
              adapter: null,
              slots: <String, Dependent<ContinueWatchingRowState>>{}),
        );
}
