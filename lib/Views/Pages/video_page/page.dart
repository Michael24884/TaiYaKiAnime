import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Views/Pages/video_page/components/queue_component/component.dart';
import 'package:taiyaki/Views/Pages/video_page/components/queue_component/state.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class VideoPageArguments {
  final DetailDatabaseModel databaseModel;
  final SimklEpisodeModel episode;
  final List<SimklEpisodeModel> playlist;
  VideoPageArguments(
      {required this.databaseModel,
      required this.episode,
      this.playlist = const []});
}

class VideoPage extends Page<VideoState, VideoPageArguments> {
  VideoPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<VideoState>(
              adapter: null,
              slots: <String, Dependent<VideoState>>{
                'queue_component': QueueListConnector() + QueueComponent(),
              }),
          middleware: <Middleware<VideoState>>[],
        );
}
