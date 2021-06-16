import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum FilterSheetAction {
  action,
  setFilterGenres,
  setFilterTags,
  setFilterSeason,
  setYear
}

class FilterSheetActionCreator {
  static Action onAction() {
    return const Action(FilterSheetAction.action);
  }

  static Action onFilterGenre(String genre) {
    return Action(FilterSheetAction.setFilterGenres, payload: genre);
  }

  static Action onFilterTags(String tag) {
    return Action(FilterSheetAction.setFilterTags, payload: tag);
  }

  static Action onSeason(String season) {
    return Action(FilterSheetAction.setFilterSeason, payload: season);
  }

  static Action onSetFilterYear(int year) {
    return Action(FilterSheetAction.setYear, payload: year);
  }
}
