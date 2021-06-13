import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'TaiyakiSize.dart';

class AnimeListStatusCards extends StatelessWidget {
  final String statusName;
  final List<AnimeListModel> data;
  final VoidCallback onTap;

  AnimeListStatusCards(
      {required this.statusName, required this.onTap, this.data = const []});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 6,
        child: Container(
          padding: const EdgeInsets.all(4.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(this.statusName,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(data.length.toString() + ' total items'),
                    ]),
              ),
              SizedBox(
                height: TaiyakiSize.height * 0.13,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 4.0, vertical: 2.0),
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    physics: NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    children: List.generate(3, (index) {
                      if (data.length >= 3) return data[index];
                      return data.first;
                    })
                        .map((i) => Container(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 2.0,
                                vertical: 2.0,
                              ),
                              child: TaiyakiImage(
                                  url: i.coverImage,
                                  width: TaiyakiSize.height * 0.09,
                                  height: TaiyakiSize.height * 0.05),
                            ))
                        .toList(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
