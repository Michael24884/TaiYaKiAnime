class APIException implements Exception {
  final String message;

  APIException({required this.message});

  @override
  String toString() {
    return this.message.toString();
  }
}

class SourceException implements Exception {
  final String error;

  SourceException({required this.error});

  @override
  String toString() {
    return error;
  }
}

class HostsException implements Exception {
  final String error;

  HostsException({required this.error});

  @override
  String toString() {
    return error;
  }
}
