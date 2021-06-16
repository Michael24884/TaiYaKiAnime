import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';

class DetailBottomSheet extends StatelessWidget {
  final VoidCallback eraseLink;
  final IndividualSettingsModel individualSettingsModel;

  DetailBottomSheet(
      {required this.eraseLink, required this.individualSettingsModel});

  final TextStyle _title = TextStyle(fontWeight: FontWeight.w700, fontSize: 15);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: TaiyakiSize.height * 0.25,
      child: ListView(
        children: [
          Container(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Material(
                    child: Text('Auto sync this anime', style: _title),
                  ),
                  Material(
                      child: Switch(
                          value: individualSettingsModel.autoSync,
                          onChanged: (val) {}))
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
                onPressed: eraseLink,
                style: ElevatedButton.styleFrom(primary: Colors.red),
                child: Text(
                  'Remove saved link',
                  style: _title,
                )),
          )
        ],
      ),
    );
  }
}
