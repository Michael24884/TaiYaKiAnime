import 'package:fish_redux/fish_redux.dart';

import 'adapter.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class HistoryPage extends Page<HistoryState, Map<String, dynamic>> {
  HistoryPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<HistoryState>(
              adapter: NoneConn<HistoryState>() + HistoryAdapter(),
              slots: <String, Dependent<HistoryState>>{}),
          middleware: <Middleware<HistoryState>>[],
        );
}
