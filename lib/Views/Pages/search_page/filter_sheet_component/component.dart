import 'package:fish_redux/fish_redux.dart';

import 'view.dart';
import 'reducer.dart';
import 'state.dart';

class FilterSheetComponent extends Component<FilterSheetState> {
  FilterSheetComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<FilterSheetState>(
              adapter: null, slots: <String, Dependent<FilterSheetState>>{}),
        );
}
