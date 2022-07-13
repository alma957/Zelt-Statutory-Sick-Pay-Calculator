import React, { useEffect, useState } from "react";

import {
  englandBkHol,
  scotlandBankHol,
  northIrBankHol,
  salaryBpMap,
} from "./variables";
export const AllowanceForm = (): JSX.Element => {
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [salary, setGrossSalary] = useState<number | undefined>();
  const [salaryBasis, setSalaryBasis] = useState<string>("Annually");
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<
    number | undefined
  >();
  const [startPeriodSpecified, setStartPeriodSpecified] =
    useState<boolean>(false);
  const [currentHolidayPeriodStartDate, setcurrentHolidayPeriodStartDate] =
    useState<string>("");
  const [jurisdiction, setJurisdiction] = useState<string>("England & Wales");
  const [annualHolidaysAllowance, setAnnualyHolidaysAllowance] = useState<
    number | undefined
  >();
  const [incBankHolidays, setIncBankHolidays] = useState<boolean>(false);
  const [holidayCarryOver, setHolidayCarryOver] = useState<
    number | undefined
  >();
  const [holidayTaken, setHolidayTaken] = useState<number>(0);
  const [totHolidays, setTotHolidays] = useState<number>(0);
  const [totAnnAllowance, setTotAnnAllowance] = useState<number>(0);
  const [totCarryOver, setTotCarryOver] = useState<number>(0);
  const [totAccrued, setTotAccrued] = useState<number>(0);
  const [totPayout, setTotPayout] = useState<number | string>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (daysWorkedPerWeek !== undefined)
      setTotAnnAllowance(calculateAnnualHolidaysAllowance(daysWorkedPerWeek));

    if (daysWorkedPerWeek !== undefined)
      setTotAnnAllowance(calculateAnnualHolidaysAllowance(daysWorkedPerWeek));
    if (totAnnAllowance) {
      const carryOver = calculateAnnualCarryOver(totAnnAllowance, 8);
      setTotCarryOver(carryOver);
    }
  }, [daysWorkedPerWeek, totAnnAllowance]);

  return (
    <form
      className="myForm"
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex-container">
        <h2>Employee Details</h2>
      </div>
      <p>
        <label>
          Employment start date *{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Employment termination date *
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Gross Salary *
          <input
            type="number"
            min="0"
            value={salary}
            step="any"
            onChange={(e) => {
              if (parseFloat(e.target.value) < 0) {
                setGrossSalary(0);
              } else {
                setGrossSalary(parseFloat(e.target.value));
              }
            }}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Salary Basis *
          <select
            value={salaryBasis}
            onChange={(e) => {
              setSalaryBasis(e.target.value);
            }}
            //defaultValue={"Annually"}

            required
          >
            <option value="Annually">Annually</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
        </label>
      </p>
      <p>
        <label>
          Days worked per week *
          <input
            type="number"
            min="0"
            step="any"
            value={daysWorkedPerWeek}
            required
            onChange={(e) =>
              parseFloat(e.target.value) < 0 || parseFloat(e.target.value) > 7
                ? ""
                : setDaysWorkedPerWeek(parseFloat(e.target.value))
            }
          />
        </label>
      </p>
      <legend>Holiday period start date specified in contract *</legend>
      <p>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={startPeriodSpecified}
            onChange={(e) =>
              e.target.checked
                ? setStartPeriodSpecified(true)
                : setStartPeriodSpecified(false)
            }
            required
          />{" "}
          Yes{" "}
        </label>
      </p>
      <p>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={!startPeriodSpecified}
            onChange={(e) =>
              e.target.checked
                ? setStartPeriodSpecified(false)
                : setStartPeriodSpecified(true)
            }
            required
          />{" "}
          No{" "}
        </label>
      </p>
      <p>
        <label>
          Current holiday period start date (leave blank if not in contract)
          <input
            type="date"
            value={currentHolidayPeriodStartDate}
            required={startPeriodSpecified ? true : false}
            onChange={(e) => setcurrentHolidayPeriodStartDate(e.target.value)}
          />
        </label>
      </p>
      <p>
        <label>
          Jurisdiction *
          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            required
            defaultValue={"England & Wales"}
          >
            <option value="England & Wales">England & Wales</option>
            <option value="Scotland">Scotland</option>
            <option value="Northern Ireland">Northern Ireland</option>
          </select>
        </label>
      </p>
      <h2>Annual Statuatory Allowance (Automatically Calculated)</h2>
      <p>
        <label>
          {" "}
          Employee's annual holiday allowance (inclusive of bank holidays)
          <input readOnly type="number" value={totAnnAllowance} />
        </label>
      </p>
      <p>
        <label>
          {" "}
          Employee's annual carry over allowance
          <input readOnly type="number" value={totCarryOver} />
        </label>
      </p>
      <h2>Employee Holiday Balance (Termination Year)</h2>
      <p>
        <label>
          Input employee's annual holiday allowance for current cycle (Excluding
          Carry Overs) *
          <input
            type="number"
            step="step"
            min="0"
            value={annualHolidaysAllowance}
            onChange={(e) =>
              parseFloat(e.target.value) < 0
                ? ""
                : setAnnualyHolidaysAllowance(parseFloat(e.target.value))
            }
            required
            // oninput="validity.valid||(value='');"
          />
        </label>
      </p>
      <legend>Does allowance include Bank Holidays ? *</legend>
      <p>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={incBankHolidays}
            onChange={(e) => {
              e.target.checked
                ? setIncBankHolidays(true)
                : setIncBankHolidays(false);
            }}
            required
          />{" "}
          Yes{" "}
        </label>
      </p>
      <p>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={!incBankHolidays}
            onChange={(e) => {
              e.target.checked
                ? setIncBankHolidays(false)
                : setIncBankHolidays(true);
            }}
            required
          />{" "}
          No{" "}
        </label>
      </p>
      <p>
        <label>
          Input employee's holidays carried over from previous cycle *
          <input
            type="number"
            min="0"
            step="step"
            value={holidayCarryOver}
            onChange={(e) =>
              parseFloat(e.target.value) < 0
                ? setHolidayCarryOver(0)
                : setHolidayCarryOver(parseFloat(e.target.value))
            }
            required
            // oninput="validity.valid||(value='');"
          />
        </label>
      </p>
      <p>
        <label>
          Input employee's holidays taken in current cycle (up to the
          termination date and excluding bank holidays) *
          <input
            type="number"
            min="0"
            value={holidayTaken}
            step="0.01"
            onChange={(e) =>
              parseFloat(e.target.value) < 0
                ? setHolidayTaken(0)
                : setHolidayTaken(parseFloat(e.target.value))
            }
            required
            // oninput="validity.valid||(value='');"
          />
        </label>
      </p>
      <div className="flex-container">
        <div>
          <button
            id="button"
            onClick={() => {
              if (
                startDate !== undefined &&
                endDate !== undefined &&
                salary !== undefined &&
                salaryBasis !== undefined &&
                daysWorkedPerWeek !== undefined &&
                startPeriodSpecified !== undefined &&
                jurisdiction !== undefined &&
                annualHolidaysAllowance !== undefined &&
                incBankHolidays !== undefined &&
                holidayCarryOver !== undefined &&
                holidayTaken !== undefined
              ) {
                const sdSplit = startDate.split("-").map((el) => parseInt(el));
                const sd = new Date(sdSplit[0], sdSplit[1], sdSplit[2]);
                const edSplit = endDate.split("-").map((el) => parseInt(el));
                const ed = new Date(edSplit[0], edSplit[1], edSplit[2]);

                const contractHolidayStartPeriodSplit = startPeriodSpecified
                  ? currentHolidayPeriodStartDate
                      .split("-")
                      .map((el) => parseInt(el))
                  : null;

                const contractHolidayStartPer = contractHolidayStartPeriodSplit
                  ? new Date(
                      contractHolidayStartPeriodSplit[2],
                      contractHolidayStartPeriodSplit[1],
                      contractHolidayStartPeriodSplit[0]
                    )
                  : sd;
                //console.log(contractHolidayStartPer);
                if (ed.getTime() - sd.getTime() < 0) {
                  alert(
                    "Termination date cannot be before beginning of employment"
                  );
                  return;
                } else if (
                  ed.getTime() - contractHolidayStartPer.getTime() <
                  0
                ) {
                  alert(
                    "Termination date cannot be before current holiday period start date"
                  );
                }
                setTotHolidays(
                  calculateTotalHolidays(
                    contractHolidayStartPer,
                    ed,
                    jurisdiction,
                    incBankHolidays,
                    holidayTaken
                  )
                );
                setTotAnnAllowance(
                  calculateAnnualHolidaysAllowance(daysWorkedPerWeek)
                );
                setTotCarryOver(calculateAnnualCarryOver(totAnnAllowance, 8));
                const totAccruedRes = calculateAccruedHolidays(
                  contractHolidayStartPer,
                  ed,
                  annualHolidaysAllowance,
                  holidayTaken,
                  incBankHolidays,
                  jurisdiction,
                  holidayCarryOver
                );
                setTotAccrued(totAccruedRes);
                console.log("pay");
                setTotPayout(
                  calculatePayout(
                    salary,
                    salaryBpMap.get(salaryBasis) as number,
                    daysWorkedPerWeek,
                    totAccruedRes
                  )
                );
                console.log(totPayout);
                setIsComplete(true);
              }
            }}
          >
            Calculate
          </button>
        </div>
        <div
          className="flex-child"
          id="output"
          style={{
            visibility: isComplete ? "visible" : "hidden",
          }}
        >
          <p>Total Holidays Taken: {totHolidays}</p>
          <p>Accrued holidays remaining: {parseFloat(totAccrued.toFixed(5))}</p>
          <p>Employee Payout: {totPayout} </p>
        </div>
      </div>
    </form>
  );
};
const calculateTotalHolidays = (
  startDate: Date,
  endDate: Date,
  jurisdiction: string,
  bankHolsIncl: boolean,
  holidaysTaken: number
): number => {
  return (
    holidaysTaken +
    (bankHolsIncl
      ? 0
      : calculateNumberOfBankHolidays(startDate, endDate, jurisdiction))
  );
};
const calculateAnnualHolidaysAllowance = (
  daysWorkedPerWeek: number
): number => {
  return Math.min(28, 5.6 * daysWorkedPerWeek);
};
const calculateAnnualCarryOver = (
  allowance: number,
  maxCarry: number
): number => {
  return Math.min(maxCarry, (1.6 / 5.6) * allowance);
};
const calculateDaysBetweenDateYD = (start: Date, end: Date): number => {
  let mil = calculateDateDiffMil(start, end);
  const oneYearMill = 1000 * 3600 * 24 * 365;
  while (mil > oneYearMill) mil -= oneYearMill;
  console.log();
  return mil / (3600 * 1000 * 24);
};
const calculateDateDiffMil = (start: Date, end: Date): number => {
  let mil: number = end.getTime() - start.getTime();

  return mil;
};
const calculateAccruedHolidays = (
  startDate: Date,
  endDate: Date,
  annualHolidayAllowance: number,
  holidayTaken: number,
  bankHolidaysIncluded: boolean,
  jurisdiction: string,
  carryOver: number
): number => {
  const daysWorkedToDate = calculateDaysBetweenDateYD(startDate, endDate);
  const nBankHolidays = calculateNumberOfBankHolidays(
    startDate,
    endDate,
    jurisdiction
  );

  return (
    roundUp((daysWorkedToDate / 365) * annualHolidayAllowance + carryOver, 1) -
    holidayTaken +
    (bankHolidaysIncluded ? 0 : nBankHolidays)
  );
};

