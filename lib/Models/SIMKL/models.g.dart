// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'models.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class SimklEpisodeModelAdapter extends TypeAdapter<SimklEpisodeModel> {
  @override
  final int typeId = 5;

  @override
  SimklEpisodeModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return SimklEpisodeModel(
      title: fields[0] as String,
      thumbnail: fields[1] as String?,
      episode: fields[5] as int,
      link: fields[2] as String?,
      description: fields[3] as String?,
      isFiller: fields[4] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, SimklEpisodeModel obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.title)
      ..writeByte(1)
      ..write(obj.thumbnail)
      ..writeByte(2)
      ..write(obj.link)
      ..writeByte(3)
      ..write(obj.description)
      ..writeByte(4)
      ..write(obj.isFiller)
      ..writeByte(5)
      ..write(obj.episode);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SimklEpisodeModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
