import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(StatsState state, Dispatch dispatch, ViewService viewService) {
  final TextStyle _title = TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w800,
      color: Theme.of(viewService.context).textTheme.bodyText1!.color);

  return ListView(
    children: [
      if (state.scoreDistribution.first.dataSource.isNotEmpty)
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: SizedBox(
            height: TaiyakiSize.height * 0.3,
            child: Card(
              child: SfCartesianChart(
                  title: ChartTitle(
                    text: 'Score Distribution',
                    textStyle: _title,
                  ),
                  plotAreaBorderWidth: 0,
                  series: state.scoreDistribution,
                  primaryXAxis: CategoryAxis(
                      majorTickLines: MajorTickLines(width: 0),
                      axisLine: AxisLine(width: 0),
                      majorGridLines: MajorGridLines(width: 0)),
                  primaryYAxis: NumericAxis(
                      isVisible: false,
                      axisLine: AxisLine(width: 0),
                      majorTickLines: MajorTickLines(size: 0))),
            ),
          ),
        ),
      if (state.statusDistribution.first.dataSource!.isNotEmpty)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Card(
            child: SfCircularChart(
              title: ChartTitle(
                text: 'Status Distribution',
                textStyle: _title,
              ),
              series: state.statusDistribution,
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
              legend: Legend(
                  isVisible: true,
                  textStyle: TextStyle(
                      color: Theme.of(viewService.context)
                          .textTheme
                          .bodyText1!
                          .color)),
            ),
          ),
        ),
      Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: SizedBox(
            height: TaiyakiSize.height * 0.34,
            child: Card(
              child: state.trendsAverageScore.first.dataSource.length <= 1
                  ? Center(
                      child: Text('No trending average score data recorded'))
                  : SfCartesianChart(
                      series: state.trendsAverageScore,
                      title: ChartTitle(
                        text: 'Average score per episode',
                        textStyle: _title,
                      ),
                      primaryXAxis: CategoryAxis(
                          majorGridLines: MajorGridLines(width: 0)),
                      primaryYAxis: NumericAxis(
                        majorGridLines: MajorGridLines(
                          width: 0,
                        ),
                        autoScrollingMode: AutoScrollingMode.start,
                        axisLine: AxisLine(width: 1),
                      ),
                    ),
            ),
          )),
      Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: SizedBox(
            height: TaiyakiSize.height * 0.34,
            child: Card(
              child: state.trendsWatchers.first.dataSource.length <= 1
                  ? Center(child: Text('No trending data recorded'))
                  : SfCartesianChart(
                      series: state.trendsWatchers,
                      title: ChartTitle(
                        text: 'Amount of watchers per episode',
                        textStyle: _title,
                      ),
                      primaryXAxis: CategoryAxis(
                          majorGridLines: MajorGridLines(width: 0)),
                    ),
            ),
          )),
    ],
  );
}
