import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/history_page/components/history_cells/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    HistoryCellsState state, Dispatch dispatch, ViewService viewService) {
  return GestureDetector(
    onTap: () => dispatch(HistoryCellsActionCreator.onAction()),
    child: Card(
      clipBehavior: Clip.antiAlias,
      child: Container(
          height: TaiyakiSize.height * 0.17,
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            TaiyakiImage(
              url: state.historyModel?.coverImage,
              width: TaiyakiSize.height * 0.12,
            ),
            Expanded(
                child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    state.historyModel!.title,
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                    maxLines: 2,
                  ),
                  Row(children: [
                    Text(state.historyModel!.sourceName,
                        style: TextStyle(
                            fontWeight: FontWeight.w200, fontSize: 13)),
                    // Text(/),
                  ])
                ],
              ),
            ))
          ])),
    ),
  );
}
