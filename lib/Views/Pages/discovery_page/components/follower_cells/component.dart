import 'package:fish_redux/fish_redux.dart';

import 'state.dart';
import 'view.dart';

class FollowersCellsComponent extends Component<FollowersCellsState> {
  FollowersCellsComponent()
      : super(
          view: buildView,
          dependencies: Dependencies<FollowersCellsState>(
              adapter: null, slots: <String, Dependent<FollowersCellsState>>{}),
        );
}
