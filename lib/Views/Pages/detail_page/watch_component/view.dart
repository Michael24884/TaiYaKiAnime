import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Utils/math.dart';
import 'package:taiyaki/Views/Pages/detail_page/action.dart';
import 'package:taiyaki/Views/Pages/detail_page/watch_component/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(WatchState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();

  if (state.databaseModel?.link == null)
    return Container(
        child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: Center(
          child: Column(children: [
        Text(
            'Taiyaki requires a source to be able to link this entry. Tap on the button below to select the proper link and start watching.',
            textAlign: TextAlign.center),
        SizedBox(height: TaiyakiSize.height * 0.15),
        ElevatedButton(
          onPressed: () => dispatch(WatchActionCreator.openSourceSelector()),
          child: Text('Link to Taiyaki'),
        ),
      ])),
    ));

  return Container(
    child: ListView(
      children: [
        Card(
            child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(children: [
            SizedBox(
              height: TaiyakiSize.height * 0.12,
              width: TaiyakiSize.height * 0.12,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  SizedBox(
                    height: TaiyakiSize.height * 0.12,
                    width: TaiyakiSize.height * 0.12,
                    child: CircularProgressIndicator(
                      value: state.episodes.length > 0
                          ? double.parse(
                              percentageRemaining(
                                  state.episodes.length,
                                  ((state.databaseModel?.episodeProgress ??
                                          {0: 0}))
                                      .keys
                                      .last,
                                  isValue: true),
                            )
                          : 0.0,
                    ),
                  ),
                  Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(state.episodes.length > 0
                            ? percentageRemaining(
                                    state.episodes.length,
                                    (state.databaseModel?.episodeProgress ??
                                            {0: 0})
                                        .keys
                                        .last) +
                                '%'
                            : '??%'),
                        Text('complete')
                      ])
                ],
              ),
            ),
            Expanded(
                child: Column(children: [
              Text(
                  '${state.episodes.length - (state.databaseModel?.lastWatchingModel?.watchingEpisode.episode ?? 0)} episodes left to watch'),
              TextButton(
                  onPressed: () {
                    dispatch(WatchActionCreator.updateDatabase(
                        state.databaseModel!.copyWith(
                            isFollowing:
                                !(state.databaseModel?.isFollowing ?? false))));

                    dispatch(DetailActionCreator.showSnackMessage(SnackDetail(
                        message: (state.databaseModel?.isFollowing ?? false)
                            ? 'No longer following this anime'
                            : "You'll be notified on new episodes")));
                  },
                  child: Text(
                      (state.databaseModel?.isFollowing ?? false)
                          ? "Following this anime"
                          : 'Notify me on new episodes',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: (state.databaseModel?.isFollowing ?? false)
                              ? Colors.green
                              : Theme.of(viewService.context)
                                  .colorScheme
                                  .secondary)))
            ]))
          ]),
        )),
        SizedBox(height: TaiyakiSize.height * 0.02),
        if (GlobalSettingsStore.store.getState().appSettings.blurSpoilers)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.info_outline, color: Colors.grey),
                SizedBox(width: 4),
                Text('Spoil protection is turned on',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.grey,
                        fontWeight: FontWeight.w300,
                        fontSize: 13)),
              ],
            ),
          ),
        ListView.builder(
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemExtent: TaiyakiSize.height * 0.18,
          itemBuilder: _adapter.itemBuilder,
          itemCount: _adapter.itemCount,
        )
      ],
    ),
  );
}
