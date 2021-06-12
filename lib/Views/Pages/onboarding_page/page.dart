import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_1/component.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_1/state.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_2/component.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_2/state.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_3/component.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_3/state.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/pages/onboard_page_4/state.dart';

import 'effect.dart';
import 'pages/onboard_page_4/component.dart';
import 'pages/onboard_page_5/component.dart';
import 'pages/onboard_page_5/state.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardingPage extends Page<OnboardingState, Map<String, dynamic>> {
  OnboardingPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardingState>(
              adapter: null,
              slots: <String, Dependent<OnboardingState>>{
                'page_one': OnboardPage1Connector() + OnboardPage1Component(),
                'page_two':
                    OnboardPage2Connector() + OnboardingPage2Component(),
                'page_three': OnboardPage3Connector() + OnboardPage3Component(),
                'page_four':
                    OnboardingPage4Connector() + OnboardingPage4Component(),
                'page_five': OnboardPage5Connector() + OnboardPage5Component(),
              }),
          middleware: <Middleware<OnboardingState>>[],
        );
}
