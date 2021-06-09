class UserModel {
  final String accessToken;
  final String? refreshToken;
  final DateTime? expiresIn;

  final String? username;
  final String? avatar;
  final String? background;
  final int? id;

  UserModel(
      {required this.accessToken,
      this.refreshToken,
      this.expiresIn,
      this.username,
      this.avatar,
      this.background,
      this.id});

  UserModel copyWith(
          {String? accessToken,
          String? refreshToken,
          DateTime? expiresIn,
          String? username,
          String? avatar,
          String? background,
          int? id}) =>
      UserModel(
        accessToken: accessToken ?? this.accessToken,
        refreshToken: refreshToken ?? this.refreshToken,
        expiresIn: expiresIn ?? this.expiresIn,
        username: username ?? this.username,
        background: background ?? this.background,
        avatar: avatar ?? this.avatar,
        id: id ?? this.id,
      );

  Map<String, dynamic> toMap() => {
        'accessToken': this.accessToken,
        'refreshToken': this.refreshToken,
        'expiresIn': this.expiresIn != null ? this.expiresIn.toString() : null,
        'username': this.username,
        'background': this.background,
        'avatar': this.avatar,
        'id': this.id,
      };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        accessToken: json['accessToken'],
        refreshToken:
            json['refreshToken'] != null ? json['refreshToken'] : null,
        expiresIn: (json['expiresIn'] != null && json['expiresIn'] != 'null')
            ? DateTime.parse(json['expiresIn'])
            : null,
        username: json['username'] != null ? json['username'] : null,
        avatar: json['avatar'] != null ? json['avatar'] : null,
        id: json['id'] != null ? json['id'] : null,
        background: json['background'] != null ? json['background'] : null,
      );
}
