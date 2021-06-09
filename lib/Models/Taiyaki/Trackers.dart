import 'package:hive/hive.dart';

part 'Trackers.g.dart';

enum ThirdPartyTrackersEnum {
  myanimelist,
  anilist,
  simkl,
}

enum ThirdPartyStatus {
  watching,
  planning,
  completed,
  hold,
  dropped,
}

@HiveType(typeId: 3)
class ThirdPartyBundleIds {
  @HiveField(0)
  int anilist;
  @HiveField(1)
  int myanimelist;
  @HiveField(2)
  int? simkl;

  ThirdPartyBundleIds(
      {required this.anilist, required this.myanimelist, this.simkl});
}

class ThirdPartyListModel {
  final String title;
  final String coverImage;
  final int id;
  final ThirdPartyTrackersEnum tracker;

  final int progress;
  final ThirdPartyStatus status;
  final int? score;

  ThirdPartyListModel(
      {required this.coverImage,
      required this.title,
      required this.id,
      required this.tracker,
      required this.progress,
      required this.status,
      this.score});
}
