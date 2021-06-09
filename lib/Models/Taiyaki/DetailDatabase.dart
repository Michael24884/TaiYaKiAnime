import 'package:hive/hive.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';

part 'DetailDatabase.g.dart';

@HiveType(typeId: 1)
class DetailDatabaseModel {
  @HiveField(0)
  final String title;
  @HiveField(1)
  final String coverImage;
  @HiveField(2)
  final String? link;
  @HiveField(3)
  final ThirdPartyBundleIds ids;
  @HiveField(4)
  LastWatchingModel? lastWatchingModel;
  @HiveField(5)
  final DateTime? createdAt;
  @HiveField(6)
  Map<int, double>? episodeProgress;
  @HiveField(13)
  Map<int, int>? seekTo;
  @HiveField(7)
  final String? sourceName;
  @HiveField(8)
  final bool? isFollowing;
  @HiveField(9)
  final int? episodeCount;
  @HiveField(10)
  final int? totalEpisodes;
  @HiveField(11)
  final IndividualSettingsModel? individualSettingsModel;
  @HiveField(12)
  final bool? notification;

  DetailDatabaseModel copyWith(
          {String? title,
          String? coverImage,
          ThirdPartyBundleIds? ids,
          bool? notification,
          Map<int, int>? seekTo,
          String? link,
          int? totalEpisodes,
          String? sourceName,
          bool? isFollowing,
          Map<int, double>? episodeProgress,
          int? episodeCount,
          LastWatchingModel? lastWatchingModel,
          IndividualSettingsModel? individualSettingsModel,
          DateTime? createdAt}) =>
      DetailDatabaseModel(
          title: title ?? this.title,
          coverImage: coverImage ?? this.coverImage,
          ids: ids ?? this.ids,
          totalEpisodes: totalEpisodes ?? this.totalEpisodes,
          sourceName: sourceName ?? this.sourceName,
          isFollowing: isFollowing ?? this.isFollowing,
          link: link ?? this.link,
          episodeCount: episodeCount ?? this.episodeCount,
          episodeProgress: episodeProgress ?? this.episodeProgress,
          lastWatchingModel: lastWatchingModel ?? this.lastWatchingModel,
          notification: notification ?? this.notification,
          individualSettingsModel:
              individualSettingsModel ?? this.individualSettingsModel,
          seekTo: seekTo ?? this.seekTo,
          createdAt: createdAt ?? this.createdAt);

  DetailDatabaseModel(
      {required this.title,
      this.isFollowing,
      this.notification = false,
      this.sourceName,
      this.individualSettingsModel,
      required this.coverImage,
      this.episodeProgress = const {0: 0},
      required this.ids,
      this.lastWatchingModel,
      this.episodeCount,
      this.totalEpisodes,
      this.seekTo = const {0: 0},
      this.link,
      this.createdAt});
}

@HiveType(typeId: 2)
class LastWatchingModel {
  @HiveField(0)
  SimklEpisodeModel watchingEpisode;
  @HiveField(1)
  final double progress;
  LastWatchingModel({required this.watchingEpisode, required this.progress});
}

@HiveType(typeId: 4)
class HistoryModel {
  @HiveField(0)
  final String title;
  @HiveField(1)
  final String coverImage;
  @HiveField(2)
  final String sourceName;
  @HiveField(3)
  final int id;
  @HiveField(4)
  final DateTime lastModified;

  HistoryModel(
      {required this.title,
      required this.coverImage,
      required this.sourceName,
      required this.id,
      required this.lastModified});
}

@HiveType(typeId: 6)
class IndividualSettingsModel {
  @HiveField(0)
  final bool autoSync;

  IndividualSettingsModel({required this.autoSync});

  IndividualSettingsModel copyWith({bool? autoSync}) =>
      IndividualSettingsModel(autoSync: autoSync ?? this.autoSync);
}
