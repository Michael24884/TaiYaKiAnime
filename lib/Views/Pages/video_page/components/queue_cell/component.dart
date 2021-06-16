import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class QueueCellComponent extends Component<QueueCellState> {
  QueueCellComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<QueueCellState>(
              adapter: null, slots: <String, Dependent<QueueCellState>>{}),
        );
}
