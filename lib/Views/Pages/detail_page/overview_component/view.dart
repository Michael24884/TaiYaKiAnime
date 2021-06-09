import 'package:auto_size_text/auto_size_text.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/detail_page/overview_component/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'state.dart';

Widget buildView(
    OverviewState state, Dispatch dispatch, ViewService viewService) {
  final TextStyle subTitle = TextStyle(
      fontWeight: FontWeight.w700, fontSize: TaiyakiSize.height * 0.03);

  Widget PaddedText(String text, {TextStyle? style, int? maxLines}) => Padding(
      padding: const EdgeInsets.fromLTRB(10.0, 12, 10.0, 0.0),
      child: Text(
        text,
        style: style,
        maxLines: maxLines,
        overflow: TextOverflow.fade,
      ));

  final _data = state.data!;

  return ListView(
    physics: NeverScrollableScrollPhysics(),
    // crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TaiyakiImage(
              url: _data.coverImage,
              height: TaiyakiSize.height * 0.3,
              width: TaiyakiSize.height * 0.2,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Container(
                width: TaiyakiSize.width * 0.48,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AutoSizeText(_data.title,
                        minFontSize: 14,
                        maxLines: 3,
                        style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: TaiyakiSize.height * 0.031)),
                    _data.englishTitle != null
                        ? Padding(
                            padding: const EdgeInsets.only(top: 2.0),
                            child: AutoSizeText(_data.englishTitle,
                                minFontSize: 14,
                                maxLines: 3,
                                style: TextStyle(
                                    fontWeight: FontWeight.w400,
                                    fontSize: TaiyakiSize.height * 0.021)),
                          )
                        : const SizedBox(),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
      if (_data.nextAiringEpisode != null)
        Padding(
          padding: const EdgeInsets.only(top: 12.0, right: 8.0),
          child: Text(
            'Episode ${_data.nextAiringEpisode!.episode} airs in ${convertSecondsToDays(_data.nextAiringEpisode!.timeUntilAiring!)}',
            style: TextStyle(
                color: _data.nextAiringEpisode!.timeUntilAiring != null
                    ? Colors.green
                    : Colors.red,
                fontWeight: FontWeight.w600,
                fontSize: 13),
            textAlign: TextAlign.right,
          ),
        ),
      Padding(
        padding: const EdgeInsets.fromLTRB(8.0, 12.0, 8.0, 0.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Synopsis',
              style: subTitle,
            ),
            TextButton(
              onPressed: () =>
                  dispatch(OverviewActionCreator.onExpandSynopsis()),
              child: Text(
                state.synopsisExpanded ? 'Read Less' : 'Read More',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            )
          ],
        ),
      ),
      PaddedText(
          _data.description ?? 'No synopsis for this anime has been provided',
          maxLines: state.synopsisExpanded ? null : 3),
      if (_data.genres != null)
        Wrap(
          children: _data.genres!
              .map((e) => Padding(
                    key: ValueKey(e),
                    padding: const EdgeInsets.fromLTRB(8.0, 6.0, 8.0, 6.0),
                    child: Chip(label: Text(e)),
                  ))
              .toList(),
        ),
      PaddedText('Info', style: subTitle),
      Padding(
        padding: const EdgeInsets.all(8.0),
        child: Card(
          child: Column(
            children: [
              _InfoRow(
                title: 'Status',
                data: _data.status,
              ),
              _InfoRow(
                  title: 'Total Episodes',
                  data: (_data.episodes == 0
                      ? 'Not yet recorded'
                      : ((_data.episodes ?? '??').toString() + ' episodes'))),
              _InfoRow(
                title: 'Mean Score',
                data: (_data.meanScore ?? 'N/A').toString(),
              ),
              _InfoRow(title: 'Type', data: _data.type),
              _InfoRow(
                title: 'Duration',
                data: (_data.duration ?? 'N/A').toString() + ' minutes',
              ),
              _InfoRow(
                title: 'Source',
                data: _data.source,
              ),
              _InfoRow(
                title: 'Origin Country',
                data: _data.countryOfOrigin,
              ),
              _InfoRow(
                title: 'Season',
                data: '${_data.season ?? '??'} ${_data.seasonYear ?? '??'}',
              ),
              _InfoRow(
                title: 'Hashtag',
                data: _data.hashtag ?? 'N/A',
              )
            ],
          ),
        ),
      ),
      if (_data.characters.isNotEmpty)
        viewService.buildComponent('characters_component'),
    ],
  );
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String? data;

  _InfoRow({required this.title, this.data});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
              Container(
                  constraints:
                      BoxConstraints(maxWidth: TaiyakiSize.height * 0.26),
                  child: Text(
                    data ?? 'N/A',
                    textAlign: TextAlign.right,
                  )),
            ],
          ),
        ),
        Divider(),
      ],
    );
  }
}
