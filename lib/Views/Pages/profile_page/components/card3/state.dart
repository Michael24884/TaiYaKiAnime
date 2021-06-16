import 'package:fish_redux/fish_redux.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../state.dart';

class Card3State implements Cloneable<Card3State> {
  List<DoughnutSeries<dynamic, String>> genreStats = [];

  @override
  Card3State clone() {
    return Card3State()..genreStats = genreStats;
  }
}

class Card3Connector extends ConnOp<ProfileState, Card3State> {
  @override
  Card3State get(ProfileState state) {
    final subState = Card3State().clone();

    subState.genreStats = [
      DoughnutSeries<dynamic, String>(
          radius: '105%',
          // enableSmartLabels: true,
          dataSource: state.anilistStats?.genres ?? [],
          xValueMapper: (x, _) => x.genreName,
          yValueMapper: (y, _) => y.genreCount,
          dataLabelMapper: (z, _) => '${z.genreName}',
          enableTooltip: true,
          dataLabelSettings: DataLabelSettings(
              showZeroValue: false,
              isVisible: true,
              labelPosition: ChartDataLabelPosition.outside))
    ];

    return subState;
  }
}
