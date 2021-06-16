import 'package:taiyaki/Models/Taiyaki/Sync.dart';

enum AnilistPageFilterEnum {
  trending,
  popularity,
  justAdded,
}

class AnilistMediaModel {
  final String name;
  final bool isAdult;
  AnilistMediaModel({required this.name, required this.isAdult});
  factory AnilistMediaModel.fromJson(Map<String, dynamic> json) =>
      AnilistMediaModel(name: json['name'], isAdult: json['isAdult']);
}

class AnilistGraphTypes {
  static String PagedData(AnilistPageFilterEnum type) {
    String filter;
    switch (type) {
      case AnilistPageFilterEnum.popularity:
        filter = 'POPULARITY_DESC';
        break;
      case AnilistPageFilterEnum.trending:
        filter = 'TRENDING_DESC';
        break;
      case AnilistPageFilterEnum.justAdded:
        filter = 'END_DATE_DESC';
        break;
    }
    return '''
    query {
  Page{
    media(sort: $filter, type: ANIME, isAdult: false) {
      title{romaji}
      coverImage{extraLarge}
      id
    }
  }
}
    ''';
  }

  static String grabUserList(String name, int id) {
    return '''
    query {
  MediaListCollection(userName:"$name", userId: $id, type:ANIME, sort: UPDATED_TIME_DESC){
    lists {
      status
      entries{
        media{
        isAdult
          title{romaji}
          coverImage{extraLarge}
          id
          episodes
          mediaListEntry{score status progress}
        }
      }
    }
  } }
    ''';
  }

  static String grabViewerStats() {
    return '''
    query {
	Viewer {
    statistics {
      anime {
        genres {
          genre
          count
        }
        count
        episodesWatched
      }
    }
  }  
}''';
  }

  static String getUserProfile() {
    return ''' 
query {
  Viewer{
    id
    name
    bannerImage
    avatar {
      large
      medium
    }
  }
}
    ''';
  }

  static String updateMedia(int id, SyncModel model) {
    final _anilistModel = model.toAnilist();
    String? status;
    switch (model.status) {
      case 'Watching':
        status = 'CURRENT';
        break;
      case 'Plan to Watch':
        status = 'PLANNING';
        break;
      case 'On Hold':
        status = 'PAUSED';
        break;
      case 'Completed':
        status = 'COMPLETED';
        break;
      case 'Dropped':
        status = 'DROPPED';
        break;
    }
    String anilist = '';
    if (_anilistModel.score != null) anilist += 'score: ${model.score}, ';
    if (_anilistModel.progress != null)
      anilist += 'progress: ${model.progress}, ';
    if (status != null) anilist += 'status: $status, ';

    return '''    
mutation {
  SaveMediaListEntry(mediaId: $id, $anilist ) {
    score
    status
    progress
  }
}

    ''';
  }

  static String searchData(
      {String? query,
      int? year,
      String? season,
      required List<String> genres,
      required List<String> tags}) {
    String params = '';

    if (query != null) params += 'search: "$query", ';
    if (year != null) params += 'seasonYear: $year, ';
    if (season != null && season != 'All') params += 'season: $season';
    if (genres.isNotEmpty)
      params += 'genre_in: [${genres.map((e) => "\"$e\"").join(', ')}]';
    if (tags.isNotEmpty)
      params += 'tag_in: [${tags.map((e) => "\"$e\"").join(', ')}]';

    return '''
    query {
 Page {
  media(type: ANIME, isAdult: false, $params) {
    title{romaji}
    coverImage{extraLarge}
    id
    description
  }
}
}
    ''';
  }

  static String followerActivities = '''
   query {
	Page(perPage: 8){
    activities(isFollowing: true, type:ANIME_LIST, sort:ID_DESC){
      ... on ListActivity{
        status
        progress
        user{
          avatar{large}
          name
          id
        }
        media{
          title{romaji}
          coverImage{extraLarge}
          id
          isAdult
        }
      }
    }
  }
}
  ''';

  static String fetchEntry(int id, {int? idMal}) {
    String query;
    if (idMal != null)
      query = 'idMal: $idMal';
    else
      query = 'id: $id';

    return '''
    query{
    Media($query, type: ANIME) {
     mediaListEntry	 {
      id
      score(format:POINT_10)
      status
      progress
    }
    }
    }
    ''';
  }

