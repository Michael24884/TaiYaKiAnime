import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import 'state.dart';

Widget buildView(Card3State state, Dispatch dispatch, ViewService viewService) {
  return Container(
      margin: const EdgeInsets.all(8.0),
      child: Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text('Stats',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            ),
            SfCircularChart(
              series: state.genreStats,
              tooltipBehavior: TooltipBehavior(enable: true),
              legend: Legend(
                  isVisible: true,
                  overflowMode: LegendItemOverflowMode.wrap,
                  position: LegendPosition.bottom),
            )
          ],
        ),
      ));
}
