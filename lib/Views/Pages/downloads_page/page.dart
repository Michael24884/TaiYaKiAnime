import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class DownloadsPage extends Page<DownloadsState, Map<String, dynamic>> {
  DownloadsPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<DownloadsState>(
              adapter: null, slots: <String, Dependent<DownloadsState>>{}),
          middleware: <Middleware<DownloadsState>>[],
        );
}
