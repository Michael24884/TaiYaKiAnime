import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/settings_page/action.dart';

import 'state.dart';

Widget buildView(
    GeneralComponentState state, Dispatch dispatch, ViewService viewService) {
  final _settings = state.appSettingsModel!;

  return Scaffold(
    body: ListView(
      children: [
        SwitchListTile.adaptive(
          title: Text('Blur spoilers'),
          secondary: Icon(Icons.blur_circular),
          subtitle: Text('Blur out unwatched episodes'),
          value: _settings.blurSpoilers,
          onChanged: (val) {
            print('the value ${val}');
            return dispatch(SettingsActionCreator.onUpdateSetting(
                _settings.copyWith(blurSpoilers: val)));
          },
        ),
        SwitchListTile.adaptive(
          title: Text('Auto play next episode'),
          value: _settings.autoChange100,
          onChanged: (val) => dispatch(SettingsActionCreator.onUpdateSetting(
              _settings.copyWith(autoChange100: val))),
          secondary: Icon(Icons.queue_play_next),
          subtitle:
              Text('Change to the next episode when the current one finishes'),
        ),
      ],
    ),
  );
}
