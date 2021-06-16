import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class AnimeListCellComponent extends Component<AnimeListCellState> {
  AnimeListCellComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<AnimeListCellState>(
              adapter: null, slots: <String, Dependent<AnimeListCellState>>{}),
        );
}
