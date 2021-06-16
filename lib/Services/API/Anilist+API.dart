import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/Anilist/typed_models.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Services/API/Base+API.dart';
import 'package:taiyaki/Services/Exceptions/API/Exceptions+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserAction.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';

class _Bearer {
  final String accessToken;

  _Bearer({required this.accessToken});

  factory _Bearer.fromJson(Map<String, dynamic> json) =>
      _Bearer(accessToken: json['access_token']);
}

class AnilistAPI with OauthLoginHandler implements BaseTracker {
  final Dio _request = new Dio(
    BaseOptions(
      baseUrl: 'https://graphql.anilist.co',
      contentType: Headers.jsonContentType,
      method: 'POST',
    ),
  )..interceptors.add(
      InterceptorsWrapper(
        onError: (DioError error, onError) {
          throw new Exception(error.toString());
        },
        onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
          final _token =
              GlobalUserStore.store.getState().anilistUser?.accessToken;
          if (_token != null)
            options.headers.addAll({'Authorization': 'Bearer $_token'});

          return handler.next(options);
        },
      ),
    );

  Future<List<AnilistNode>> getSearchResults(List<String> genres,
      List<String> tags, String? query, int? year, String? season) async {
    final _response = await _request.post('', data: {
      'query': AnilistGraphTypes.searchData(
          genres: genres, tags: tags, query: query, year: year, season: season)
    });
    final _model = List<AnilistNode>.from((_response.data['data']['Page']
            ['media'])
        .map((i) => AnilistNode.fromJson(i))
        .toList());
    return _model;
  }

  Future<List<AnilistFollowersActivityModel>> getFollowersActivity() async {
    final _response = await _request
        .post('', data: {'query': AnilistGraphTypes.followerActivities});
    final _activities = List<AnilistFollowersActivityModel>.from(_response
        .data['data']['Page']['activities']
        .map((i) => AnilistFollowersActivityModel.fromJson(i))
        .toList());
    return _activities;
  }

  Future<List<AnilistNode>> getPagedData(AnilistPageFilterEnum type) async {
    final _response = await _request.post(
      '',
      data: {'query': AnilistGraphTypes.PagedData(type)},
    );

    if (_response.statusCode == 200) {
      final List<AnilistNode> model = List<AnilistNode>.from(
          ((_response.data['data']['Page']['media'])
              .map((i) => new AnilistNode.fromJson(i))
              .toList()));
      return model;
    } else
      throw new APIException(
          message: 'Could not get a valid response from the Anilist server');
  }

  Future<MediaListEntryModel?> getMediaList(int id) async {
    final _response = await _request
        .post('', data: {'query': AnilistGraphTypes.fetchEntry(id)});
    if (_response.data['data']["Media"]['mediaListEntry'] != null) {
      final MediaListEntryModel entry = MediaListEntryModel.fromJson(
          _response.data['data']['Media']['mediaListEntry']);
      return entry;
    }
  }

  Future<AnilistNode> getDetailData(int id, {int? idMal}) async {
    final _response = await _request.post('',
        data: {'query': AnilistGraphTypes.detailData(id, idMal: idMal)});

    if (_response.statusCode == 200) {
      final AnilistNode data =
          AnilistNode.fromJson(_response.data['data']['Media']);
      return data;
    } else
      throw new APIException(
          message: 'Could not get a valid response from the Anilist server');
  }

  @override
  Future<UpdateModel> login() async {
    final _storage = new FlutterSecureStorage();
    final _clientID = env['ANILIST_CLIENT_ID']!;
    final _clientSecret = env['ANILIST_CLIENT_SECRET']!;
    final _redirectEndpoint = 'taiyaki://anilist/redirect';

    final _authEndpoint = Uri(
        scheme: 'https',
        host: 'anilist.co',
        path: '/api/v2/oauth/authorize',
        queryParameters: {
          'client_id': _clientID,
          'redirect_uri': _redirectEndpoint,
          'response_type': 'code',
        });

    final _tokenEndpoint =
        Uri(scheme: 'https', host: 'anilist.co', path: '/api/v2/oauth/token');

    final String _codeResponse = await obtainCode(_authEndpoint);
    final _code = Uri.parse(_codeResponse).queryParameters['code'];
    if (_code != null) {
      final _authResponse = await new Dio().postUri(_tokenEndpoint, data: {
        'grant_type': 'authorization_code',
        'client_id': _clientID,
        'client_secret': _clientSecret,
        'redirect_uri': _redirectEndpoint,
        'code': _code,
      });

      if (_authResponse.statusCode == 200) {
        final _Bearer _bearer = new _Bearer.fromJson(_authResponse.data);
        UserModel _userModel = UserModel(accessToken: _bearer.accessToken);
        UpdateModel model;
        await _storage.write(
            key: 'anilist', value: json.encode(_userModel.toMap()));

        model = UpdateModel(
            tracker: ThirdPartyTrackersEnum.anilist, model: _userModel);
        GlobalUserStore.store
            .dispatch(GlobalUserActionCreator.onUpdateUser(model));
        this.getProfile();
        return model;
      } else
        throw new APIException(
            message: 'Could not obtain the Bearer token from Anilist');
    } else
      throw new APIException(
          message: 'Could not obtain an authorization code from Anilist');
  }

  @override
  Future<SyncModel> syncProgress(int id, SyncModel syncModel) async {
    final _response = await _request.post('',
        data: {'query': AnilistGraphTypes.updateMedia(id, syncModel)});

    if (_response.statusCode == 200) {
      final MediaListEntryModel model = MediaListEntryModel.fromJson(
          _response.data['data']['SaveMediaListEntry']);
      return SyncModel(
          progress: model.progress,
          status: model.status,
          score: model.score,
          episodes: syncModel.episodes);
    } else
      throw APIException(message: 'Error updating your data to Anilist');
  }

  @override
  Future getProfile() async {
    final _response = await _request
        .post('', data: {'query': AnilistGraphTypes.getUserProfile()});

    if (_response.statusCode == 200) {
      final AnilistViewerModel viewerModel =
          new AnilistViewerModel.fromJson(_response.data);
      final UserModel _user = GlobalUserStore.store
          .getState()
          .anilistUser!
          .copyWith(
              username: viewerModel.name,
              avatar: viewerModel.avatar,
              background: viewerModel.bannerImage,
              id: viewerModel.id);

      storage
          .write(key: 'anilist', value: json.encode(_user.toMap()))
          .whenComplete(() => GlobalUserStore.store.dispatch(
              GlobalUserActionCreator.onUpdateUser(UpdateModel(
                  model: _user, tracker: ThirdPartyTrackersEnum.anilist))));
    } else
      throw new APIException(
          message: 'Could not obtain the user profile from Anilist');
  }

  @override
  Future<List<AnimeListModel>> getAnimeList() async {
    final UserModel? _user = GlobalUserStore.store.getState().anilistUser;
    if (_user == null) throw Exception('User is not logged in');
    final _response = await _request.post('', data: {
      'query': AnilistGraphTypes.grabUserList(_user.username!, _user.id!)
    });
    if (_response.statusCode == 200) {
      final AnilistAnimeListModel _model = AnilistAnimeListModel.fromJson(
          _response.data['data']['MediaListCollection']);

      final List<AnimeListModel> data = _model.entries
          .map((e) => AnimeListModel(
                title: e.title,
                totalEpisodes: e.episodes,
                coverImage: e.coverImage,
                id: e.id,
                status: _anilistStatusToNative(e.mediaListEntryModel!.status!),
                progress: e.mediaListEntryModel!.progress ?? 0,
                score: (e.mediaListEntryModel!.score ?? 0).toDouble(),
              ))
          .toList();
      GlobalUserStore.store.dispatch(GlobalUserActionCreator.onUpdateUserList(
          data, ThirdPartyTrackersEnum.anilist));
      return data;
    } else
      throw APIException(message: 'Could not obtain the users anime list');
  }

  Future<AnilistViewerStats> grabStats() async {
    final _response = await _request
        .post('', data: {'query': AnilistGraphTypes.grabViewerStats()});
    final _model = AnilistViewerStats.fromJson(
        _response.data['data']['Viewer']['statistics']['anime']);
    return _model;
  }

  String _anilistStatusToNative(String status) {
    switch (status) {
      case 'CURRENT':
        return 'Watching';
      case 'PLANNING':
        return 'Planning';
      case 'COMPLETED':
        return "Completed";
      case 'PAUSED':
        return 'On Hold';
      case 'DROPPED':
        return 'Dropped';
      default:
        return 'Add to List';
    }
  }

  static String nativeToAnilistStatus(String status) {
    switch (status) {
      case 'Watching':
        return 'CURRENT';
      case 'Planning':
        return 'PLANNING';
      case 'Completed':
        return 'COMPLETED';
      case 'On Hold':
        return 'PAUSED';
      case 'Dropped':
        return 'DROPPED';
      default:
        return 'null';
    }
  }

  @override
  Future<void> logout() async {
    await storage.delete(key: 'anilist');
    GlobalUserStore.store.dispatch(
        GlobalUserActionCreator.removeUser(ThirdPartyTrackersEnum.anilist));
  }
}
