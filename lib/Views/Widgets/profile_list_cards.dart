import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Pages/profile_page/page.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

class ProfileListCards extends StatefulWidget {
  final ThirdPartyTrackersEnum tracker;
  final UserModel userModel;

  ProfileListCards({required this.tracker, required this.userModel});

  @override
  _ProfileListCardsState createState() => _ProfileListCardsState();
}

class _ProfileListCardsState extends State<ProfileListCards> {
  final _cardWidth = TaiyakiSize.width * 0.54;

  String _trackerName() {
    switch (widget.tracker) {
      case ThirdPartyTrackersEnum.anilist:
        return 'Anilist';
      case ThirdPartyTrackersEnum.myanimelist:
        return 'MyAnimeList';
      case ThirdPartyTrackersEnum.simkl:
        return 'SIMKL';
    }
  }

  List<AnimeListModel>? _trackerList() {
    switch (widget.tracker) {
      case ThirdPartyTrackersEnum.anilist:
        return GlobalUserStore.store.getState().anilistUserList;
      case ThirdPartyTrackersEnum.myanimelist:
        return GlobalUserStore.store.getState().myanimelistUserList;
      case ThirdPartyTrackersEnum.simkl:
        return GlobalUserStore.store.getState().simklUserList;
    }
  }

  final _random = new Random();
// Timer(const Duration(seconds: 5), _onChange);
  String? _currentImage;
  int index = 0;

  @override
  void initState() {
    index = _next();
    _currentImage = _trackerList()?.first.coverImage;
    super.initState();
  }

  int _next() {
    if ((_trackerList()?.length ?? 0) == 0) return 0;
    final length = (_trackerList()?.length ?? 1);
    return 0 + _random.nextInt(length);
  }

  void _onChange() {
    if (_trackerList() == null) return;
    this.setState(() {
      index = _next();
      _currentImage = _trackerList()![_next()].coverImage;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed('profile_page',
          arguments: ProfilePageArguments(tracker: widget.tracker)),
      child: Container(
        margin: EdgeInsets.symmetric(
            horizontal: 5.0, vertical: Platform.isIOS ? 2.0 : 8.0),
        color: Theme.of(context).colorScheme.surface,
        height: TaiyakiSize.height * 0.22,
        width: _cardWidth,
        child: Stack(
          clipBehavior: Clip.antiAlias,
          fit: StackFit.expand,
          children: [
            Container(
              key: UniqueKey(),
              child: TaiyakiImage(
                url: widget.userModel.avatar,
                fit: BoxFit.cover,
              ),
            ),
            Container(
                height: TaiyakiSize.height * 0.22,
                width: _cardWidth,
                decoration: BoxDecoration(
                    gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Theme.of(context).colorScheme.surface,
                    Theme.of(context).colorScheme.surface.withOpacity(0.5),
                  ],
                ))),
            Padding(
              padding: const EdgeInsets.only(bottom: 1.0),
              child: Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                      height: TaiyakiSize.height * 0.2,
                      width: _cardWidth,
                      child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              foregroundImage: widget.userModel.avatar != null
                                  ? (NetworkImage(widget.userModel.avatar!)
                                      as ImageProvider<Object>)
                                  : AssetImage('assets/icon.png'),
                              radius: 30,
                            ),
                            Text(
                              widget.userModel.username!,
                              maxLines: 1,
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Image.asset(
                                    _trackerName() == 'Anilist'
                                        ? 'assets/images/anilist_icon.png'
                                        : _trackerName() == 'MyAnimeList'
                                            ? 'assets/images/mal_icon.png'
                                            : 'assets/images/simkl_icon.png',
                                    height: TaiyakiSize.height * 0.02,
                                    width: TaiyakiSize.height * 0.02),
                                Text(_trackerName(),
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold))
                              ],
                            )
                          ]))),
            )
          ],
        ),
      ),
    );
  }
}
