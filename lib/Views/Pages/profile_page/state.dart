import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Services/API/MyAnimeList+API.dart';
import 'package:taiyaki/Services/API/SIMKL+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Pages/profile_page/page.dart';

class ProfileState implements Cloneable<ProfileState> {
  ThirdPartyTrackersEnum? tracker;
  List<AnimeListModel> data = [];

  AnilistViewerStats? anilistStats;

  @override
  ProfileState clone() {
    return ProfileState()
      ..tracker = tracker
      ..anilistStats = anilistStats
      ..data = data;
  }
}

ProfileState initState(ProfilePageArguments args) {
  List<AnimeListModel> _data;
  switch (args.tracker) {
    case ThirdPartyTrackersEnum.anilist:
      _data = GlobalUserStore.store.getState().anilistUserList ?? [];
      AnilistAPI().getAnimeList();
      break;
    case ThirdPartyTrackersEnum.myanimelist:
      _data = GlobalUserStore.store.getState().myanimelistUserList ?? [];
      MyAnimeListAPI().getAnimeList();
      break;
    case ThirdPartyTrackersEnum.simkl:
      _data = GlobalUserStore.store.getState().simklUserList ?? [];
      SimklAPI().getAnimeList();
      break;
  }

  return ProfileState()
    ..tracker = args.tracker
    ..data = _data;
}
