export default class Dimension {
  static size = {height: 0, width: 0};

  static init(v: {height: number; width: number}) {
    Dimension.size = v;
  }
}
