import 'package:fish_redux/fish_redux.dart';

import 'adapter.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class QueueComponent extends Component<QueueState> {
  QueueComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<QueueState>(
              adapter: NoneConn<QueueState>() + QueueAdapter(),
              slots: <String, Dependent<QueueState>>{}),
        );
}
