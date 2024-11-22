const timeUnitsInMs = {
  year: 31104000000,
  month: 2592000000,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  min: 60000,
  sec: 1000
};

let Time = {
  day: 14,
  hour: 0,
  min: 0,
  sec: 0
};

const convertFromMilliseconds = (ms, unit) => {
  const units = timeUnitsInMs;
  unit = (unit in units) ? unit : "sec";

  let unitValue = ms / units[unit]; // Extract unit equivalent in milliseconds
  if ((ms % units[unit]) != 0)
    unitValue = Math.floor(unitValue); // Make unit value a whole number

  let remainingMs = ms - (units[unit] * unitValue); // Gets remaining milliseconds if any.
  return [unitValue, remainingMs];
};

Time.toMilliseconds = function () {
  let timeObj = this;
  let milliseconds = 0;

  for (let unit in timeObj) {
    let unitValue = timeObj[unit];
    milliseconds += unitValue * timeUnitsInMs[unit];
  }
  return milliseconds;
};

Time.set = function (milliseconds) {
  let result = null;
  let time = this;

  for (let unit in time) {
    if (typeof time[unit] == "function") break;
    result = convertFromMilliseconds(milliseconds, unit);
    time[unit] = result[0];
    milliseconds = result[1];
  }
};

function elapsedString(date) {
  if (date instanceof Date) {
    let elapsedTime = Date.now() - date.getTime();
    if (elapsedTime < 1000) return "now";
    
    for (let unit in timeUnitsInMs){
      let unitValue = convertFromMilliseconds(elapsedTime, unit)[0];
      switch (unit) {
        case "min":
          unit = "minute";
          break;
        case "sec":
          unit = "second";
          break;
      }
      
      if (unitValue) {
        unit = (unitValue > 1) ? (unit + "s") : unit;
        return `${unitValue} ${unit} ago`;
      }
    }
  }
}

export {
  convertFromMilliseconds,
  elapsedString
};