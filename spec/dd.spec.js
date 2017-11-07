'use strict';

const parser = require('../index');

describe('DD parsing', function() {

  it('should support two ints', function() {
    const coord = parser('29 95');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });
  it('should support two ints, first negative', function() {
    const coord = parser('-29 95');
    expect(coord).toEqual({lat: -29.0, lng: 95.0});
  });
  it('should support two ints, second negative', function() {
    const coord = parser('29 -95');
    expect(coord).toEqual({lat: 29.0, lng: -95.0});
  });
  it('should support two ints, both negative', function() {
    const coord = parser('-29 -95');
    expect(coord).toEqual({lat: -29.0, lng: -95.0});
  });

  it('should support two ints, North East', function() {
    const coord = parser('29N 95E');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });
  it('should support two ints, South East', function() {
    const coord = parser('29S 95E');
    expect(coord).toEqual({lat: -29.0, lng: 95.0});
  });
  it('should support two ints, negative North East', function() {
    const coord = parser('-29N 95E');
    expect(coord).toEqual({lat: -29.0, lng: 95.0});
  });
  it('should support two ints, negative South East', function() {
    const coord = parser('-29S 95E');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });

  it('should support two ints, North East', function() {
    const coord = parser('29N 95E');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });
  it('should support two ints, North West', function() {
    const coord = parser('29N 95W');
    expect(coord).toEqual({lat: 29.0, lng: -95.0});
  });
  it('should support two ints, North negative East', function() {
    const coord = parser('29N -95E');
    expect(coord).toEqual({lat: 29.0, lng: -95.0});
  });
  it('should support two ints, North negative West', function() {
    const coord = parser('29N -95W');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });

  it('should support two ints, East North', function() {
    const coord = parser('95E 29N');
    expect(coord).toEqual({lat: 29.0, lng: 95.0});
  });
  it('should support two ints, West, South', function() {
    const coord = parser('95W,29S');
    expect(coord).toEqual({lat: -29.0, lng: -95.0});
  });
  it('should support two ints, West something', function() {
    const coord = parser('95W 29');
    expect(coord).toEqual({lat: 29.0, lng: -95.0});
  });
  it('should support two ints, something South', function() {
    const coord = parser('95 29S');
    expect(coord).toEqual({lat: -29.0, lng: 95.0});
  });


  it('should support two floats', function() {
    const coord = parser('29.531 95.531');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });
  it('should support two floats deg', function() {
    const coord = parser('29.531deg 95.531deg');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });
  it('should support two floats, first negative', function() {
    const coord = parser('-29.531 95.531');
    expect(coord).toEqual({lat: -29.531, lng: 95.531});
  });
  it('should support two floats, second negative', function() {
    const coord = parser('29.531 -95.531');
    expect(coord).toEqual({lat: 29.531, lng: -95.531});
  });
  it('should support two floats, both negative', function() {
    const coord = parser('-29.531 -95.531');
    expect(coord).toEqual({lat: -29.531, lng: -95.531});
  });

  it('should support two floats, North East', function() {
    const coord = parser('29.531N 95.531E');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });
  it('should support two floats, South East', function() {
    const coord = parser('29.531S 95.531E');
    expect(coord).toEqual({lat: -29.531, lng: 95.531});
  });
  it('should support two floats, negative North East', function() {
    const coord = parser('-29.531N 95.531E');
    expect(coord).toEqual({lat: -29.531, lng: 95.531});
  });
  it('should support two floats, negative South East', function() {
    const coord = parser('-29.531S 95.531E');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });

  it('should support two floats, North East', function() {
    const coord = parser('29.531N 95.531E');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });
  it('should support two floats, North West', function() {
    const coord = parser('29.531N 95.531W');
    expect(coord).toEqual({lat: 29.531, lng: -95.531});
  });
  it('should support two floats, North negative East', function() {
    const coord = parser('29.531N -95.531E');
    expect(coord).toEqual({lat: 29.531, lng: -95.531});
  });
  it('should support two floats, North negative West', function() {
    const coord = parser('29.531N -95.531W');
    expect(coord).toEqual({lat: 29.531, lng: 95.531});
  });

});
