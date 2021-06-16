import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Services/API/Base+API.dart';
import 'package:taiyaki/Services/Exceptions/API/Exceptions+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserAction.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Utils/strings.dart';

class _Bearer {
  final String accessToken;

  _Bearer({required this.accessToken});
  factory _Bearer.fromJson(Map<String, dynamic> json) =>
      _Bearer(accessToken: json['access_token']);
}

class _SimklSyncModel {
  final String? status;
  final int id;
  final int? malID;
  final int? episodes;

  _SimklSyncModel({this.status, required this.id, this.malID, this.episodes});

  toJson() {
    if (status != null)
      return {
        'to': _nativeToSimklStatus(status!),
        'ids': {
          'simkl': id,
        }
      };
    else {
      return '''
     {
      'shows': [
        'ids' : {
        'simkl': $id,
        },
        'episodes': [
          {'number': $episodes}   
        ]
        
      ]
      }
    ''';
    }
  }
}

class SimklAPI with OauthLoginHandler implements BaseTracker {
  final Dio _request =
      Dio(BaseOptions(baseUrl: 'https://api.simkl.com', headers: {
    'simkl-api-key': env['SIMKL_CLIENT_ID'],
  }))
        ..interceptors.add(InterceptorsWrapper(onRequest:
            (RequestOptions options, RequestInterceptorHandler handler) {
          final _token = GlobalUserStore.store.getState().simklUser;
          if (_token != null)
            options.headers
                .addAll({'Authorization': 'Bearer ' + _token.accessToken});
          return handler.next(options);
        }));

  @override
  Future getProfile() async {
    final _response = await this._request.get('/users/settings');
    final SimklUserModel model = SimklUserModel.fromJson(_response.data);
    final UserModel _user = GlobalUserStore.store
        .getState()
        .simklUser!
        .copyWith(username: model.name, avatar: model.avatar, id: model.id);

    storage.write(key: 'simkl', value: json.encode(_user.toMap())).whenComplete(
        () => GlobalUserStore.store.dispatch(
            GlobalUserActionCreator.onUpdateUser(UpdateModel(
                model: _user, tracker: ThirdPartyTrackersEnum.simkl))));
  }

  @override
  Future<UpdateModel> login() async {
    final _redirectUri = 'taiyaki://simkl/redirect';
    final _authEndpoint = Uri(
        scheme: 'https',
        host: 'simkl.com',
        path: '/oauth/authorize',
        queryParameters: {
          'response_type': 'code',
          'client_id': env['SIMKL_CLIENT_ID'],
          'redirect_uri': _redirectUri,
        });
    final _tokenEndpoint = 'https://api.simkl.com/oauth/token';
    final String _code =
        Uri.parse(await obtainCode(_authEndpoint)).queryParameters['code']!;
    if (_code.length != 0) {
      final _response = await new Dio().post(_tokenEndpoint, data: {
        'code': _code,
        'client_id': env['SIMKL_CLIENT_ID'],
        'client_secret': env['SIMKL_CLIENT_SECRET'],
        'redirect_uri': _redirectUri,
        'grant_type': 'authorization_code',
      });

      if (_response.statusCode == 200) {
        final _token = _Bearer.fromJson(_response.data).accessToken;
        final UserModel _userModel = UserModel(
          accessToken: _token,
        );

        final UpdateModel _updateModel = UpdateModel(
          model: _userModel,
          tracker: ThirdPartyTrackersEnum.simkl,
        );

        await storage
            .write(key: 'simkl', value: json.encode(_userModel.toMap()))
            .whenComplete(() => GlobalUserStore.store
                .dispatch(GlobalUserActionCreator.onUpdateUser(_updateModel)))
            .whenComplete(() => this.getProfile());
        return _updateModel;
      } else
        throw APIException(message: 'Could not obtain Bearer token from SIMKL');
    } else
      throw new APIException(
          message: 'Could not obtain authorization code from SIMKL');
  }

