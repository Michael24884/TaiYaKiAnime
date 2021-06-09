import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:focus_detector/focus_detector.dart';
import 'package:taiyaki/Views/Pages/history_page/action.dart';
import 'package:taiyaki/Views/Widgets/platform_scaffold.dart';

import 'state.dart';

Widget buildView(
    HistoryState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();
  return PlatformScaffold(
    appBarTitle: 'History',
    actions: [
      if (state.historyItems.isNotEmpty)
        IconButton(
            icon: Icon(Icons.delete),
            onPressed: () => dispatch(HistoryActionCreator.deleteHistory()))
    ],
    child: FocusDetector(
      onFocusGained: () => dispatch(HistoryActionCreator.loadHistory()),
      child: Container(
          child: state.historyItems.isNotEmpty
              ? ListView.builder(
                  itemBuilder: _adapter.itemBuilder,
                  itemCount: _adapter.itemCount,
                )
              : Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.all_inbox, size: 75),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text('No history items recorded'),
                      )
                    ],
                  ),
                )),
    ),
  );
}
