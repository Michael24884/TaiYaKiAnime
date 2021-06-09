import 'dart:ui';

import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import '../action.dart';
import 'state.dart';

Widget buildView(
    EpisodeCellState state, Dispatch dispatch, ViewService viewService) {
  return GestureDetector(
    onTap: () => dispatch(WatchActionCreator.moveToVideoPage(state.episode!)),
    child: Container(
      decoration: BoxDecoration(
          color: Theme.of(viewService.context).colorScheme.surface,
          borderRadius: const BorderRadius.all(Radius.circular(4))),
      margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
      child: Row(children: [
        SizedBox(
          height: TaiyakiSize.height * 0.17,
          width: TaiyakiSize.width * 0.35,
          child: Stack(
            fit: StackFit.expand,
            children: [
              (!state.isBlurred!)
                  ? TaiyakiImage(
                      url: simklThumbnailGen(state.episode?.thumbnail),
                      height: TaiyakiSize.height * 0.17,
                      width: TaiyakiSize.width * 0.35,
                    )
                  : Image.asset('assets/icon.png'),
            ],
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(4.0, 4.0, 4.0, 8.0),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Episode ${state.episode!.episode}',
                            style: TextStyle(fontSize: 12)),
                        Text(
                          state.episode!.title,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  if (state.progress != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                            (state.progress! * 100 >= 100)
                                ? 'Completed'
                                : '${(state.progress! * 100).toStringAsFixed(2)}% watched',
                            style: TextStyle(
                                fontWeight: FontWeight.w300, fontSize: 12)),
                        LinearProgressIndicator(
                          value: state.progress,
                          valueColor: AlwaysStoppedAnimation<Color>(
                              (state.progress! * 100 <= 80)
                                  ? Theme.of(viewService.context)
                                      .colorScheme
                                      .secondary
                                  : Colors.green),
                        ),
                      ],
                    )
                ]),
          ),
        ),
      ]),
    ),
  );
}
