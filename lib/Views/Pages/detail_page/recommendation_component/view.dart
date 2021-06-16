import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    RecommendationState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();
  if (_adapter.itemCount == 0)
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.add_box,
            size: 75,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: Text(
              'No recommendations yet',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
            ),
          )
        ],
      ),
    );
  return GridView.builder(
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, childAspectRatio: 16 / 30),
    itemBuilder: _adapter.itemBuilder,
    itemCount: _adapter.itemCount,
  );
}
