import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/detail_page/overview_component/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/state.dart';
import 'package:taiyaki/Views/Pages/detail_page/stats_component/state.dart';
import 'package:taiyaki/Views/Pages/detail_page/sync_component/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/sync_component/state.dart';
import 'package:taiyaki/Views/Pages/detail_page/watch_component/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/watch_component/state.dart';

import 'effect.dart';
import 'overview_component/state.dart';
import 'reducer.dart';
import 'state.dart';
import 'stats_component/component.dart';
import 'view.dart';

class DetailPageArguments {
  final int id;
  final bool isMal;

  DetailPageArguments({required this.id, this.isMal = false});
}

class DetailPage extends Page<DetailState, DetailPageArguments>
    with TickerProviderMixin {
  DetailPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<DetailState>(
              adapter: null,
              slots: <String, Dependent<DetailState>>{
                'overview_tab': OverviewConnector() + OverviewComponent(),
                'sync_tab': SyncConnector() + SyncComponent(),
                'watch_tab': WatchTabConnector() + WatchComponent(),
                'stats_tab': StatsConnector() + StatsComponent(),
                'recommendation_tab':
                    RecommendationConnector() + RecommendationComponent(),
              }),
          middleware: <Middleware<DetailState>>[],
        );
}