  @override
  Future<SyncModel> syncProgress(int id, SyncModel syncModel) async {
    if (syncModel.status != null) {
      final _json = _SimklSyncModel(
        id: id,
        status: syncModel.status,
      ).toJson();

      final _response = await _request.post('/sync/add-to-list', data: _json);
    }

    if (syncModel.progress != null || syncModel.progress != 0) {
      final _json =
          _SimklSyncModel(id: id, episodes: syncModel.progress).toJson();
      final _response = await _request.post('/sync/history', data: _json);
      if (_response.statusCode == 200)
        return syncModel;
      else
        throw new APIException(message: 'Simkl could not update the episodes');
    }

    throw UnimplementedError();
  }

  Future<int?> fetchSimklID(int malID) async {
    final _response =
        await _request.get('/search/id', queryParameters: {'mal': malID});
    if (_response.data == null || (_response.data as List).isEmpty)
      throw new APIException(
          message:
              'SIMKL does not have the ID for this anime. Is it airing yet?');
    final _id = SimklIDLookupModel.fromJson((_response.data as List).first);
    return _id.simklID;
  }

  Future<SimklNode> fetchSimklData(int simklID) async {
    final _response = await _request
        .get('/anime/$simklID', queryParameters: {'extended': 'full'});
    if (_response.statusCode == 200) {
      final _json = SimklNode.fromJson(_response.data);
      return _json;
    }
    throw new APIException(
        message: 'Simkl could not find any anime associated with this ID');
  }

  Future<List<SimklEpisodeModel>> fetchSimklEpisodes(int simklID) async {
    final _response = await _request
        .get('/anime/episodes/$simklID', queryParameters: {'extended': 'full'});
    final _data = List<SimklEpisodeModel>.from(
        _response.data.map((e) => SimklEpisodeModel.fromJson(e)).toList());
    return _data;
  }

  @override
  Future<List<AnimeListModel>> getAnimeList() async {
    final _response = await _request.get('/sync/all-items/anime');
    final List<SimklUserListModel> _list = new List<SimklUserListModel>.from(
        _response.data['anime']
            .map((e) => SimklUserListModel.fromJson(e))
            .toList());
    final List<AnimeListModel> _appList = _list.reversed
        .map((e) => AnimeListModel(
            title: e.show.title,
            status: _simklStatusToNative(e.status),
            coverImage: simklThumbnailGen(e.show.poster, isPoster: true)!,
            id: e.show.ids.id))
        .toList();
    GlobalUserStore.store.dispatch(GlobalUserActionCreator.onUpdateUserList(
        _appList, ThirdPartyTrackersEnum.simkl));
    return _appList;
  }

  static AnimeListModel? findMatch({required int id, int? malID}) {
    final _list = GlobalUserStore.store.getState().simklUserList ?? [];

    final _match = _list.where((element) => element.id == id);
    if (_match.isNotEmpty) return _match.first;
  }

  @override
  Future<void> logout() async {
    await storage.delete(key: 'simkl');
    GlobalUserStore.store.dispatch(
        GlobalUserActionCreator.removeUser(ThirdPartyTrackersEnum.simkl));
  }

  String _simklStatusToNative(String status) {
    switch (status) {
      case 'watching':
        return 'Watching';
      case 'plantowatch':
        return 'Plan to Watch';
      case 'completed':
        return 'Completed';
      case 'hold':
        return 'On Hold';
      case 'notinteresting':
        return 'Dropped';
      default:
        return status;
    }
  }
}

String _nativeToSimklStatus(String status) {
  switch (status) {
    case 'Watching':
      return 'watching';
    case 'Plan to Watch':
      return 'plantowatch';
    case 'Completed':
      return 'completed';
    case 'On Hold':
      return 'hold';
    case 'Dropped':
      return 'notinteresting';
    default:
      return status;
  }
}
