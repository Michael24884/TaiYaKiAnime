import 'dart:io';

import 'package:background_fetch/background_fetch.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Services/Sources/index.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/discovery_page/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiNotificationHandler.dart';

class BackgroundTasks {
  static void backgroundFetchHeadlessTask(HeadlessTask task) async {
    void registerCheck() {
      if (Hive.isAdapterRegistered(1) == false)
        Hive.registerAdapter(DetailDatabaseModelAdapter());
      if (Hive.isAdapterRegistered(2) == false)
        Hive.registerAdapter(LastWatchingModelAdapter());
      if (Hive.isAdapterRegistered(3) == false)
        Hive.registerAdapter(ThirdPartyBundleIdsAdapter());
      if (Hive.isAdapterRegistered(4) == false)
        Hive.registerAdapter(HistoryModelAdapter());
      if (Hive.isAdapterRegistered(5) == false)
        Hive.registerAdapter(SimklEpisodeModelAdapter());
      if (Hive.isAdapterRegistered(6) == false)
        Hive.registerAdapter(IndividualSettingsModelAdapter());
    }

    String taskId = task.taskId;
    bool isTimeout = task.timeout;
    if (isTimeout) {
      // This task has exceeded its allowed running-time.
      // You must stop what you're doing and immediately .finish(taskId)
      print("[BackgroundFetch] Headless task timed-out: $taskId");
      BackgroundFetch.finish(taskId);
      Hive.close();
      return;
    }
    print('[BackgroundFetch] Headless event received.');

    Hive.initFlutter().then((value) {
      registerCheck();
      Hive.openBox<DetailDatabaseModel>(HIVE_DETAIL_BOX).whenComplete(() =>
          BackgroundTasks()
              ._fetchForNewEpisodes(taskId)
              .whenComplete(() => Hive.close()));
    });
    Hive.close();
    BackgroundFetch.finish(taskId);
  }

  Future<String> _downloadAndSaveFile(String url, String fileName) async {
    final Directory directory = await getApplicationDocumentsDirectory();
    final String filePath = '${directory.path}/$fileName';
    final http.Response response = await http.get(Uri.parse(url));
    final File file = File(filePath);
    await file.writeAsBytes(response.bodyBytes);
    return filePath;
  }

  static Future<void> init() async {
    BackgroundFetch.registerHeadlessTask(
        BackgroundTasks.backgroundFetchHeadlessTask);
    final BackgroundFetchConfig _config = BackgroundFetchConfig(
      minimumFetchInterval: 60,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    );
    await BackgroundFetch.configure(
        _config, BackgroundTasks()._fetchForNewEpisodes);
  }

  Future<void> _fetchForNewEpisodes(String taskID) async {
    final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX)
        .values
        .where((element) => (element.isFollowing ?? false) == true);

    for (var episodes in _box) {
      debugPrint(
          'Looking for new episodes: ${episodes.title}, has: ${episodes.episodeCount} episodes');
      final int _count = await nameToSourceBase(episodes.sourceName!)
          .getTotalEpisodesAvailable(episodes.link!);

      if ((episodes.episodeCount ?? 0) < _count) {
        print('new episode for: ${episodes.title}, found: $_count');
        final bigPicture = await _downloadAndSaveFile(
            episodes.coverImage, '${episodes.title}_big_picture.jpg');
        final BigPictureStyleInformation _bigPictureStyleInformation =
            BigPictureStyleInformation(
          FilePathAndroidBitmap(bigPicture),
          hideExpandedLargeIcon: true,
          contentTitle: episodes.title,
          summaryText:
              'Episode $_count is ready to watch on ${episodes.sourceName}',
        );

        NotificationHandler.showNotification(
            NotificationData(
                message:
                    'Episode $_count is ready to watch on ${episodes.sourceName}',
                title: episodes.title,
                animeID: episodes.ids.anilist),
            _bigPictureStyleInformation,
            attachement: IOSNotificationAttachment(bigPicture));

        episodes = episodes.copyWith(episodeCount: _count, notification: true);
        Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX)
            .put(episodes.ids.anilist, episodes);
      }
    }

    BackgroundFetch.finish(taskID);
  }
}
