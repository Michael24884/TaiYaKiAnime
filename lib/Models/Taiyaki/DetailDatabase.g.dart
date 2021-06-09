// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'DetailDatabase.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DetailDatabaseModelAdapter extends TypeAdapter<DetailDatabaseModel> {
  @override
  final int typeId = 1;

  @override
  DetailDatabaseModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DetailDatabaseModel(
      title: fields[0] as String,
      isFollowing: fields[8] as bool?,
      notification: fields[12] as bool?,
      sourceName: fields[7] as String?,
      individualSettingsModel: fields[11] as IndividualSettingsModel?,
      coverImage: fields[1] as String,
      episodeProgress: (fields[6] as Map?)?.cast<int, double>(),
      ids: fields[3] as ThirdPartyBundleIds,
      lastWatchingModel: fields[4] as LastWatchingModel?,
      episodeCount: fields[9] as int?,
      totalEpisodes: fields[10] as int?,
      seekTo: (fields[13] as Map?)?.cast<int, int>(),
      link: fields[2] as String?,
      createdAt: fields[5] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, DetailDatabaseModel obj) {
    writer
      ..writeByte(14)
      ..writeByte(0)
      ..write(obj.title)
      ..writeByte(1)
      ..write(obj.coverImage)
      ..writeByte(2)
      ..write(obj.link)
      ..writeByte(3)
      ..write(obj.ids)
      ..writeByte(4)
      ..write(obj.lastWatchingModel)
      ..writeByte(5)
      ..write(obj.createdAt)
      ..writeByte(6)
      ..write(obj.episodeProgress)
      ..writeByte(13)
      ..write(obj.seekTo)
      ..writeByte(7)
      ..write(obj.sourceName)
      ..writeByte(8)
      ..write(obj.isFollowing)
      ..writeByte(9)
      ..write(obj.episodeCount)
      ..writeByte(10)
      ..write(obj.totalEpisodes)
      ..writeByte(11)
      ..write(obj.individualSettingsModel)
      ..writeByte(12)
      ..write(obj.notification);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DetailDatabaseModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class LastWatchingModelAdapter extends TypeAdapter<LastWatchingModel> {
  @override
  final int typeId = 2;

  @override
  LastWatchingModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return LastWatchingModel(
      watchingEpisode: fields[0] as SimklEpisodeModel,
      progress: fields[1] as double,
    );
  }

  @override
  void write(BinaryWriter writer, LastWatchingModel obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.watchingEpisode)
      ..writeByte(1)
      ..write(obj.progress);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LastWatchingModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class HistoryModelAdapter extends TypeAdapter<HistoryModel> {
  @override
  final int typeId = 4;

  @override
  HistoryModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return HistoryModel(
      title: fields[0] as String,
      coverImage: fields[1] as String,
      sourceName: fields[2] as String,
      id: fields[3] as int,
      lastModified: fields[4] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, HistoryModel obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.title)
      ..writeByte(1)
      ..write(obj.coverImage)
      ..writeByte(2)
      ..write(obj.sourceName)
      ..writeByte(3)
      ..write(obj.id)
      ..writeByte(4)
      ..write(obj.lastModified);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is HistoryModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class IndividualSettingsModelAdapter
    extends TypeAdapter<IndividualSettingsModel> {
  @override
  final int typeId = 6;

  @override
  IndividualSettingsModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return IndividualSettingsModel(
      autoSync: fields[0] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, IndividualSettingsModel obj) {
    writer
      ..writeByte(1)
      ..writeByte(0)
      ..write(obj.autoSync);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is IndividualSettingsModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
