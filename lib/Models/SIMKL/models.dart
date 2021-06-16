import 'package:hive/hive.dart';
import 'package:taiyaki/Utils/strings.dart';

part 'models.g.dart';

class SimklNode {
  final String? fanart;

  SimklNode({required this.fanart});

  factory SimklNode.fromJson(Map<String, dynamic> json) => SimklNode(
      fanart: json['fanart'] != null
          ? simklThumbnailGen(json['fanart'], isFanArt: true)
          : null);
}

class SimklUserModel {
  final String name;
  final String? avatar;
  final int id;

  SimklUserModel({required this.name, this.avatar, required this.id});

  factory SimklUserModel.fromJson(Map<String, dynamic> json) => SimklUserModel(
      name: json['user']['name'],
      id: json['account']['id'],
      avatar: json['user']['avatar'] != null ? json['user']['avatar'] : null);
}

class SimklIDLookupModel {
  final int? simklID;

  SimklIDLookupModel({this.simklID});

  factory SimklIDLookupModel.fromJson(Map<String, dynamic> json) =>
      SimklIDLookupModel(simklID: json['ids']['simkl']);
}

@HiveType(typeId: 5)
class SimklEpisodeModel {
  @HiveField(0)
  String title;
  @HiveField(1)
  String? thumbnail;
  @HiveField(2)
  String? link;
  @HiveField(3)
  String? description;
  @HiveField(4)
  bool isFiller;
  @HiveField(5)
  int episode;

  SimklEpisodeModel(
      {required this.title,
      this.thumbnail,
      required this.episode,
      this.link,
      this.description,
      this.isFiller = false});

  factory SimklEpisodeModel.fromJson(Map<String, dynamic> json) =>
      SimklEpisodeModel(
          title: json['title'],
          thumbnail: json['img'],
          episode: json['episode'],
          description: json['description']);

  SimklEpisodeModel copyWith(
          {String? title,
          String? thumbnail,
          String? link,
          String? description,
          int? episode,
          bool? isFiller}) =>
      SimklEpisodeModel(
          title: title ?? this.title,
          episode: episode ?? this.episode,
          thumbnail: thumbnail ?? this.thumbnail,
          link: link ?? this.link,
          description: description ?? this.description,
          isFiller: isFiller ?? this.isFiller);
}

class SimklUserListModel {
  final int score, progress, totalEpisodes;
  final String status;
  final _SimklShow show;

  SimklUserListModel(
      {required this.score,
      required this.progress,
      required this.totalEpisodes,
      required this.status,
      required this.show});
  factory SimklUserListModel.fromJson(Map<String, dynamic> json) =>
      SimklUserListModel(
          score: json['user_rating'],
          totalEpisodes: json['total_episodes_count'],
          progress: json['watched_episodes_count'],
          status: json['status'],
          show: _SimklShow.fromJson(json['show']));
}

class _SimklShow {
  final String title, poster;
  final _SimklIDS ids;

  _SimklShow(this.title, this.poster, this.ids);

  factory _SimklShow.fromJson(Map<String, dynamic> json) => _SimklShow(
      json['title'], json['poster'], _SimklIDS.fromJson(json['ids']));
}

class _SimklIDS {
  final int id;
  final String mal;

  _SimklIDS({required this.id, required this.mal});

  factory _SimklIDS.fromJson(Map<String, dynamic> json) =>
      _SimklIDS(id: json['simkl'], mal: json['mal']);
}
