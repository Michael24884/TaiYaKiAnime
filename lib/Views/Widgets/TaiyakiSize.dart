class TaiyakiSize {
  static double _height = 0.0;
  static double _width = 0.0;

  set setWidth(double width) {
    if (_width == 0.0) _width = width;
  }

  set setHeight(double height) {
    if (_height == 0.0) _height = height;
  }

  static get height => _height;
  static get width => _width;
}
