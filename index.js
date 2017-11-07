/*

need 1 look ahead to check if the num is already decided as something:
NUM° -> degrees
NUM' -> minutes
NUM" -> seconds

once all slots are full, then move to next value
N|S|E|W always closes off the value
comma always closes off the value
a NUM that is a float always closes off the value
a value > 60 for min or seconds assume should be part of next number
  if cannot, then it is invalid
if running out of input, assume value complete
if token is out of order (is deg and last was deg), then assume move to next number
if have all numbers, but still remaining, then assume invalid

*/

function parsePart(str) {
  if (!str) {
    return null;
  }

  const knowndeg = /^(-?[0-9]+)(\.[0-9]*)?\s*(?:°|de?g?r?e?e?s?)$/i;
  const knownmin = /^(-?[0-9]+)(\.[0-9]*)?\s*(?:'|mi?n?u?t?e?s?)$/i;
  const knownsec = /^(-?[0-9]+)(\.[0-9]*)?\s*(?:"|se?c?o?n?d?s?)$/i;

  const floatnum = /^(-?[0-9]+\.[0-9]*)$/;
  const intnum = /^(-?[0-9]+)$/;
  const dir = /^([NSEW])$/i;

  const degMatch = str.match(knowndeg);
  const minMatch = str.match(knownmin);
  const secMatch = str.match(knownsec);
  const floatMatch = str.match(floatnum);
  const intMatch = str.match(intnum);
  const dirMatch = str.match(dir);

  if (degMatch) {
    const isFloat = degMatch[2] != null;
    const value = isFloat ? parseFloat(degMatch[1] + degMatch[2]) : parseInt(degMatch[1]);

    return {
      value: value,
      isFloat: isFloat,
      pos: 'deg'
    };
  } else if (minMatch && parseInt(minMatch[1]) <= 60) {
    const isFloat = minMatch[2] != null;
    const value = isFloat ? parseFloat(minMatch[1] + minMatch[2]) : parseInt(minMatch[1]);

    return {
      value: value,
      isFloat: isFloat,
      pos: 'min'
    };
  } else if (secMatch && parseInt(secMatch[1]) <= 60) {
    const isFloat = secMatch[2] != null;
    const value = isFloat ? parseFloat(secMatch[1] + secMatch[2]) : parseInt(secMatch[1]);

    return {
      value: value,
      isFloat: isFloat,
      pos: 'sec'
    };
  } else if (floatMatch) {
    return {
      value: parseFloat(floatMatch[1]),
      isFloat: true,
      pos: null
    };
  } else if (intMatch) {
    return {
      value: parseInt(intMatch[1]),
      isFloat: false,
      pos: null
    };
  } else if (dirMatch) {
    return {
      value: dirMatch[1],
      pos: 'dir'
    };
  } else if (str[0] === ',') {
    return {
      value: ',',
      pos: 'closer'
    };
  } else {
    return null;
  }
}

function isLastNumber(strParts, index) {
  const firstpart = strParts[index];
  if ((firstpart[0] < '0' || firstpart[0] > '9') && firstpart[0] !== '-') {
    return false;
  }

  for (let i = index + 1; i < strParts.length; i++) {
    const part = strParts[i];
    if ((part[0] >= '0' && part[0] <= '9') || part[0] === '-') {
      return false;
    }
  }

  return true;
}

function parseCoordinate(str) {
  const strParts = str
    .toUpperCase()
    .replace(/degr?e?e?s?/ig, '°')
    .replace(/minu?t?e?s?/ig, '\'')
    .replace(/seco?n?d?s?/ig, '"')
    .replace('N', ' N ')
    .replace('S', ' S ')
    .replace('E', ' E ')
    .replace('W', ' W ')
    .replace(' °', '°')
    .replace(' \'', '\'')
    .replace(' "', '"')
    .replace(/\s*,\s*/g, ' , ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(s => s.trim())
    .filter(s => !!s && s.length > 0);

  let lat = undefined;
  let lng = undefined;

  let nextPartIndex = 0;
  let nextPart = parsePart(strParts[nextPartIndex++]);

  for (let times = 0; times < 2; times++) {
    const parts = [0, 0, 0];
    let insertIndex = 0;
    let negate = false;
    let isLat = lat == null;

    while (nextPartIndex <= strParts.length && (insertIndex < 3 || nextPart.pos === 'dir' || nextPart.pos === 'closer')) {
      if (!nextPart) {
        return null;
      } else if (times === 0 && isLastNumber(strParts, nextPartIndex - 1)) {
        // if we are on the last item and it's the next, then assume it is part of the last
        // so break out, process what we have, then come back later
        break;
      } else if (nextPart.pos === 'deg' && insertIndex === 0) {
        parts[0] = nextPart.value;
        insertIndex = nextPart.isFloat ? 3 : 1;
      } else if (nextPart.pos === 'min' && insertIndex <= 1) {
        parts[1] = nextPart.value;
        insertIndex = nextPart.isFloat ? 3 : 2;
      } else if (nextPart.pos === 'sec' && insertIndex <= 2) {
        parts[2] = nextPart.value;
        insertIndex = 3;
      } else if (nextPart.pos === 'dir') {
        if (nextPart.value === 'N') {
          isLat = true;
          negate = false;
        } else if (nextPart.value === 'S') {
          isLat = true;
          negate = true;
        } else if (nextPart.value === 'E') {
          isLat = false;
          negate = false;
        } else if (nextPart.value === 'W') {
          isLat = false;
          negate = true;
        }

        insertIndex = 3;
      } else if (nextPart.pos === 'closer') {
        insertIndex = 3;
      } else if (nextPart.pos === null) {
        if (insertIndex === 0 || (nextPart.value <= 60 && nextPart.value >= 0)) {
          parts[insertIndex] = nextPart.value;
          insertIndex = nextPart.isFloat ? 3 : (insertIndex + 1);
        } else {
          break;
        }
      } else {
        break;
      }

      nextPart = parsePart(strParts[nextPartIndex++])
    }

    const isValNegMulti = parts[0] < 0 ? -1 : 1;
    let parsedValue = (Math.abs(parts[0]) + (parts[1] / 60) + (parts[2] / 3600)) * isValNegMulti;
    if (negate) {
      parsedValue = parsedValue * -1.0;
    }

    if (isLat) {
      if (lat != null && lng == null) {
        lng = lat;
      }
      lat = parsedValue;
    } else {
      if (lng != null && lat == null) {
        lat = lng;
      }
      lng = parsedValue;
    }

    if (!nextPart && times === 0 && nextPartIndex >= strParts.length) {
      // ran out of input
      return null;
    }
  }

  if (nextPartIndex < strParts.length) {
    // some left over, probably invalid
    return null;
  }

  return {lat, lng};
}

module.exports = parseCoordinate;
