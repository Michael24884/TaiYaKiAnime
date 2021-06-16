import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class SyncComponent extends Component<SyncState> {
  SyncComponent()
      : super(
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<SyncState>(
              adapter: null, slots: <String, Dependent<SyncState>>{}),
        );
}
