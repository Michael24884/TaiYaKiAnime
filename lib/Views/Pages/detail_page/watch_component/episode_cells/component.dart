import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class EpisodeCellComponent extends Component<EpisodeCellState> {
  EpisodeCellComponent()
      : super(
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<EpisodeCellState>(
              adapter: null, slots: <String, Dependent<EpisodeCellState>>{}),
        );
}
