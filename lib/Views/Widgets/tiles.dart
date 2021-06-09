import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

class Tiles extends StatelessWidget {
  final String image;
  final String title;
  // final int? id;

  final VoidCallback onTap;

  Tiles({
    required this.image,
    required this.onTap,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Container(
          height: TaiyakiSize.height * 0.15,
          width: TaiyakiSize.width * 0.9,
          child: Row(
            children: [
              TaiyakiImage(
                url: image,
                height: TaiyakiSize.height * 0.15,
                width: TaiyakiSize.height * 0.12,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6.0),
                child: SizedBox(
                  width: TaiyakiSize.height * 0.33,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(fontWeight: FontWeight.w600),
                        maxLines: 3,
                      )
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

class SourceTiles extends StatelessWidget {
  // final String image;
  final String name;
  final String dev;
  // final int? id;

  final VoidCallback onTap;

  SourceTiles({
    // required this.image,
    required this.onTap,
    required this.name,
    this.dev = 'Taiyaki',
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Container(
          height: TaiyakiSize.height * 0.15,
          width: TaiyakiSize.width * 0.9,
          child: Row(
            children: [
              // TaiyakiImage(
              //   url: image,
              //   height: TaiyakiSize.height * 0.15,
              //   width: TaiyakiSize.height * 0.12,
              // ),
              Container(
                width: TaiyakiSize.height * 0.12,
                height: TaiyakiSize.height * 0.15,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6.0),
                child: SizedBox(
                  width: TaiyakiSize.height * 0.33,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 17),
                        maxLines: 3,
                      ),
                      Text(
                        dev,
                        style: TextStyle(fontWeight: FontWeight.w400),
                        maxLines: 1,
                      )
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
