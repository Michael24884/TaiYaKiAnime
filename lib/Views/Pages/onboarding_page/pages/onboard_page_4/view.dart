import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';

import '../../action.dart';
import 'action.dart';
import 'state.dart';

Widget buildView(
    OnboardingPage4State state, Dispatch dispatch, ViewService viewService) {
  final TextStyle _title = TextStyle(fontWeight: FontWeight.w800, fontSize: 26);
  final TextStyle _subTitle =
      TextStyle(fontWeight: FontWeight.w200, fontSize: 15, color: Colors.grey);

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
                Text('Join the Discord!', style: _title),
                Text(
                  "Meet other users and get a heads up of all the new features. You'll also be able to suggest new ideas, sources, and report any bugs you encounter.",
                  style: _subTitle,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            Center(
              child: Image.asset(
                'assets/images/discord_logo.png',
                height: query.height * 0.35,
                width: query.height * 0.35,
              ),
            ),
            Column(
              children: [
                SizedBox(
                    height: query.height * 0.07,
                    width: query.width * 0.9,
                    child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            primary: Color(0xff7289da)),
                        onPressed: () =>
                            dispatch(OnboardingActionCreator.openDiscord()),
                        child: Text('Join the Taiyaki Server'))),
                SizedBox(height: 12),
                SizedBox(
                    height: query.height * 0.07,
                    width: query.width * 0.9,
                    child: ElevatedButton(
                        onPressed: () =>
                            dispatch(OnboardingActionCreator.moveToPage(5)),
                        child: Text('Next'))),
              ],
            ),
          ])),
    ),
  );
}
