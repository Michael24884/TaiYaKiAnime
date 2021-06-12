import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';

import '../../action.dart';
import 'action.dart';
import 'state.dart';

Widget buildView(
    OnboardPage5State state, Dispatch dispatch, ViewService viewService) {
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
                Text("You're all set!", style: _title),
                Text(
                  'Go watch anime, update your anime list, or even binge series',
                  style: _subTitle,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            SizedBox(
              height: query.height * 0.45,
              child: Icon(Icons.check_circle, color: Colors.green, size: 225),
            ),
            SizedBox(
                height: query.height * 0.07,
                width: query.width * 0.9,
                child: ElevatedButton(
                    onPressed: () =>
                        dispatch(OnboardingActionCreator.dismissOnboarding()),
                    child: Text('Close Setup'))),
          ])),
    ),
  );
}
