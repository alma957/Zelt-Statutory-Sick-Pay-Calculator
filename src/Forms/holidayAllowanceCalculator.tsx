export const calculateAnnualHolidaysAllowance = (
  daysWorkedPerWeek: number
): number => {
  return roundUpAll(Math.min(28, 5.6 * daysWorkedPerWeek), 1);
};
export const calculateAnnualCarryOver = (
  allowance: number,
  maxCarry: number
): number => {
  return roundUpAll(Math.min(maxCarry, (1.6 / 5.6) * allowance), 1);
};
export const leap = (start: number): number => {
  const startDate = new Date(start);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  let subLeap = 0;

  if (leapYear(startYear) && startMonth === 1 && startDay === 29) {
    subLeap = 1;
  }

  const startYearLeap = leapYear(startYear);
  const endYearMill = new Date(start + 365 * 1000 * 24 * 3600);

  const endYear = endYearMill.getFullYear();
  const endYearLeap = leapYear(endYear);
  let l: any = undefined;
  if (startYearLeap) {
    l = new Date(startYear, 1, 29).getTime();
  } else if (endYearLeap) {
    l = new Date(endYear, 1, 29).getTime();
  }
  if (l === undefined) return 0;

  if (l >= start && l <= start + 3600 * 1000 * 24 * (365 + subLeap)) {
    return 1;
  }
  return 0;
};
const leapYear = (year: number) => {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }

  return false;
};

export const calculateDateDiffMil = (start: Date, end: Date): number => {
  let mil: number = end.getTime() - start.getTime();

  return mil + 3600 * 1000 * 24;
};

export const roundUpAll = (original: number, precision: number) => {
  const value = original.toFixed(2);

  const digits = value.split(".")[1];
  let rounded: number | undefined = undefined;
  console.log(original);
  console.log(digits);
  const sDigits = digits[1];
  if (sDigits === "0") {
    return parseFloat(value);
  } else if (digits[0] === "9") {
    return Math.round(parseFloat(value));
  } else {
    rounded = parseFloat(
      value.split(".")[0] + "." + (parseInt(digits[0]) + 1).toString()
    );

    return rounded;
  }
};
