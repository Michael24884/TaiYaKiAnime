import 'package:fish_redux/fish_redux.dart';

class CharacterCellsState implements Cloneable<CharacterCellsState> {
  String? role;
  String? name;
  String? image;

  CharacterCellsState({this.role, this.image, this.name});

  @override
  CharacterCellsState clone() {
    return CharacterCellsState()
      ..name = name
      ..role = role
      ..image = image;
  }
}
