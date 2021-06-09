// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Trackers.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class ThirdPartyBundleIdsAdapter extends TypeAdapter<ThirdPartyBundleIds> {
  @override
  final int typeId = 3;

  @override
  ThirdPartyBundleIds read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ThirdPartyBundleIds(
      anilist: fields[0] as int,
      myanimelist: fields[1] as int,
      simkl: fields[2] as int?,
    );
  }

  @override
  void write(BinaryWriter writer, ThirdPartyBundleIds obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.anilist)
      ..writeByte(1)
      ..write(obj.myanimelist)
      ..writeByte(2)
      ..write(obj.simkl);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ThirdPartyBundleIdsAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
