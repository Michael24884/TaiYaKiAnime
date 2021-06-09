import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(QueueState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();

  return state.queueList.isNotEmpty
      ? Padding(
          padding: EdgeInsets.only(top: TaiyakiSize.height * 0.05),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Playlist',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
              ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                itemExtent: TaiyakiSize.height * 0.17,
                itemBuilder: _adapter.itemBuilder,
                itemCount: _adapter.itemCount,
                shrinkWrap: true,
              ),
            ],
          ),
        )
      : const SizedBox();
}
