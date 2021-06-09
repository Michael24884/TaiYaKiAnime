class AnilistNode {
  final String title;
  final String coverImage;
  final int id;
  final int idMal;

  late String? englishTitle;
  late String? bannerImage;
  late String? description;
  late List<String>? genres;

  late MediaListEntryModel? mediaListEntryModel;

  late int? meanScore;
  late String? status;
  late String? source;
  late int? duration;
  late String? type, hashtag, countryOfOrigin, season;
  late AnilistNextAiringEpisodeModel? nextAiringEpisode;
  late int? episodes, seasonYear;
  late List<AnilistCharactersModel> characters;

  late List<AnilistScoreDistributionModel> scoreDistribution;
  late List<AnilistStatusDistributionModel> statusDistribution;

  late List<AnilistTrendsModel> trends;

  late List<AnilistNode> recommendations;

  AnilistNode({
    required this.title,
    required this.coverImage,
    required this.id,
    this.bannerImage,
    this.trends = const [],
    this.description,
    this.englishTitle,
    this.genres,
    this.duration,
    this.meanScore,
    this.source,
    this.status,
    this.idMal = 0,
    this.type,
    this.countryOfOrigin,
    this.hashtag,
    this.season,
    this.seasonYear,
    this.scoreDistribution = const [],
    this.statusDistribution = const [],
    this.episodes = 0,
    this.nextAiringEpisode,
    this.mediaListEntryModel,
    this.characters = const [],
    this.recommendations = const [],
  });

  factory AnilistNode.fromJson(Map<String, dynamic> json) => AnilistNode(
      title: json['title']['romaji'],
      coverImage: json['coverImage']['extraLarge'],
      idMal: json['idMal'],
      id: json['id'],
      bannerImage: json['bannerImage'],
      description: json['description'],
      englishTitle: json['title']['english'],
      genres: json['genres'] != null ? List<String>.from(json['genres']) : [],
      duration: json['duration'] != null ? json['duration'] : null,
      meanScore: json['meanScore'] != null ? json['meanScore'] : null,
      source: json['source'] != null ? json['source'] : 'N/A',
      status: json['status'] != null ? json['status'] : 'N/A',
      episodes: json['episodes'] != null ? json['episodes'] : null,
      countryOfOrigin:
          json['countryOfOrigin'] != null ? json['countryOfOrigin'] : null,
      hashtag: json['hashtag'] != null ? json['hashtag'] : null,
      season: json['season'] != null ? json['season'] : null,
      seasonYear: json['seasonYear'] != null ? json['seasonYear'] : null,
      nextAiringEpisode: json['nextAiringEpisode'] != null
          ? AnilistNextAiringEpisodeModel.fromJson(json['nextAiringEpisode'])
          : null,
      characters: json['characters'] != null
          ? List<AnilistCharactersModel>.from(json['characters']['edges']
              .map((i) => AnilistCharactersModel.fromJson(i))
              .toList())
          : [],
      recommendations: json['recommendations'] != null
          ? List<AnilistNode>.from(json['recommendations']['nodes']
              .map((i) => AnilistNode(
                  title: i['mediaRecommendation']['title']['romaji'],
                  coverImage: i['mediaRecommendation']['coverImage']
                      ['extraLarge'],
                  id: i['mediaRecommendation']['id']))
              .toList())
          : [],
      mediaListEntryModel: json['mediaListEntry'] != null
          ? MediaListEntryModel.fromJson(json['mediaListEntry'])
          : null,
      scoreDistribution: (json['stats'] != null && json['stats']['scoreDistribution'] != null)
          ? List<AnilistScoreDistributionModel>.from(json['stats']['scoreDistribution']
              .map((i) => AnilistScoreDistributionModel.fromJson(i))
              .toList())
          : [],
      statusDistribution:
          (json['stats'] != null && json['stats']['statusDistribution'] != null)
              ? List<AnilistStatusDistributionModel>.from(json['stats']['statusDistribution'].map((i) => AnilistStatusDistributionModel.fromJson(i)).toList())
              : [],
      trends: json['trends'] != null ? List<AnilistTrendsModel>.from(json['trends']['nodes'].map((i) => AnilistTrendsModel.fromJson(i)).toList()) : [],
      type: json['type'] != null ? json['type'] : 'N/A');
}

class AnilistCharactersModel {
  final String name;
  final String role;
  final String image;
  final int id;

  AnilistCharactersModel(
      {required this.id,
      required this.name,
      required this.image,
      required this.role});

  factory AnilistCharactersModel.fromJson(Map<String, dynamic> json) =>
      AnilistCharactersModel(
          id: json['node']['id'],
          name: json['node']['name']['full'],
          image: json['node']['image']['large'],
          role: json['role']);
}

class AnilistViewerModel {
  final String name;
  final String avatar;
  final int id;
  final String? bannerImage;

