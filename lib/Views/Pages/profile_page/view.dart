import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Utils/misc.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    ProfileState state, Dispatch dispatch, ViewService viewService) {
  return Scaffold(
      body: CustomScrollView(slivers: [
    SliverAppBar(
      expandedHeight: TaiyakiSize.height * 0.3,
      flexibleSpace: FlexibleSpaceBar(
        background:
            TaiyakiImage(url: mapTrackerToUser(state.tracker!).background),
      ),
      pinned: true,
      stretch: true,
    ),
    SliverList(
        delegate: SliverChildListDelegate.fixed([
      viewService.buildComponent('card1'),
      viewService.buildComponent('card2'),
      if (state.tracker == ThirdPartyTrackersEnum.anilist &&
          state.anilistStats != null)
        viewService.buildComponent('card3'),
    ]))
  ]));
}
