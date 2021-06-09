import 'package:fish_redux/fish_redux.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';

enum DiscoveryAction {
  action,
  onError,
  showNotification,
  updateTrending,
  updatePopular,
  updateActivity,
  updateSeasonal,
  updateNextSeason,
  updateJustAdded,
  updateContinueItems,

  fetchContinueItems,
  grabAnilistActivity,
}

class NotificationData {
  final String title, message;
  final int animeID;
  final List<IOSNotificationAttachment> attachments;
  NotificationData(
      {required this.message,
      required this.title,
      required this.animeID,
      this.attachments = const []});
}

class DiscoveryActionCreator {
  static Action onAction() {
    return const Action(DiscoveryAction.action);
  }

  static Action fetchContinueItems() {
    return const Action(DiscoveryAction.fetchContinueItems);
  }

  static Action updateContinueItems(List<LastWatchingModel> items) {
    return Action(DiscoveryAction.updateContinueItems, payload: items);
  }

  static Action grabAnilistActivity() {
    return const Action(DiscoveryAction.grabAnilistActivity);
  }

  static Action showNotification(NotificationData data) {
    return Action(DiscoveryAction.showNotification, payload: data);
  }

  static Action updateActivity(List<AnilistFollowersActivityModel> data) {
    return Action(DiscoveryAction.updateActivity, payload: data);
  }

  static Action onError(String message) {
    return Action(DiscoveryAction.onError, payload: message);
  }

  static Action updateTrending(List<AnilistNode> model) {
    return Action(DiscoveryAction.updateTrending, payload: model);
  }

  static Action updateNextSeason(List<AnilistNode> model) {
    return Action(DiscoveryAction.updateNextSeason, payload: model);
  }

  static Action updateJustAdded(List<AnilistNode> model) {
    return Action(DiscoveryAction.updateJustAdded, payload: model);
  }

  static Action updateSeasonal(List<AnilistNode> model) {
    return Action(DiscoveryAction.updateSeasonal, payload: model);
  }

  static Action updatePopular(List<AnilistNode> model) {
    return Action(DiscoveryAction.updatePopular, payload: model);
  }
}
