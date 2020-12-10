// @flow

import {
  childrenAsString,
  extractOpacity,
  extractStrokeJoin,
  extractStrokeCap,
  extractAlignment,
} from '../helpers';

describe('testing childrenAsString function', () => {
  it('returns a given string', () => {
    expect(childrenAsString('abc')).toBe('abc');
  });
  it('joins array of strings with \n', () => {
    let received = childrenAsString(['a', 'b', 'c', 'd']);
    expect(received.replace(new RegExp('\r?\n', 'g'), '')).toBe('abcd');
  });
});

describe('testing extractOpacity function', () => {
  it('returns 0 if visible is false', () => {
    expect(extractOpacity({visible: false})).toBe(0);
    expect(extractOpacity({visible: false, opacity: 1})).toBe(0);
    expect(extractOpacity({visible: false, opacity: 0.5})).toBe(0);
  });

  it('returns opacity if visible is true or undefined', () => {
    expect(extractOpacity({visible: true, opacity: 0.5})).toBe(0.5);
    expect(extractOpacity({opacity: 0.5})).toBe(0.5);
  });
});

describe('testing extractStrokeJoin', () => {
  const MITER = 0;
  const BEVEL = 2;
  const ROUND = 1;

  it('returns enum', () => {
    expect(extractStrokeJoin('miter')).toBe(MITER);
    expect(extractStrokeJoin('bevel')).toBe(BEVEL);
    expect(extractStrokeJoin('round')).toBe(ROUND);
  });

  it('default to round', () => {
    expect(extractStrokeJoin()).toBe(ROUND);
  });
});

describe('testing extractStrokeCap', () => {
  const BUTT = 0;
  const SQUARE = 2;
  const ROUND = 1;

  it('returns enum', () => {
    expect(extractStrokeCap('butt')).toBe(BUTT);
    expect(extractStrokeCap('square')).toBe(SQUARE);
    expect(extractStrokeCap('round')).toBe(ROUND);
  });

  it('default to round', () => {
    expect(extractStrokeCap()).toBe(ROUND);
  });
});

describe('testing extractAlignment', () => {
  const CENTER = 1;
  const RIGHT = 2;
  const LEFT = 0;

  it('returns enum', () => {
    expect(extractAlignment('center')).toBe(RIGHT);
    expect(extractAlignment('right')).toBe(CENTER);
    expect(extractAlignment('left')).toBe(LEFT);
  });

  it('default to left', () => {
    expect(extractAlignment()).toBe(LEFT);
  });
});
