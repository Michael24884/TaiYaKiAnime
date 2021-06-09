import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/tiles.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    SearchCellsState state, Dispatch dispatch, ViewService viewService) {
  return Tiles(
    image: state.media!.coverImage,
    title: state.media!.title,
    onTap: () => dispatch(SearchCellsActionCreator.onAction()),
  );
}
