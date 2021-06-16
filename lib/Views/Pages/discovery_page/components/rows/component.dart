import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/rows/adapter.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class RowsComponent extends Component<RowsState> {
  RowsComponent()
      : super(
          reducer: buildReducer(),
          view: buildView,
          // clearOnDependenciesChanged: false,
          // shouldUpdate: (o, n) => o.itemCount != n.itemCount,
          dependencies: Dependencies<RowsState>(
              adapter: NoneConn<RowsState>() + RowsAdapter(),
              slots: <String, Dependent<RowsState>>{}),
        );
}