  static String detailData(int id, {int? idMal}) {
    String query;
    if (idMal != null)
      query = 'idMal: $idMal';
    else
      query = 'id: $id';

    return '''
    query {
  Media($query, type: ANIME) {
    id
    idMal
    title{romaji english}
    coverImage{color extraLarge}
    bannerImage
    description
    genres
     episodes
    meanScore
    status
    source
    duration
    type
      
      countryOfOrigin
      hashtag
      season
      seasonYear
      
    nextAiringEpisode{
      episode
      timeUntilAiring
    }
    
    mediaListEntry	 {
      id
      score(format:POINT_10)
      status
      progress
    }
    characters(sort:ROLE){
  edges{
    role
    node{
      name{full}
      id
      image{large}
    }
  }
}

recommendations(sort:RATING_DESC){
  nodes{
    mediaRecommendation{
      id
      title{romaji}
      coverImage{extraLarge}
    }
  }
}

 trends(releasing:true, sort:EPISODE_DESC){
       nodes{
        episode
        popularity
        averageScore
        
      }
    }

stats{
      scoreDistribution {
        score
        amount
      }
      statusDistribution {
        status
        amount
      }
    }
    
    
  }
}
    ''';
  }

  static List<String> anilistSeasons = [
    "All",
    'WINTER',
    'SPRING',
    'SUMMER',
    'FALL'
  ];

  static List<String> anilistGenres = [
    "All",
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller"
  ];

