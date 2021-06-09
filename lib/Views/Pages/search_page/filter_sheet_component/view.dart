import 'dart:ui';

import 'package:auto_size_text/auto_size_text.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_sliders/sliders.dart';
import 'package:taiyaki/Models/Anilist/typed_models.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    FilterSheetState state, Dispatch dispatch, ViewService viewService) {
  final TextStyle _title = TextStyle(fontWeight: FontWeight.w700, fontSize: 21);

  return Scaffold(
    body: ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            'Year',
            style: _title,
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: SfSlider(
            min: DateTime(1940).year.toDouble(),
            max: DateTime.now().year.toDouble(),
            onChanged: (v) => dispatch(FilterSheetActionCreator.onSetFilterYear(
                (v as double).toInt())),
            value: (state.year ?? DateTime.now().year).toDouble(),
            dateFormat: DateFormat.y(),
            showLabels: true,
            dateIntervalType: DateIntervalType.years,
            enableTooltip: true,
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            'Season',
            style: _title,
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Wrap(
            alignment: WrapAlignment.center,
            children: [...AnilistGraphTypes.anilistSeasons]
                .map((o) => Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: ChoiceChip(
                        label: Text(o),
                        selected: o == state.enabledSeason,
                        onSelected: (v) =>
                            dispatch(FilterSheetActionCreator.onSeason(o)),
                      ),
                    ))
                .toList(),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text('Genres', style: _title),
        ),
        GridView.count(
          childAspectRatio: 1 / 0.3,
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          children:
              List.generate(AnilistGraphTypes.anilistGenres.length, (index) {
            final _item = AnilistGraphTypes.anilistGenres[index];
            bool isInList = false;
            if (state.enabledGenres.isEmpty && _item == 'All') isInList = true;
            if (state.enabledGenres.isNotEmpty &&
                state.enabledGenres.contains(_item)) isInList = true;
            return Container(
                margin: const EdgeInsets.all(4.0),
                decoration: BoxDecoration(
                    color: Theme.of(viewService.context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(2.0)),
                child: CheckboxListTile(
                  value: isInList,
                  onChanged: (bool? value) =>
                      dispatch(FilterSheetActionCreator.onFilterGenre(_item)),
                  title: Container(
                    margin: const EdgeInsets.all(2.0),
                    child: AutoSizeText(_item,
                        minFontSize: 9,
                        maxLines: 2,
                        style: TextStyle(fontWeight: FontWeight.w500)),
                  ),
                ));
          }),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text('Tags', style: _title),
        ),
        GridView.count(
          childAspectRatio: 1 / 0.3,
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          children:
              List.generate(AnilistGraphTypes.anilistTags().length, (index) {
            final _item = AnilistGraphTypes.anilistTags()[index];

            bool isInList = false;
            if (state.enabledTags.isEmpty && _item == 'All') isInList = true;
            if (state.enabledTags.isNotEmpty &&
                state.enabledTags.contains(_item)) isInList = true;

            return Container(
                margin: const EdgeInsets.all(4.0),
                decoration: BoxDecoration(
                    color: Theme.of(viewService.context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(2.0)),
                child: CheckboxListTile(
                  value: isInList,
                  onChanged: (bool? value) =>
                      dispatch(FilterSheetActionCreator.onFilterTags(_item)),
                  title: Text(_item,
                      style: TextStyle(fontWeight: FontWeight.w500)),
                ));
          }),
        )
      ],
    ),
  );
}
