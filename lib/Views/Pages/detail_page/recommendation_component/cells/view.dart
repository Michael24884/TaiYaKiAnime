import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/cells/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(RecommendationCellsState state, Dispatch dispatch,
    ViewService viewService) {
  return GestureDetector(
    onTap: () => dispatch(RecommendationCellsActionCreator.onAction()),
    child: Container(
      margin: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TaiyakiImage(
            url: state.media!.coverImage,
            height: TaiyakiSize.height * 0.22,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 3.0),
            child: Text(
              state.media!.title,
              maxLines: 3,
              style: TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    ),
  );
}
