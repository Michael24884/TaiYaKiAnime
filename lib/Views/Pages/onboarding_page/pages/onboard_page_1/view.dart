import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    OnboardPage1State state, Dispatch dispatch, ViewService viewService) {
  final TextStyle _title = TextStyle(fontWeight: FontWeight.w800, fontSize: 26);
  final TextStyle _subTitle =
      TextStyle(fontWeight: FontWeight.w200, fontSize: 14, color: Colors.grey);

  final query = MediaQuery.of(viewService.context).size;

  return SafeArea(
    top: true,
    bottom: true,
    child: Padding(
      padding: const EdgeInsets.fromLTRB(8, 18.0, 8, 12),
      child: Container(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            children: [
              Text('Pick a Theme', style: _title),
              Text('You can change this later in Settings', style: _subTitle),
            ],
          ),
          Column(
            children: [
              _ThemeCells(
                themeData: ThemeData.light(),
                name: 'Light',
                onSelected: () =>
                    dispatch(OnboardPage1ActionCreator.updateTheme('Light')),
              ),
              _ThemeCells(
                themeData: ThemeData.dark(),
                name: 'Dark',
                onSelected: () =>
                    dispatch(OnboardPage1ActionCreator.updateTheme('Dark')),
              ),
            ],
          ),
          SizedBox(
              height: query.height * 0.07,
              width: query.width * 0.9,
              child: ElevatedButton(
                  onPressed: () =>
                      dispatch(OnboardingActionCreator.moveToPage(null)),
                  child: Text('Next')))
        ],
      )),
    ),
  );
}

class _ThemeCells extends StatelessWidget {
  final ThemeData themeData;
  final String name;
  final VoidCallback onSelected;

  _ThemeCells(
      {required this.themeData, required this.name, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    final query = MediaQuery.of(context).size;

    return GestureDetector(
      onTap: onSelected,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
            color: themeData.colorScheme.surface,
            borderRadius: BorderRadius.all(Radius.circular(12.0)),
            border: Border.all(
                width: 1, color: themeData.textTheme.bodyText1!.color!)),
        height: query.height * 0.15,
        width: query.width * 0.85,
        child: Center(
            child: Text(name,
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 19,
                  color: themeData.textTheme.bodyText1!.color!,
                ))),
      ),
    );
  }
}
