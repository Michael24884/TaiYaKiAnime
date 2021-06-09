import 'package:taiyaki/Services/Hosts/StreamTape.dart';

import 'Base.dart';
import 'XstreamCDN.dart';

HostsBase nameToHostsBase(String name) {
  switch (name.toLowerCase().trim()) {
    case 'xstreamcdn':
      return new XstreamCDN();
    case 'streamtape':
      return new StreamTape();
    default:
      throw Exception('This host does not exist');
  }
}
