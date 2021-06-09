import 'package:fish_redux/fish_redux.dart';

import 'adapter.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class WatchComponent extends Component<WatchState> {
  WatchComponent()
      : super(
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<WatchState>(
              adapter: NoneConn<WatchState>() + WatchComponentAdapter(),
              slots: <String, Dependent<WatchState>>{}),
        );
}
