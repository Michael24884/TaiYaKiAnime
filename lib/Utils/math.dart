String percentageRemaining(int? totalEpisodes, int currentEpisode,
    {bool isValue = false}) {
  if (totalEpisodes == null) return '??';
  double _count = ((currentEpisode / totalEpisodes));
  if (isValue != true) _count = (_count * 100);
  return '${_count.toStringAsFixed(1)}';
}
