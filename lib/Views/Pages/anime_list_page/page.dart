import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';

import 'adapter.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class AnimeListPageArguments {
  final ThirdPartyTrackersEnum tracker;
  final List<AnimeListModel> list;
  AnimeListPageArguments({required this.tracker, required this.list});
}

class AnimeListPage extends Page<AnimeListState, AnimeListPageArguments> {
  AnimeListPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<AnimeListState>(
              adapter: NoneConn<AnimeListState>() + AnimeListAdapter(),
              slots: <String, Dependent<AnimeListState>>{}),
          middleware: <Middleware<AnimeListState>>[],
        );
}
