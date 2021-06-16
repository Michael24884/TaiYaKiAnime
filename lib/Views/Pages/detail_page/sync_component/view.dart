import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Views/Pages/detail_page/sync_component/action.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/update_page.dart';

import 'state.dart';

Widget buildView(SyncState state, Dispatch dispatch, ViewService viewService) {
  return (state.simklSync == null &&
          state.malSync == null &&
          state.anilistSync == null)
      ? Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.verified_user,
                size: 75,
              ),
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Text(
                    'Sign in to a tracker in Settings to start keeping track of what you watch',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
              ),
            ],
          ),
        )
      : ListView(
          children: [
            if (state.anilistSync != null)
              _SyncCards(
                name: 'Anilist',
                iconName: 'assets/images/anilist_icon.png',
                model: SyncModel(
                  progress: state.anilistSync?.progress,
                  episodes: state.anilistSync?.episodes ?? 0,
                  score: state.anilistSync?.score,
                  status: state.anilistSync?.status,
                ),
                tracker: ThirdPartyTrackersEnum.anilist,
                id: state.ids.anilist,
                onUpdateAnilist: (SyncModel model) =>
                    dispatch(SyncActionCreator.onUpdateAnilist(model)),
              ),
            if (state.malSync != null)
              _SyncCards(
                name: 'MyAnimeList',
                iconName: 'assets/images/mal_icon.png',
                model: SyncModel(
                  progress: state.malSync?.progress,
                  episodes: state.malSync?.episodes,
                  score: state.malSync?.score,
                  status: state.malSync?.status,
                ),
                id: state.ids.myanimelist,
                tracker: ThirdPartyTrackersEnum.myanimelist,
                onUpdateMAL: (SyncModel model) =>
                    dispatch(SyncActionCreator.onUpdateMAL(model)),
              ),
            if (state.simklSync != null)
              _SyncCards(
                name: 'Simkl',
                iconName: 'assets/images/simkl_icon.png',
                model: SyncModel(
                  progress: state.simklSync?.progress,
                  episodes: state.simklSync?.episodes,
                  score: state.simklSync?.score,
                  status: state.simklSync?.status,
                ),
                id: state.ids.simkl,
                tracker: ThirdPartyTrackersEnum.simkl,
              ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: SizedBox(
                  height: TaiyakiSize.height * 0.06,
                  child: ElevatedButton(
                      onPressed: () => showCupertinoModalBottomSheet(
                          context: viewService.context,
                          builder: (BuildContext context) => UpdatePage(
                                id: 0,
                                syncModel: state.anilistSync ??
                                    state.malSync ??
                                    state.simklSync ??
                                    SyncModel(progress: 0),
                                bulkIds: state.ids,
                                onUpdateAnilist: (model) {
                                  if (model != null)
                                    dispatch(SyncActionCreator.onUpdateAnilist(
                                        model));
                                },
                                onUpdateSimkl: (model) {
                                  if (model != null)
                                    dispatch(
                                        SyncActionCreator.onUpdateSimkl(model));
                                },
                                onUpdateMAL: (model) {
                                  if (model != null)
                                    dispatch(
                                        SyncActionCreator.onUpdateMAL(model));
                                },
                              )),
                      child: Text(
                        'Update All',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 17),
                      ))),
            )
          ],
        );
}

class _SyncCards extends StatelessWidget {
  final String iconName;
  final String name;
  final SyncModel model;
  final int? id;
  final ThirdPartyTrackersEnum tracker;

  final Function(SyncModel)? onUpdateAnilist;
  final Function(SyncModel)? onUpdateMAL;
  final Function(SyncModel)? onUpdateSIMKL;

  _SyncCards(
      {required this.name,
      required this.model,
      required this.tracker,
      required this.iconName,
      this.onUpdateMAL,
      this.onUpdateAnilist,
      this.onUpdateSIMKL,
      required this.id});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Row(
                children: [
                  SizedBox(
                      height: TaiyakiSize.height * 0.08,
                      width: TaiyakiSize.height * 0.08,
                      child: Image.asset(iconName)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text(name,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 21)),
                  ),
                ],
              ),
              _InfoRow(
                title: 'Status',
                data: model.status,
              ),
              _InfoRow(
                title: 'Progress',
                data:
                    '${model.progress ?? 0} / ${(model.episodes == null || model.episodes == 0) ? '??' : model.episodes}',
              ),
              _InfoRow(
                title: 'Score',
                data: '${model.score ?? 0}',
              ),
              Align(
                alignment: Alignment.bottomRight,
                child: ElevatedButton(
                  onPressed: () => id != null
                      ? showCupertinoModalBottomSheet(
                          context: context,
                          builder: (BuildContext context) => UpdatePage(
                                id: id!,
                                syncModel: model,
                                tracker: tracker,
                                onUpdateAnilist: (model) {
                                  if (model != null) onUpdateAnilist!(model);
                                },
                                onUpdateSimkl: (model) {
                                  if (model != null) onUpdateSIMKL!(model);
                                },
                                onUpdateMAL: (model) {
                                  if (model != null) onUpdateMAL!(model);
                                },
                              ))
                      : null,
                  child: Text('Edit'),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String? data;

  _InfoRow({required this.title, this.data});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
              Container(
                  constraints:
                      BoxConstraints(maxWidth: TaiyakiSize.height * 0.26),
                  child: Text(
                    data ?? 'N/A',
                    textAlign: TextAlign.right,
                  )),
            ],
          ),
        ),
        Divider(),
      ],
    );
  }
}
