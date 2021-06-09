import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(
    CharactersState state, Dispatch dispatch, ViewService viewService) {
  final ListAdapter _adapter = viewService.buildAdapter();
  return Container(
    height: TaiyakiSize.height * 0.44,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
            padding: const EdgeInsets.fromLTRB(10.0, 12, 10.0, 8.0),
            child: Text(
              'Characters',
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: TaiyakiSize.height * 0.03),
            )),
        Expanded(
          child: ListView.builder(
            key: PageStorageKey(state.characters.first.name),
            scrollDirection: Axis.horizontal,
            cacheExtent: 10000,
            itemExtent: TaiyakiSize.height * 0.21,
            itemBuilder: _adapter.itemBuilder,
            itemCount: _adapter.itemCount,
            addAutomaticKeepAlives: true,
          ),
        )
      ],
    ),
  );
}
