import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(RowsState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();
  final TextStyle title = TextStyle(
      fontWeight: FontWeight.w600, fontSize: TaiyakiSize.height * 0.03);
  return Container(
    height: TaiyakiSize.height * 0.42,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                state.rowTitle,
                style: title,
              ),
              Text(state.subTitle),
            ],
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: state.data.isEmpty
                ? Center(
                    child: const CircularProgressIndicator(),
                  )
                : ListView.builder(
                    cacheExtent: 10000,
                    itemExtent: TaiyakiSize.height * 0.21,
                    key: PageStorageKey(state.rowTitle),
                    scrollDirection: Axis.horizontal,
                    itemBuilder: _adapter.itemBuilder,
                    itemCount: _adapter.itemCount,
                    addAutomaticKeepAlives: true,
                  ),
          ),
        )
      ],
    ),
  );
}
