export const paymentFrequency = [
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "every_two_weeks",
    label: "Every 2 weeks",
  },
  {
    value: "every_4_weeks",
    label: "Every 4 weeks",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "irregularly",
    label: "Irregularly",
  },
];
export const parseMonth = {
  "0": "Jan",
  "1": "Feb",
  "2": "Mar",
  "3": "Apr",
  "4": "May",
  "5": "Jun",
  "6": "Jul",
  "7": "Aug",
  "8": "Sep",
  "9": "Oct",
  "10": "Nov",
  "11": "Dec",
};
export const eightWeeksOptions = [
  {
    label: "Yes, paid at least 8 weeks of earnings",
    value: "eight_weeks",
  },
  {
    label: "No, paid less than 8 weeks of earnings",
    value: "less_eight_weeks",
  },
  {
    label: "Employee is new and fell sick before their first payday",
    value: "new_sick",
  },
];
export const statutes = [
  {
    value: "Statuatory Maternity Leave",
    label: "Statuatory Maternity Leave",
    right: false,
  },
  {
    value: "Maternity Allowance",
    label: "Maternity Allowance",
    right: false,
  },
  {
    value: "Statutory Paternity Leave",
    label: "Statutory Paternity Leave",
    right: true,
  },
  {
    value: "Statutory Adoption Pay",
    label: "Statutory Adoption Pay",
    right: true,
  },
  {
    value: "Statutory Parental Bereavement Pay",
    label: "Statutory Parental Bereavement Pay",
    right: true,
  },
  {
    value: "Shared Parental Leave and Pay",
    label: "Shared Parental Leave and Pay",
    right: true,
  },
];
export const workingsDays = [
  {
    label: "Monday",
    value: 1,
  },
  {
    label: "Tuesday",
    value: 2,
  },
  {
    label: "Wedsnesday",
    value: 3,
  },
  {
    label: "Thursday",
    value: 4,
  },
  {
    label: "Friday",
    value: 5,
  },
  {
    label: "Saturday",
    value: 6,
  },
  {
    label: "Sunday",
    value: 0,
  },
];

interface State {
  readonly error: {
    readonly first_period_start: string;
    readonly first_period_end: string;
    readonly second_period_start: string;
    readonly second_period_end: "";
  };
  readonly statsSelected: null;
  readonly eightWeeksOptions: {
    readonly label: "Yes, paid at least 8 weeks earning";
    readonly value: "eight_weeks";
  };
  readonly paydates: {first: string; second: string};
  readonly allowPaymentFrequency: false;
  readonly workingDays: null;
  readonly periodEarnings: null;
  readonly daysPeriod: number;
  readonly waitingDaysRemaining: number | null;
}

export const inState = {
  error: {
    first_period_start: "",
    first_period_end: "",
    second_period_start: "",
    second_period_end: "",
  },
  statsSelected: null,
  eightWeeksOptions: {
    label: "Yes, paid at least 8 weeks earning",
    value: "eight_weeks",
  },
  paydates: {
    first: "2022-04-07",
    second: "2022-06-04",
  },
  allowPaymentFrequency: false,
  workingDays: [
    {
      label: "Monday",
      value: 1,
    },
    {
      label: "Tuesday",
      value: 2,
    },
    {
      label: "Wedsnesday",
      value: 3,
    },
    {
      label: "Thursday",
      value: 4,
    },
    {
      label: "Friday",
      value: 5,
    },
  ],
  periodEarnings: 2500,
  daysPeriod: 7,
  waitingDaysRemaining: null,
};
// export const dailyRates2 = [
//   {
//     start: 1649203200000,
//     end: 1680652800000,
//     rates: {
//       7: 14.19,
//       6: 16.56,
//       5: 19.87,
//       4: 24.84,
//       3: 33.12,
//       2: 49.68,
//       1: 99.35,
//       0: 0,
//     },
//   },
// ];
export const dailyRates = [
  {
    start: 1649203200000,
    end: 1680652800000,
    rates: {
      7: {
        0: 0,
        1: 14.2,
        2: 28.39,
        3: 42.58,
        4: 56.78,
        5: 70.97,
        6: 85.16,
        7: 99.35,
      },
      6: {
        0: 0,
        1: 16.56,
        2: 33.12,
        3: 49.68,
        4: 66.24,
        5: 82.8,
        6: 99.35,
      },
      5: {
        0: 0,
        1: 19.87,
        2: 39.47,
        3: 59.61,
        4: 79.48,
        5: 99.35,
      },
      4: {
        0: 0,
        1: 24.84,
        2: 49.68,
        3: 74.52,
        4: 99.35,
      },
      3: {
        0: 0,
        1: 33.12,
        2: 66.24,
        3: 99.35,
      },
      2: {
        0: 0,
        1: 49.68,
        2: 99.35,
      },
      1: {
        0: 0,
        1: 99.35,
      },
      0: {
        0: 0,
      },
    },
  },
];
