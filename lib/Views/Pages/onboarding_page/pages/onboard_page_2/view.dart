import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Utils/misc.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/action.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    OnboardingPage2State state, Dispatch dispatch, ViewService viewService) {
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
                Text('Pick the Perfect Accent', style: _title),
                Text('You can change this later in Settings', style: _subTitle),
              ],
            ),
            SizedBox(
              height: query.height * 0.45,
              child: Wrap(
                alignment: WrapAlignment.center,
                children: List.generate(
                    taiyakiAccentColors.length,
                    (index) => GestureDetector(
                          onTap: () => dispatch(
                              OnboardingPage2ActionCreator.onAction(
                                  taiyakiAccentColors[index])),
                          child: Container(
                              margin: const EdgeInsets.all(12.0),
                              child: CircleAvatar(
                                radius: 25,
                                backgroundColor: Color(int.parse(
                                    '0xff${taiyakiAccentColors[index]}')),
                              )),
                        )),
              ),
            ),
            SizedBox(
                height: query.height * 0.07,
                width: query.width * 0.9,
                child: ElevatedButton(
                    onPressed: () =>
                        dispatch(OnboardingActionCreator.moveToPage(3)),
                    child: Text('Next'))),
          ])),
    ),
  );
}
