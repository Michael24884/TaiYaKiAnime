import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class BadeCellsComponent extends Component<BadeCellsState> {
  BadeCellsComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<BadeCellsState>(
              adapter: null, slots: <String, Dependent<BadeCellsState>>{}),
        );
}
