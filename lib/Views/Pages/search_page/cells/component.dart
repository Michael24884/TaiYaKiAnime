import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'state.dart';
import 'view.dart';

class SearchCellsComponent extends Component<SearchCellsState> {
  SearchCellsComponent()
      : super(
          effect: buildEffect(),
          view: buildView,
          dependencies: Dependencies<SearchCellsState>(
              adapter: null, slots: <String, Dependent<SearchCellsState>>{}),
        );
}
