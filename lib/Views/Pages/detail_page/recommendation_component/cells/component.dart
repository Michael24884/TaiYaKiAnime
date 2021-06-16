import 'package:fish_redux/fish_redux.dart';

import 'state.dart';
import 'view.dart';
import 'effect.dart';

class RecommendationCellsComponent extends Component<RecommendationCellsState> {
  RecommendationCellsComponent()
      : super(
          view: buildView,
          effect: buildEffect(),
          dependencies: Dependencies<RecommendationCellsState>(
              adapter: null,
              slots: <String, Dependent<RecommendationCellsState>>{}),
        );
}
