import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/detail_page/watch_component/episode_cells/component.dart';

import 'state.dart';

class WatchComponentAdapter extends SourceFlowAdapter<WatchState> {
  WatchComponentAdapter()
      : super(pool: <String, Component<Object>>{
          'episode_cells': EpisodeCellComponent(),
        });
}
