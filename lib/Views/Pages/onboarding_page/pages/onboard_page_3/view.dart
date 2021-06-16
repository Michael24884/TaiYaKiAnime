import 'package:cached_network_image/cached_network_image.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Services/API/MyAnimeList+API.dart';
import 'package:taiyaki/Services/API/SIMKL+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserState.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Utils/misc.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/action.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    OnboardPage3State state, Dispatch dispatch, ViewService viewService) {
  final TextStyle _title = TextStyle(fontWeight: FontWeight.w800, fontSize: 26);
  final TextStyle _subTitle =
      TextStyle(fontWeight: FontWeight.w200, fontSize: 14, color: Colors.grey);

  final query = MediaQuery.of(viewService.context).size;

  return SafeArea(
    top: true,
    bottom: true,
    child: Padding(
      padding: const EdgeInsets.fromLTRB(8.0, 18.0, 8.0, 12.0),
      child: Container(
          child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
            Column(
              children: [
                Text('Use a tracker?', style: _title),
                Text('You can also sign in later in Settings',
                    style: _subTitle),
              ],
            ),
            SizedBox(
              height: query.height * 0.45,
              child: Wrap(
                alignment: WrapAlignment.center,
                children: [
                  _TrackerBubbles(tracker: ThirdPartyTrackersEnum.anilist),
                  _TrackerBubbles(tracker: ThirdPartyTrackersEnum.myanimelist),
                  _TrackerBubbles(tracker: ThirdPartyTrackersEnum.simkl)
                ],
              ),
            ),
            SizedBox(
                height: query.height * 0.07,
                width: query.width * 0.9,
                child: ElevatedButton(
                    onPressed: () =>
                        dispatch(OnboardingActionCreator.moveToPage(4)),
                    child: Text('Next'))),
          ])),
    ),
  );
}

class _TrackerBubbles extends StatefulWidget {
  final ThirdPartyTrackersEnum tracker;

  const _TrackerBubbles({Key? key, required this.tracker}) : super(key: key);

  @override
  __TrackerBubblesState createState() => __TrackerBubblesState(tracker);
}

class __TrackerBubblesState extends State<_TrackerBubbles> {
  __TrackerBubblesState(ThirdPartyTrackersEnum tracker)
      : _image = mapTrackerToAsset(tracker);

  final String _image;
  String? _avatar;
  String? _userName;

  @override
  void initState() {
    _update();
    super.initState();
  }

  void _update() {
    switch (widget.tracker) {
      case ThirdPartyTrackersEnum.anilist:
        this.setState(() {
          _avatar = GlobalUserStore.store.getState().anilistUser?.avatar;
          _userName = GlobalUserStore.store.getState().anilistUser?.username;
        });
        break;
      case ThirdPartyTrackersEnum.myanimelist:
        this.setState(() {
          _avatar = GlobalUserStore.store.getState().myanimelistUser?.avatar;
          _userName =
              GlobalUserStore.store.getState().myanimelistUser?.username;
        });
        break;
      case ThirdPartyTrackersEnum.simkl:
        this.setState(() {
          _avatar = GlobalUserStore.store.getState().simklUser?.avatar;
          _userName = GlobalUserStore.store.getState().simklUser?.username;
        });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (_userName == null)
          switch (widget.tracker) {
            case ThirdPartyTrackersEnum.anilist:
              AnilistAPI().login().whenComplete(() {
                AnilistAPI().getProfile().whenComplete(() => _update());
              });
              break;
            case ThirdPartyTrackersEnum.simkl:
              SimklAPI().login().whenComplete(
                  () => SimklAPI().getProfile().whenComplete(() => _update()));
              break;
            case ThirdPartyTrackersEnum.myanimelist:
              MyAnimeListAPI().login().whenComplete(() =>
                  MyAnimeListAPI().getProfile().whenComplete(() => _update()));
          }
      },
      child: Container(
        margin: const EdgeInsets.all(20),
        child: Column(
          children: [
            CircleAvatar(
              backgroundImage: _avatar != null
                  ? (NetworkImage(_avatar!) as ImageProvider<Object>?)
                  : (AssetImage(_image)),
              radius: 60,
            ),
            Padding(
              padding: const EdgeInsets.only(top: 10.0),
              child: Text(_userName ?? '',
                  style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }
}
