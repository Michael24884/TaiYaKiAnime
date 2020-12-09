interface Point {
    x: number;
    y: number;
}
declare const cubicBezierLength: (p0: Point, p1: Point, p2: Point, p3: Point) => number;
export default cubicBezierLength;
