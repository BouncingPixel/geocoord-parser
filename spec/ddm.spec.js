'use strict';

const parser = require('../index');

describe('DDM parsing', function() {

  it('29 30 95', function() {
    const coord = parser('29 30 95');
    expect(coord).toEqual({lat: 29.5, lng: 95.0});
  });
  it('29 95 30', function() {
    const coord = parser('29 95 30');
    expect(coord).toEqual({lat: 29.0, lng: 95.5});
  });
  it('29.5 95 30', function() {
    const coord = parser('29.5 95 30');
    expect(coord).toEqual({lat: 29.5, lng: 95.5});
  });
  it('29 30 95.5', function() {
    const coord = parser('29 30 95.5');
    expect(coord).toEqual({lat: 29.5, lng: 95.5});
  });
  it('29 30 95 30', function() {
    const coord = parser('29 30 95 30');
    expect(coord).toEqual({lat: 29.5, lng: 95.5});
  });
  it('29deg 30min 95° 30\'', function() {
    const coord = parser('29deg 30min 95° 30\'');
    expect(coord).toEqual({lat: 29.5, lng: 95.5});
  });
  it('29deg 30.5min 95degrees 30minutes', function() {
    const coord = parser('29deg 30.5min 95degrees 30minutes');
    expect(coord).toEqual({lat: 29 + (30.5 / 60), lng: 95.5});
  });
  it('29 30.15 95 30.15', function() {
    const coord = parser('29 30.15 95 30.15');
    expect(coord).toEqual({lat: 29 + (30.15 / 60), lng: 95 + (30.15 / 60)});
  });

  it('-29 30.15 95 30.15', function() {
    const coord = parser('-29 30.15 95 30.15');
    expect(coord).toEqual({lat: -29 - (30.15 / 60), lng: 95 + (30.15 / 60)});
  });
  it('-29 30.15 -95 30.15', function() {
    const coord = parser('-29 30.15 -95 30.15');
    expect(coord).toEqual({lat: -29 - (30.15 / 60), lng: -95 - (30.15 / 60)});
  });
  it('29 30.15 -95 30.15', function() {
    const coord = parser('29 30.15 -95 30.15');
    expect(coord).toEqual({lat: 29 + (30.15 / 60), lng: -95 - (30.15 / 60)});
  });

  it('29 30.15N 95 30.15E', function() {
    const coord = parser('29 30.15N 95 30.15E');
    expect(coord).toEqual({lat: 29 + (30.15 / 60), lng: 95 + (30.15 / 60)});
  });
  it('29 30.15S 95 30.15W', function() {
    const coord = parser('29 30.15S 95 30.15W');
    expect(coord).toEqual({lat: -29 - (30.15 / 60), lng: -95 - (30.15 / 60)});
  });
  it('-29 30.15S -95 30.15W', function() {
    const coord = parser('-29 30.15S -95 30.15W');
    expect(coord).toEqual({lat: 29 + (30.15 / 60), lng: 95 + (30.15 / 60)});
  });
  it('-29 30.15N -95 30.15E', function() {
    const coord = parser('-29 30.15N -95 30.15E');
    expect(coord).toEqual({lat: -29 - (30.15 / 60), lng: -95 - (30.15 / 60)});
  });

});
