import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Services/API/MyAnimeList+API.dart';
import 'package:taiyaki/Services/API/SIMKL+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Pages/discovery_page/action.dart';
import 'package:taiyaki/Views/Pages/settings_page/action.dart';

import 'state.dart';

Widget buildView(
    SettingsTrackersState state, Dispatch dispatch, ViewService viewService) {
  return ListView(
    children: [
      SwitchListTile.adaptive(
        title: Text('Auto sync at 75%'),
        value: state.appSettingsModel!.updateAt75,
        onChanged: (val) => dispatch(SettingsActionCreator.onUpdateSetting(
            state.appSettingsModel!.copyWith(updateAt75: val))),
        secondary: Icon(Icons.sync),
        subtitle: Text('Must be signed in to at least one tracker'),
      ),
      _TrackerCards(
          name: 'Anilist',
          model: GlobalUserStore.store.getState().anilistUser,
          onLogin: () => new AnilistAPI()
              .login()
              .then((value) =>
                  dispatch(SettingsActionCreator.updateUserModel(value)))
              .whenComplete(
                  () => dispatch(DiscoveryActionCreator.grabAnilistActivity())),
          onLogout: AnilistAPI().logout),
      _TrackerCards(
          name: 'MyAnimeList',
          model: state.myanimelistUser,
          onLogin: () => new MyAnimeListAPI().login().then((value) =>
              dispatch(SettingsActionCreator.updateUserModel(value))),
          onLogout: MyAnimeListAPI().logout),
      _TrackerCards(
          name: 'SIMKL',
          model: state.simklUser,
          onLogin: () => new SimklAPI().login().then((value) =>
              dispatch(SettingsActionCreator.updateUserModel(value))),
          onLogout: () {}),
    ],
  );
}

class _TrackerCards extends StatelessWidget {
  final String name;
  final VoidCallback onLogin;
  final VoidCallback onLogout;
  final UserModel? model;

  _TrackerCards(
      {required this.name,
      required this.onLogin,
      required this.onLogout,
      this.model});

  @override
  Widget build(BuildContext context) {
    final bool isLoggedIn = model != null;

    return Card(
        child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21)),
              IconButton(
                  icon: Icon(
                    Icons.login,
                    color: isLoggedIn ? Colors.red : Colors.green,
                  ),
                  onPressed: isLoggedIn ? onLogout : onLogin)
            ],
          ),
          Text(
              model?.username != null
                  ? 'Logged in as: ' + model!.username!
                  : 'Not logged in',
              style: TextStyle(fontWeight: FontWeight.w300, fontSize: 18))
        ],
      ),
    ));
  }
}