  AnilistViewerModel(
      {required this.name,
      required this.avatar,
      this.bannerImage,
      required this.id});

  factory AnilistViewerModel.fromJson(Map<String, dynamic> json) =>
      AnilistViewerModel(
          name: json['data']['Viewer']['name'],
          avatar: json['data']['Viewer']['avatar']['large'],
          bannerImage: json['data']['Viewer']['bannerImage'] != null
              ? json['data']['Viewer']['bannerImage']
              : null,
          id: json['data']['Viewer']['id']);
}

class MediaListEntryModel {
  final String? status;
  final int? score;
  final int? progress;

  MediaListEntryModel({this.status, this.score, this.progress});

  factory MediaListEntryModel.fromJson(Map<String, dynamic> json) =>
      MediaListEntryModel(
        status: json['status'] != null ? json['status'] : null,
        score: json['score'] != null ? json['score'] : null,
        progress: json['progress'] != null ? json['progress'] : null,
      );
}

class AnilistScoreDistributionModel {
  final int amount;
  final int score;

  AnilistScoreDistributionModel({required this.amount, required this.score});
  factory AnilistScoreDistributionModel.fromJson(Map<String, dynamic> json) =>
      AnilistScoreDistributionModel(
          amount: json['amount'], score: json['score']);
}

class AnilistStatusDistributionModel {
  final int amount;
  final String status;
  AnilistStatusDistributionModel({required this.amount, required this.status});
  factory AnilistStatusDistributionModel.fromJson(Map<String, dynamic> json) =>
      AnilistStatusDistributionModel(
          status: json['status'], amount: json['amount']);
}

class AnilistTrendsModel {
  final int? episode;
  final int? popularity;
  final int? averageScore;

  AnilistTrendsModel({this.averageScore, this.episode, this.popularity});

  factory AnilistTrendsModel.fromJson(Map<String, dynamic> json) =>
      AnilistTrendsModel(
        episode: json['episode'],
        popularity: json['popularity'],
        averageScore: json['averageScore'],
      );
}

class AnilistNextAiringEpisodeModel {
  final int episode;
  final int? timeUntilAiring;

  AnilistNextAiringEpisodeModel({required this.episode, this.timeUntilAiring});

  factory AnilistNextAiringEpisodeModel.fromJson(Map<String, dynamic> json) =>
      AnilistNextAiringEpisodeModel(
          episode: json['episode'],
          timeUntilAiring:
              json['timeUntilAiring'] != null ? json['timeUntilAiring'] : null);
}

class AnilistFollowersActivityModel {
  final AnilistUserModel user;
  final String status;
  final String progress;
  final int createdAt;

  final AnilistNode media;

  AnilistFollowersActivityModel(
      {required this.status,
      required this.media,
      required this.createdAt,
      required this.progress,
      required this.user});
  factory AnilistFollowersActivityModel.fromJson(Map<String, dynamic> json) =>
      AnilistFollowersActivityModel(
          status: json['status'],
          createdAt: json['createdAt'],
          progress: json['progress'],
          user: AnilistUserModel.fromJson(json['user']),
          media: AnilistNode.fromJson(json['media']));
}

class AnilistUserModel {
  final int id;
  final String name;
  final String avatar;

  AnilistUserModel(
      {required this.id, required this.name, required this.avatar});
  factory AnilistUserModel.fromJson(Map<String, dynamic> json) =>
      AnilistUserModel(
          id: json['id'], name: json['name'], avatar: json['avatar']['large']);
}

class AnilistAnimeListModel {
  final List<AnilistNode> entries;
  AnilistAnimeListModel({required this.entries});
  factory AnilistAnimeListModel.fromJson(Map<String, dynamic> json) =>
      AnilistAnimeListModel(
          entries: List<AnilistNode>.from((json['lists'] as List)
              .expand((element) => element['entries'])
              .map((e) {
        return AnilistNode.fromJson(e['media']);
      }).toList()));
}

class _GenreCounts {
  final String genreName;
  final int genreCount;
  _GenreCounts({required this.genreCount, required this.genreName});
  factory _GenreCounts.fromJson(Map<String, dynamic> json) =>
      _GenreCounts(genreCount: json['count'], genreName: json['genre']);
}

class AnilistViewerStats {
  final List<_GenreCounts> genres;
  final int count;
  final int episodesWatched;
  AnilistViewerStats(
      {this.genres = const [],
      required this.count,
      required this.episodesWatched});
  factory AnilistViewerStats.fromJson(Map<String, dynamic> json) =>
      AnilistViewerStats(
          count: json['count'],
          episodesWatched: json['episodesWatched'],
          genres: List<_GenreCounts>.from(
              json['genres'].map((e) => _GenreCounts.fromJson(e)).toList()));
}
