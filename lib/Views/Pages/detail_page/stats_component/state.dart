import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Views/Pages/detail_page/state.dart';

class StatsState implements Cloneable<StatsState> {
  List<ColumnSeries<AnilistScoreDistributionModel, String>> scoreDistribution =
      [];

  List<DoughnutSeries<AnilistStatusDistributionModel, String>>
      statusDistribution = [];

  List<SplineSeries<AnilistTrendsModel, String>> trendsAverageScore = [];
  List<SplineSeries<AnilistTrendsModel, String>> trendsWatchers = [];

  @override
  StatsState clone() {
    return StatsState()
      ..scoreDistribution = scoreDistribution
      ..statusDistribution = statusDistribution
      ..trendsAverageScore = trendsAverageScore
      ..trendsWatchers = trendsWatchers;
  }
}

class StatsConnector extends ConnOp<DetailState, StatsState> {
  @override
  StatsState get(DetailState state) {
    final subState = StatsState().clone();

    final _scoreDistribution = state.anilistData!.scoreDistribution;
    final _statusDistribution = state.anilistData!.statusDistribution;
    final _trends = state.anilistData!.trends.reversed
        .where((element) => element.episode != null)
        .toList();

    subState.scoreDistribution = [
      ColumnSeries<AnilistScoreDistributionModel, String>(
          trackPadding: 13,
          borderRadius: BorderRadius.all(Radius.circular(24)),
          spacing: 1.75,
          dataSource: _scoreDistribution,
          xValueMapper: (AnilistScoreDistributionModel model, int _) =>
              model.score.toString(),
          yValueMapper: (model, _) => model.amount,
          pointColorMapper: (model, _) => _anilistColors(model.score),
          dataLabelSettings: DataLabelSettings(
              isVisible: true,
              textStyle: TextStyle(color: Colors.white, fontSize: 11),
              labelAlignment: ChartDataLabelAlignment.outer))
    ];

    subState.statusDistribution = [
      DoughnutSeries(
          radius: '100%',
          name: 'Status Distribution',
          dataSource: _statusDistribution,
          legendIconType: LegendIconType.circle,
          pointColorMapper: (AnilistStatusDistributionModel model, _) =>
              _anilistStatusMapper(model.status),
          xValueMapper: (AnilistStatusDistributionModel model, _) =>
              model.status,
          yValueMapper: (AnilistStatusDistributionModel model, _) =>
              model.amount),
    ];
    subState.trendsWatchers = [
      SplineSeries(
          dataSource: _trends,
          xValueMapper: (data, _) => data.episode.toString(),
          yValueMapper: (data, _) => data.popularity),
    ];
    subState.trendsAverageScore = [
      SplineSeries(
          dataSource: _trends,
          xValueMapper: (data, _) => data.episode.toString(),
          yValueMapper: (data, _) => data.averageScore),
    ];

    return subState;
  }
}

Color _anilistColors(int score) {
  switch (score) {
    case 10:
      return Color(0xffd2492d);
    case 20:
      return Color(0xffd3642c);
    case 30:
      return Color(0xffd2802a);
    case 40:
      return Color(0xffcd9c2c);
    case 50:
      return Color(0xffd1b82a);
    case 60:
      return Color(0xffd2d12c);
    case 70:
      return Color(0xffb7d22f);
    case 80:
      return Color(0xff9cd12d);
    case 90:
      return Color(0xff81d02c);
    case 100:
      return Color(0xff66d12f);
    default:
      return Color(0xff424141);
  }
}

Color _anilistStatusMapper(String status) {
  switch (status) {
    case 'COMPLETED':
      return Color(0xff67D639);
    case 'PLANNING':
      return Color(0xff01a9fe);
    case 'CURRENT':
      return Color(0xff9156f2);
    case 'PAUSED':
      return Color(0xfff879a4);
    case 'DROPPED':
      return Color(0xffe75d74);
    default:
      return Colors.grey;
  }
}
