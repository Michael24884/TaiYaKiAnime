import 'package:auto_size_text/auto_size_text.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/cells/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    DiscoveryRowCellsState state, Dispatch dispatch, ViewService viewService) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 4.0),
    child: Stack(
      children: [
        Positioned.fill(
          child: Card(
            margin: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Flexible(
                  fit: FlexFit.loose,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: TaiyakiImage(
                      url: state.coverImage,
                      height: double.infinity,
                      width: double.infinity,
                    ),
                  ),
                ),
                Container(
                  height: 50,
                  padding: EdgeInsets.symmetric(
                    horizontal: 8.0,
                    vertical: 6.0,
                  ),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: AutoSizeText(
                      state.title,
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        Positioned.fill(
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(8),
              onTap: () => dispatch(
                DiscoveryRowCellsActionCreator.onAction(),
              ),
            ),
          ),
        )
      ],
    ),
  );
}
