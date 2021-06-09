import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    CharacterCellsState state, Dispatch dispatch, ViewService viewService) {
  return Container(
    width: TaiyakiSize.height * 0.17,
    margin: const EdgeInsets.symmetric(horizontal: 9.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TaiyakiImage(
          url: state.image,
          height: TaiyakiSize.height * 0.25,
          width: TaiyakiSize.height * 0.18,
        ),
        Text(state.role ?? '???'),
        Text(
          state.name!,
          maxLines: 2,
        )
      ],
    ),
  );
}
