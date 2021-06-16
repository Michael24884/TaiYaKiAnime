import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';

import 'state.dart';

Widget buildView(
    SettingsState state, Dispatch dispatch, ViewService viewService) {
  return DefaultTabController(
    length: state.tabs.length,
    child: Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
        bottom: TabBar(
          isScrollable: true,
          tabs: state.tabs,
        ),
      ),
      body: TabBarView(
        children: [
          viewService.buildComponent('general'),
          viewService.buildComponent('customization'),
          viewService.buildComponent('notification'),
          viewService.buildComponent('trackers'),
        ],
      ),
    ),
  );
}
