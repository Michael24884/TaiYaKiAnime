import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/follower_cards/state.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/rows/component.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/rows/state.dart';

import 'components/follower_cards/component.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class DiscoveryPage extends Page<DiscoveryState, Map<String, dynamic>> {
  DiscoveryPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<DiscoveryState>(
              adapter: null,
              slots: <String, Dependent<DiscoveryState>>{
                'trending_slot': TrendingRowsConnector() + RowsComponent(),
                'popular_slot': PopularRowsConnector() + RowsComponent(),
                'activity_slot':
                    FollowersCardsConnector() + FollowerCardsComponent(),
                'seasonal_slot': SeasonalRowsConnector() + RowsComponent(),
                'next_season_slot': NextSeasonRowsConnector() + RowsComponent(),
                'just_added_slot': JustAddedRowsConnector() + RowsComponent(),
              }),
          middleware: <Middleware<DiscoveryState>>[],
        );
}
