import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Views/Pages/profile_page/components/card1/component.dart';
import 'package:taiyaki/Views/Pages/profile_page/components/card1/state.dart';
import 'package:taiyaki/Views/Pages/profile_page/components/card2/component.dart';
import 'package:taiyaki/Views/Pages/profile_page/components/card3/component.dart';

import 'components/card2/state.dart';
import 'components/card3/state.dart';
import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class ProfilePageArguments {
  final ThirdPartyTrackersEnum tracker;
  ProfilePageArguments({required this.tracker});
}

class ProfilePage extends Page<ProfileState, ProfilePageArguments> {
  ProfilePage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<ProfileState>(
              adapter: null,
              slots: <String, Dependent<ProfileState>>{
                'card1': Card1Connector() + Card1Component(),
                'card2': Card2Connector() + Card2Component(),
                'card3': Card3Connector() + Card3Component(),
              }),
          middleware: <Middleware<ProfileState>>[],
        );
}
