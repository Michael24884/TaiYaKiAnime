class AnimeListModel {
  final String title, coverImage, status;
  final int id, progress;
  final double score;
  final int? totalEpisodes;

  AnimeListModel(
      {required this.title,
      required this.status,
      this.progress = 0,
      this.totalEpisodes,
      required this.coverImage,
      required this.id,
      this.score = 0});
}

class SyncModel {
  final String? status;
  final int? progress;
  final int? score;
  final int? episodes;

  SyncModel(
      {String? status, this.episodes = 0, required this.progress, this.score})
      : this.status = _convertToString(status ?? 'Not in List');

  SyncModel copyWith({
    String? status,
    int? progress,
    score,
    episodes,
  }) =>
      SyncModel(
          progress: progress ?? this.progress,
          score: score ?? this.score,
          status: status ?? this.status,
          episodes: episodes ?? this.episodes);

  SyncModel toAnilist() {
    return SyncModel(
      progress: this.progress,
      status: convertToAnilist(this.status),
      episodes: null,
      score: this.score,
    );
  }

  static String convertToMAL(String? status) {
    if (status == 'Watching')
      return 'watching';
    else if (status == 'Plan to Watch')
      return 'plan_to_watch';
    else if (status == 'On Hold')
      return 'on_hold';
    else if (status == 'Completed')
      return 'completed';
    else if (status == 'Dropped')
      return 'dropped';
    else
      return status!;
  }

  static String convertToAnilist(String? status) {
    if (status == 'Watching')
      return 'CURRENT';
    else if (status == 'Plan to Watch')
      return 'PLANNING';
    else if (status == 'On Hold')
      return 'PAUSED';
    else if (status == 'Completed')
      return 'COMPLETED';
    else if (status == 'Dropped')
      return 'DROPPED';
    else
      return status!;
  }

  static String _convertToString(String status) {
    switch (status) {
      case 'Watching':
      case 'watching':
      case 'CURRENT':
        return 'Watching';

      case 'Plan to Watch':
      case 'plan_to_watch':
      case 'PLANNING':
        return 'Plan to Watch';

      case 'On Hold':
      case 'on_hold':
      case 'PAUSED':
        return 'On Hold';

      case 'Completed':
      case 'completed':
      case 'COMPLETED':
        return 'Completed';

      case 'Dropped':
      case 'dropped':
      case 'DROPPED':
        return 'Dropped';

      default:
        return 'Not in List';
    }
  }
}
