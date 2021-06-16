import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:focus_detector/focus_detector.dart';
import 'package:kenburns/kenburns.dart';
import 'package:taiyaki/Views/Pages/detail_page/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    DetailState state, Dispatch dispatch, ViewService viewService) {
  final _data = state.anilistData;

  return FocusDetector(
    onFocusGained: () {
      if (state.anilistData != null)
        dispatch(DetailActionCreator.fetchTrackers());
    },
    child: Scaffold(
        floatingActionButton: FloatingActionButton(
          disabledElevation: 0.0,
          onPressed: state.detailDatabaseModel?.link == null
              ? null
              : () => dispatch(DetailActionCreator.showBottomSheet()),
          child: Icon(Icons.edit),
          backgroundColor: state.detailDatabaseModel?.link == null
              ? Colors.grey
              : Theme.of(viewService.context).colorScheme.secondary,
        ),
        body: AnimatedSwitcher(
          duration: const Duration(seconds: 1),
          child: state.anilistData == null
              ? Center(
                  child: CircularProgressIndicator(),
                )
              : FocusDetector(
                  onFocusGained: () {
                    dispatch(DetailActionCreator.fetchDetailDatabase());
                  },
                  child: DefaultTabController(
                    length: state.tabs.length,
                    child: NestedScrollView(
                      headerSliverBuilder:
                          (BuildContext context, bool isScrolled) => [
                        SliverAppBar(
                          pinned: true,
                          floating: false,
                          expandedHeight: TaiyakiSize.height * 0.3,
                          collapsedHeight: TaiyakiSize.height * 0.09,
                          flexibleSpace: FlexibleSpaceBar(
                            background: new Stack(
                              fit: StackFit.expand,
                              children: [
                                // 1
                                Theme(
                                  data: Theme.of(context).copyWith(
                                      colorScheme: Theme.of(context)
                                          .colorScheme
                                          .copyWith(
                                              secondary: Theme.of(context)
                                                  .colorScheme
                                                  .surface)),
                                  child: KenBurns(
                                      minAnimationDuration:
                                          const Duration(seconds: 12),
                                      maxAnimationDuration:
                                          const Duration(seconds: 20),
                                      maxScale: 1.3,
                                      child: AnimatedSwitcher(
                                          duration: const Duration(
                                              milliseconds: 1550),
                                          child: Container(
                                              height: TaiyakiSize.height * 0.35,
                                              width: TaiyakiSize.width + 150,
                                              key: UniqueKey(),
                                              child: TaiyakiImage(
                                                  url: state.covers.first)))),
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                          begin: Alignment.bottomCenter,
                                          end: Alignment.topCenter,
                                          colors: [
                                        Colors.black54,
                                        Colors.transparent
                                      ])),
                                )
                              ],
                            ),
                          ),
                          bottom: PreferredSize(
                            preferredSize: Size.fromHeight(15),
                            child: TabBar(
                              isScrollable: true,
                              controller: state.tabController,
                              tabs: state.tabs,
                            ),
                          ),
                        )
                      ],
                      body: TabBarView(
                        controller: state.tabController,
                        children: [
                          viewService.buildComponent('overview_tab'),
                          viewService.buildComponent('sync_tab'),
                          viewService.buildComponent('watch_tab'),
                          viewService.buildComponent('stats_tab'),
                          viewService.buildComponent('recommendation_tab'),
                        ],
                      ),
                    ),
                  ),
                ),
        )),
  );
}
