import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';

import 'state.dart';

Widget buildView(
    DownloadsState state, Dispatch dispatch, ViewService viewService) {
  return Center(
    child: Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.update, size: 75),
          Text('Coming soon..'),
        ],
      ),
    ),
  );
}
