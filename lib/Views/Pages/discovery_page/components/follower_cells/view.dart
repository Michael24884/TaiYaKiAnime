import 'package:cached_network_image/cached_network_image.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    FollowersCellsState state, Dispatch dispatch, ViewService viewService) {
  final _activity = state.activity!;

  String _statusString = '';
  if (_activity.status == 'watched' || _activity.status.contains('episode'))
    _statusString =
        '${_activity.status[0].toUpperCase() + _activity.status.substring(1)} ${_activity.progress} of ${_activity.media.title}';
  else
    _statusString =
        '${_activity.status[0].toUpperCase() + _activity.status.substring(1)} ${_activity.media.title}';

  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 8.0),
    child: Card(
      child: Container(
        height: TaiyakiSize.height * 0.25,
        width: TaiyakiSize.width * 0.65,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    backgroundImage:
                        CachedNetworkImageProvider(_activity.user.avatar),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_activity.user.name,
                            style: TextStyle(fontWeight: FontWeight.w500)),
                        Row(
                          children: [
                            Image.asset(
                              'assets/images/anilist_icon.png',
                              height: 18,
                              width: 18,
                            ),
                            Padding(
                              padding: const EdgeInsets.only(left: 4.0),
                              child: Text('Anilist',
                                  style:
                                      TextStyle(fontWeight: FontWeight.w800)),
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 4,
              ),
              SizedBox(
                // width: TaiyakiSize.height * 0.24,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    SizedBox(
                        width: TaiyakiSize.height * 0.2,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 3.0),
                          child: Text(_statusString,
                              maxLines: 3, style: TextStyle(fontSize: 12)),
                        )),
                    TaiyakiImage(
                      url: _activity.media.coverImage,
                      height: TaiyakiSize.height * 0.1,
                      width: TaiyakiSize.height * 0.07,
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    ),
  );
}
