import 'package:animator/animator.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

import 'state.dart';

Widget buildView(
    OnboardingState state, Dispatch dispatch, ViewService viewService) {
  final _height = MediaQuery.of(viewService.context).size.height;
  final _width = MediaQuery.of(viewService.context).size.width;

  Widget _intro() => Container(
        child: Align(
          alignment: Alignment.center,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Animator(
                        tweenMap: {
                          'fadeAnime': Tween<double>(
                            begin: 0,
                            end: 1,
                          ),
                          'scaleAnime': Tween<double>(begin: 0.6, end: 1),
                        },
                        endAnimationListener: (anime) {
                          state.animeKey.controller.forward();
                        },
                        cycles: 1,
                        duration: const Duration(milliseconds: 1250),
                        curve: Curves.easeInOutQuad,
                        builder: (ctx, state, child) => FadeTransition(
                          opacity: state.getAnimation('fadeAnime'),
                          child: Image.asset(
                            'assets/icon.png',
                            height: _height * 0.3,
                            width: _height * 0.3,
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Text('Taiyaki',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 40)),
                      Text('An anime app', style: TextStyle(fontSize: 16)),
                    ]),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: SizedBox(
                    width: _width * 0.9,
                    height: _height * 0.07,
                    child: Animator(
                      animatorKey: state.animeKey,
                      cycles: 1,
                      triggerOnInit: false,
                      tween: Tween<Offset>(
                          begin: Offset(0, _height * 0.25), end: Offset.zero),
                      builder: (ctx, state, _) => FractionalTranslation(
                        translation: (state.value as Offset),
                        child: ElevatedButton(
                            child: Text("Let's get you setup"),
                            onPressed: () => dispatch(
                                OnboardingActionCreator.moveToPage(null))),
                      ),
                    )),
              ),
            ],
          ),
        ),
      );

  return Scaffold(
    body: PageView.builder(
      controller: state.pageController,
      itemCount: 6,
      allowImplicitScrolling: false,
      itemBuilder: (BuildContext context, int index) {
        switch (index) {
          case 0:
            return _intro();
          case 1:
            return viewService.buildComponent('page_one');
          case 2:
            return viewService.buildComponent('page_two');
          case 3:
            return viewService.buildComponent('page_three');
          case 4:
            return viewService.buildComponent('page_four');
          case 5:
            return viewService.buildComponent('page_five');
          default:
            return const SizedBox();
        }
      },
    ),
  );
}
