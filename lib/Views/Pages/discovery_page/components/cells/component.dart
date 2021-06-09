import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'state.dart';
import 'view.dart';

class DiscoveryRowCellsComponent extends Component<DiscoveryRowCellsState> {
  DiscoveryRowCellsComponent()
      : super(
          shouldUpdate: (_, __) => false,
          view: buildView,
          effect: buildEffect(),
          dependencies: Dependencies<DiscoveryRowCellsState>(
              adapter: null,
              slots: <String, Dependent<DiscoveryRowCellsState>>{}),
        );
}