  static List<String> anilistTags() {
    final _list = [
      {
        "name": "All",
        "isAdult": false,
      },
      {"name": "4-koma", "isAdult": false},
      {"name": "Achromatic", "isAdult": false},
      {"name": "Achronological Order", "isAdult": false},
      {"name": "Acting", "isAdult": false},
      {"name": "Advertisement", "isAdult": false},
      {"name": "Afterlife", "isAdult": false},
      {"name": "Age Gap", "isAdult": false},
      {"name": "Age Regression", "isAdult": false},
      {"name": "Agender", "isAdult": false},
      {"name": "Ahegao", "isAdult": true},
      {"name": "Airsoft", "isAdult": false},
      {"name": "Aliens", "isAdult": false},
      {"name": "Alternate Universe", "isAdult": false},
      {"name": "American Football", "isAdult": false},
      {"name": "Amnesia", "isAdult": false},
      {"name": "Amputation", "isAdult": true},
      {"name": "Anachronism", "isAdult": false},
      {"name": "Anal Sex", "isAdult": true},
      {"name": "Animals", "isAdult": false},
      {"name": "Anthology", "isAdult": false},
      {"name": "Anti-Hero", "isAdult": false},
      {"name": "Archery", "isAdult": false},
      {"name": "Armpits", "isAdult": true},
      {"name": "Artificial Intelligence", "isAdult": false},
      {"name": "Asexual", "isAdult": false},
      {"name": "Ashikoki", "isAdult": true},
      {"name": "Asphyxiation", "isAdult": true},
      {"name": "Assassins", "isAdult": false},
      {"name": "Astronomy", "isAdult": false},
      {"name": "Athletics", "isAdult": false},
      {"name": "Augmented Reality", "isAdult": false},
      {"name": "Autobiographical", "isAdult": false},
      {"name": "Aviation", "isAdult": false},
      {"name": "Badminton", "isAdult": false},
      {"name": "Band", "isAdult": false},
      {"name": "Bar", "isAdult": false},
      {"name": "Baseball", "isAdult": false},
      {"name": "Basketball", "isAdult": false},
      {"name": "Battle Royale", "isAdult": false},
      {"name": "Biographical", "isAdult": false},
      {"name": "Bisexual", "isAdult": false},
      {"name": "Blackmail", "isAdult": true},
      {"name": "Body Horror", "isAdult": false},
      {"name": "Body Swapping", "isAdult": false},
      {"name": "Bondage", "isAdult": true},
      {"name": "Boobjob", "isAdult": true},
      {"name": "Boxing", "isAdult": false},
      {"name": "Boys' Love", "isAdult": false},
      {"name": "Bullying", "isAdult": false},
      {"name": "Butler", "isAdult": false},
      {"name": "Calligraphy", "isAdult": false},
      {"name": "Cannibalism", "isAdult": false},
      {"name": "Card Battle", "isAdult": false},
      {"name": "Cars", "isAdult": false},
      {"name": "Centaur", "isAdult": false},
      {"name": "CGI", "isAdult": false},
      {"name": "Cheerleading", "isAdult": false},
      {"name": "Chibi", "isAdult": false},
      {"name": "Chimera", "isAdult": false},
      {"name": "Chuunibyou", "isAdult": false},
      {"name": "Circus", "isAdult": false},
      {"name": "Classic Literature", "isAdult": false},
      {"name": "College", "isAdult": false},
      {"name": "Coming of Age", "isAdult": false},
      {"name": "Conspiracy", "isAdult": false},
      {"name": "Cosmic Horror", "isAdult": false},
      {"name": "Cosplay", "isAdult": false},
      {"name": "Crime", "isAdult": false},
      {"name": "Crossdressing", "isAdult": false},
      {"name": "Crossover", "isAdult": false},
      {"name": "Cult", "isAdult": false},
      {"name": "Cultivation", "isAdult": false},
      {"name": "Cunnilingus", "isAdult": true},
      {"name": "Cute Girls Doing Cute Things", "isAdult": false},
      {"name": "Cyberpunk", "isAdult": false},
      {"name": "Cycling", "isAdult": false},
      {"name": "Dancing", "isAdult": false},
      {"name": "Death Game", "isAdult": false},
      {"name": "Defloration", "isAdult": true},
      {"name": "Delinquents", "isAdult": false},
      {"name": "Demons", "isAdult": false},
      {"name": "Denpa", "isAdult": false},
      {"name": "Detective", "isAdult": false},
      {"name": "Dinosaurs", "isAdult": false},
      {"name": "Dissociative Identities", "isAdult": false},
      {"name": "Dragons", "isAdult": false},
      {"name": "Drawing", "isAdult": false},
      {"name": "Drugs", "isAdult": false},
      {"name": "Dullahan", "isAdult": false},
      {"name": "Dungeon", "isAdult": false},
      {"name": "Dystopian", "isAdult": false},
      {"name": "Economics", "isAdult": false},
      {"name": "Educational", "isAdult": false},
      {"name": "Elf", "isAdult": false},
      {"name": "Ensemble Cast", "isAdult": false},
      {"name": "Environmental", "isAdult": false},
      {"name": "Episodic", "isAdult": false},
      {"name": "Ero Guro", "isAdult": false},
      {"name": "Espionage", "isAdult": false},
      {"name": "Exhibitionism", "isAdult": true},
      {"name": "Facial", "isAdult": true},
      {"name": "Fairy Tale", "isAdult": false},
      {"name": "Family Life", "isAdult": false},
      {"name": "Fashion", "isAdult": false},
      {"name": "Feet", "isAdult": true},
      {"name": "Fellatio", "isAdult": true},
      {"name": "Female Protagonist", "isAdult": false},
      {"name": "Firefighters", "isAdult": false},
      {"name": "Fishing", "isAdult": false},
      {"name": "Fitness", "isAdult": false},
      {"name": "Flash", "isAdult": false},
      {"name": "Flat Chest", "isAdult": true},
      {"name": "Food", "isAdult": false},
      {"name": "Football", "isAdult": false},
      {"name": "Foreign", "isAdult": false},
      {"name": "Fugitive", "isAdult": false},
      {"name": "Full CGI", "isAdult": false},
      {"name": "Full Color", "isAdult": false},
      {"name": "Futanari", "isAdult": true},
      {"name": "Gambling", "isAdult": false},
      {"name": "Gangs", "isAdult": false},
      {"name": "Gender Bending", "isAdult": false},
      {"name": "Ghost", "isAdult": false},
      {"name": "Go", "isAdult": false},
      {"name": "Goblin", "isAdult": false},
      {"name": "Gods", "isAdult": false},
      {"name": "Golf", "isAdult": false},
      {"name": "Gore", "isAdult": false},
      {"name": "Group Sex", "isAdult": true},
      {"name": "Guns", "isAdult": false},
      {"name": "Gyaru", "isAdult": false},
      {"name": "Handjob", "isAdult": true},
      {"name": "Harem", "isAdult": false},
      {"name": "Henshin", "isAdult": false},
      {"name": "Hikikomori", "isAdult": false},
      {"name": "Historical", "isAdult": false},
      {"name": "Human Pet", "isAdult": true},
      {"name": "Ice Skating", "isAdult": false},
      {"name": "Idol", "isAdult": false},
      {"name": "Incest", "isAdult": true},
      {"name": "Irrumatio", "isAdult": true},
      {"name": "Isekai", "isAdult": false},
      {"name": "Iyashikei", "isAdult": false},
      {"name": "Josei", "isAdult": false},
      {"name": "Kaiju", "isAdult": false},
      {"name": "Karuta", "isAdult": false},
      {"name": "Kemonomimi", "isAdult": false},
      {"name": "Kids", "isAdult": false},
      {"name": "Kuudere", "isAdult": false},
      {"name": "Lacrosse", "isAdult": false},
      {"name": "Lactation", "isAdult": true},
      {"name": "Language Barrier", "isAdult": false},
      {"name": "Large Breasts", "isAdult": true},
      {"name": "LGBTQ+ Themes", "isAdult": false},
      {"name": "Lost Civilization", "isAdult": false},
      {"name": "Love Triangle", "isAdult": false},
      {"name": "Mafia", "isAdult": false},
      {"name": "Magic", "isAdult": false},
      {"name": "Mahjong", "isAdult": false},
      {"name": "Maids", "isAdult": false},
      {"name": "Male Protagonist", "isAdult": false},
      {"name": "Martial Arts", "isAdult": false},
      {"name": "Masturbation", "isAdult": true},
      {"name": "Medicine", "isAdult": false},
      {"name": "Memory Manipulation", "isAdult": false},
      {"name": "Mermaid", "isAdult": false},
      {"name": "Meta", "isAdult": false},
      {"name": "MILF", "isAdult": true},
      {"name": "Military", "isAdult": false},
      {"name": "Monster Girl", "isAdult": false},
      {"name": "Mopeds", "isAdult": false},
      {"name": "Motorcycles", "isAdult": false},
      {"name": "Musical", "isAdult": false},
      {"name": "Mythology", "isAdult": false},
      {"name": "Nakadashi", "isAdult": true},
      {"name": "Nekomimi", "isAdult": false},
      {"name": "Netorare", "isAdult": true},
      {"name": "Netorase", "isAdult": true},
      {"name": "Netori", "isAdult": true},
      {"name": "Ninja", "isAdult": false},
      {"name": "No Dialogue", "isAdult": false},
      {"name": "Noir", "isAdult": false},
      {"name": "Nudity", "isAdult": false},
      {"name": "Nun", "isAdult": false},
      {"name": "Office Lady", "isAdult": false},
      {"name": "Oiran", "isAdult": false},
      {"name": "Ojou-sama", "isAdult": false},
      {"name": "Omegaverse", "isAdult": true},
      {"name": "Otaku Culture", "isAdult": false},
      {"name": "Outdoor", "isAdult": false},
      {"name": "Pandemic", "isAdult": false},
      {"name": "Parody", "isAdult": false},
      {"name": "Philosophy", "isAdult": false},
      {"name": "Photography", "isAdult": false},
      {"name": "Pirates", "isAdult": false},
      {"name": "Poker", "isAdult": false},
      {"name": "Police", "isAdult": false},
      {"name": "Politics", "isAdult": false},
      {"name": "Post-Apocalyptic", "isAdult": false},
      {"name": "POV", "isAdult": false},
      {"name": "Pregnant", "isAdult": true},
      {"name": "Primarily Adult Cast", "isAdult": false},
      {"name": "Primarily Child Cast", "isAdult": false},
      {"name": "Primarily Female Cast", "isAdult": false},
      {"name": "Primarily Male Cast", "isAdult": false},
      {"name": "Prostitution", "isAdult": true},
      {"name": "Public Sex", "isAdult": true},
      {"name": "Puppetry", "isAdult": false},
      {"name": "Rakugo", "isAdult": false},
      {"name": "Rape", "isAdult": true},
      {"name": "Real Robot", "isAdult": false},
      {"name": "Rehabilitation", "isAdult": false},
      {"name": "Reincarnation", "isAdult": false},
      {"name": "Revenge", "isAdult": false},
      {"name": "Reverse Harem", "isAdult": false},
      {"name": "Rimjob", "isAdult": true},
      {"name": "Robots", "isAdult": false},
      {"name": "Rotoscoping", "isAdult": false},
      {"name": "Rugby", "isAdult": false},
      {"name": "Rural", "isAdult": false},
      {"name": "Sadism", "isAdult": true},
      {"name": "Samurai", "isAdult": false},
      {"name": "Satire", "isAdult": false},
      {"name": "Scat", "isAdult": true},
      {"name": "School", "isAdult": false},
      {"name": "School Club", "isAdult": false},
      {"name": "Scuba Diving", "isAdult": false},
      {"name": "Seinen", "isAdult": false},
      {"name": "Sex Toys", "isAdult": true},
      {"name": "Shapeshifting", "isAdult": false},
      {"name": "Ships", "isAdult": false},
      {"name": "Shogi", "isAdult": false},
      {"name": "Shoujo", "isAdult": false},
      {"name": "Shounen", "isAdult": false},
      {"name": "Shrine Maiden", "isAdult": false},
      {"name": "Skateboarding", "isAdult": false},
      {"name": "Skeleton", "isAdult": false},
      {"name": "Slapstick", "isAdult": false},
      {"name": "Slavery", "isAdult": false},
      {"name": "Software Development", "isAdult": false},
      {"name": "Space", "isAdult": false},
      {"name": "Space Opera", "isAdult": false},
      {"name": "Steampunk", "isAdult": false},
      {"name": "Stop Motion", "isAdult": false},
      {"name": "Succubus", "isAdult": false},
      {"name": "Sumata", "isAdult": true},
      {"name": "Super Power", "isAdult": false},
      {"name": "Super Robot", "isAdult": false},
      {"name": "Superhero", "isAdult": false},
      {"name": "Surfing", "isAdult": false},
      {"name": "Surreal Comedy", "isAdult": false},
      {"name": "Survival", "isAdult": false},
      {"name": "Sweat", "isAdult": true},
      {"name": "Swimming", "isAdult": false},
      {"name": "Swordplay", "isAdult": false},
      {"name": "Table Tennis", "isAdult": false},
      {"name": "Tanks", "isAdult": false},
      {"name": "Tanned Skin", "isAdult": false},
      {"name": "Teacher", "isAdult": false},
      {"name": "Teens' Love", "isAdult": false},
      {"name": "Tennis", "isAdult": false},
      {"name": "Tentacles", "isAdult": true},
      {"name": "Terrorism", "isAdult": false},
      {"name": "Threesome", "isAdult": true},
      {"name": "Time Manipulation", "isAdult": false},
      {"name": "Time Skip", "isAdult": false},
      {"name": "Tokusatsu", "isAdult": false},
      {"name": "Tomboy", "isAdult": false},
      {"name": "Tragedy", "isAdult": false},
      {"name": "Trains", "isAdult": false},
      {"name": "Triads", "isAdult": false},
      {"name": "Tsundere", "isAdult": false},
      {"name": "Twins", "isAdult": false},
      {"name": "Urban", "isAdult": false},
      {"name": "Urban Fantasy", "isAdult": false},
      {"name": "Urination", "isAdult": true},
      {"name": "Vampire", "isAdult": false},
      {"name": "Video Games", "isAdult": false},
      {"name": "Vikings", "isAdult": false},
      {"name": "Villainess", "isAdult": false},
      {"name": "Virginity", "isAdult": true},
      {"name": "Virtual World", "isAdult": false},
      {"name": "Volleyball", "isAdult": false},
      {"name": "Vore", "isAdult": true},
      {"name": "Voyeur", "isAdult": true},
      {"name": "War", "isAdult": false},
      {"name": "Werewolf", "isAdult": false},
      {"name": "Witch", "isAdult": false},
      {"name": "Work", "isAdult": false},
      {"name": "Wrestling", "isAdult": false},
      {"name": "Writing", "isAdult": false},
      {"name": "Wuxia", "isAdult": false},
      {"name": "Yakuza", "isAdult": false},
      {"name": "Yandere", "isAdult": false},
      {"name": "Youkai", "isAdult": false},
      {"name": "Yuri", "isAdult": false},
      {"name": "Zombie", "isAdult": false}
    ];
    final List<AnilistMediaModel> _model = List<AnilistMediaModel>.from(
        _list.map((i) => AnilistMediaModel.fromJson(i)).toList());
    return _model
        .where((element) => element.isAdult == false)
        .map((i) => i.name)
        .toList();
  }

  static List<String> anilistMediaFormat = [
    'TV',
    'TV_SHORT',
    'MOVIE',
    'SPECIAL',
    'OVA',
    'ONA',
    'MUSIC',
  ];
}