const calculateNumberOfBankHolidays = (
  startDate: Date,
  endDate: Date,
  jurisdiction: string,

  mil?: number
): number => {
  let diff = mil ? mil : calculateDateDiffMil(startDate, endDate);
  const oneYearMill = 1000 * 3600 * 24 * 365;
  while (diff > oneYearMill) diff -= oneYearMill;
  const periodStartDateMill = new Date(startDate.getDate() + diff).getTime();
  const periodEndDateMill = endDate.getTime();

  let bankHolidaysMill: Array<number> = [];
  switch (jurisdiction) {
    case "England & Wales":
      bankHolidaysMill = englandBkHol.map((el) => new Date(el).getTime());
      break;
    case "Scotland":
      bankHolidaysMill = scotlandBankHol.map((el) => new Date(el).getTime());
      break;
    case "Northern Ireland":
      bankHolidaysMill = northIrBankHol.map((el) => new Date(el).getTime());
      break;
  }

  return bankHolidaysMill.reduce(
    (a, b) => (b > periodStartDateMill && b < periodEndDateMill ? a + 1 : a),
    0
  );
};

const calculatePayout = (
  salary: number,
  salaryBasis: number,
  daysWorkedPerWeek: number,
  accruedHolidayRemaining: number
) => {
  const pay =
    ((salary * salaryBasis) / (daysWorkedPerWeek * 52)) *
    accruedHolidayRemaining;
  return pay < 0
    ? "-£" + currencyFormat(pay).substring(1)
    : "£" + currencyFormat(pay);
};

const roundUp = (num: number, precision: number): number => {
  return Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision);
};

const currencyFormat = (num: number): string => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};