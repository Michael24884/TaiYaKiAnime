import 'package:auto_size_text/auto_size_text.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/cells/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    DiscoveryRowCellsState state, Dispatch dispatch, ViewService viewService) {
  return GestureDetector(
    onTap: () => dispatch(DiscoveryRowCellsActionCreator.onAction()),
    child: Container(
      width: TaiyakiSize.height * 0.19,
      margin: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TaiyakiImage(
            url: state.coverImage,
            height: TaiyakiSize.height * 0.28,
            width: TaiyakiSize.height * 0.19,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 6.0),
            child: AutoSizeText(
              state.title,
              minFontSize: 12,
              style: TextStyle(fontWeight: FontWeight.w500),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          )
        ],
      ),
    ),
  );
}
