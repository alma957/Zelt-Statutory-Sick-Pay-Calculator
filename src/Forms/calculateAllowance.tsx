import { useState } from "react";

import {
  calculateAnnualCarryOver,
  calculateAnnualHolidaysAllowance,
  roundUpAll,
  leap,
} from "./holidayAllowanceCalculator";

export const StatuatoryAllowanceCalc = (): JSX.Element => {
  const defDate = new Date(new Date().getFullYear(), 0, 1)
    .toISOString()
    .substring(0, 10);
  const [startDate, setStartDate] = useState<string>(defDate);
  const [endDate, setEndDate] = useState<string>(defDate);
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<
    number | undefined
  >();

  const [startPeriodSpecified, setStartPeriodSpecified] =
    useState<boolean>(false);
  const [currentHolidayPeriodStartDate, setcurrentHolidayPeriodStartDate] =
    useState<string | undefined>();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [totAnnAllowance, setTotAnnAllowance] = useState<number>();
  const [totCarryOver, setTotCarryOver] = useState<number | undefined>();
  const [ratAnnAllowance, setRatAnnAllowance] = useState<number>();
  const [ratCarryOver, setRatCarryOver] = useState<number | undefined>();
  return (
    <form
      className="myForm"
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex-container">
        <h2>Employment Details</h2>
      </div>
      <p>
        <label>
          Employment Start Date *{" "}
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
          Employment Termination Date *
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </p>
      <legend>Holiday Period Start Date Specified in Contract *</legend>
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
          Current Holiday Period Start Date (leave blank if not in contract)
          <input
            type="date"
            value={currentHolidayPeriodStartDate}
            required={startPeriodSpecified ? true : false}
            onChange={(e) => setcurrentHolidayPeriodStartDate(e.target.value)}
          />
        </label>
      </p>
      <label>
        Days Worked per Week *
        <input
          type="number"
          min="0"
          step="any"
          value={daysWorkedPerWeek}
          required
          onChange={(e) => {
            setDaysWorkedPerWeek(parseFloat(e.target.value));
          }}
        />
      </label>
      <div className="flex-container">
        <div>
          <button
            onClick={() => {
              if (
                startDate !== undefined &&
                endDate !== undefined &&
                daysWorkedPerWeek !== undefined &&
                startPeriodSpecified !== undefined &&
                !/[a-zA-Z]/.test(startDate) &&
                !/[a-zA-Z]/.test(endDate)
              ) {
                const sdSplit = startDate.split("-").map((el) => parseInt(el));
                const sd = new Date(sdSplit[0], sdSplit[1] - 1, sdSplit[2]);
                const edSplit = endDate.split("-").map((el) => parseInt(el));

                const ed = new Date(
                  edSplit[0],
                  edSplit[1] - 1,
                  edSplit[2]
                ).getTime();

                if (
                  startPeriodSpecified &&
                  /[a-zA-Z]/.test(currentHolidayPeriodStartDate!)
                )
                  return;

                const contractHolidayStartPeriodSplit = startPeriodSpecified
                  ? currentHolidayPeriodStartDate!
                      .split("-")
                      .map((el) => parseInt(el))
                  : null;
                console.log(contractHolidayStartPeriodSplit);
                const contractHolidayStartPerCheck =
                  contractHolidayStartPeriodSplit
                    ? new Date(
                        contractHolidayStartPeriodSplit[0],
                        contractHolidayStartPeriodSplit[1] - 1,
                        contractHolidayStartPeriodSplit[2]
                      )
                    : sd;
                let contractHolidayStartPer = new Date(
                  Math.max(
                    contractHolidayStartPerCheck.getTime() as number,
                    sd.getTime() as number
                  )
                ).getTime();
                if (ed - sd.getTime() < 0) {
                  alert(
                    "Termination date cannot be before start of employment"
                  );
                  return;
                } else if (ed - contractHolidayStartPer < 0) {
                  alert(
                    "Termination date cannot be before current holiday period start date"
                  );
                  return;
                }
                const dayMill = 1000 * 24 * 3600;
                const annMill =
                  dayMill * +(365 + leap(contractHolidayStartPer));
                let diff = ed - contractHolidayStartPer + dayMill;
                console.log(
                  "diff, ",
                  diff,
                  " leap: ",
                  leap(contractHolidayStartPer),
                  " ann mill ",
                  annMill
                );
                while (diff > dayMill * (365 + leap(contractHolidayStartPer))) {
                  contractHolidayStartPer +=
                    dayMill * (365 + leap(contractHolidayStartPer));
                  diff -= dayMill * (365 + leap(contractHolidayStartPer));
                }

                const tAnAll =
                  calculateAnnualHolidaysAllowance(daysWorkedPerWeek);

                setTotAnnAllowance(tAnAll);

                const totCarry = calculateAnnualCarryOver(tAnAll as number, 8);
                setTotCarryOver(totCarry);

                while (diff > annMill) diff -= annMill;
                console.log("h");
                const prop =
                  Math.ceil(diff / (3600 * 1000 * 24)) /
                  (365 + 1 + leap(contractHolidayStartPer));

                setRatAnnAllowance(roundUpAll((tAnAll as number) * prop, 1));
                setRatCarryOver(roundUpAll((totCarry as number) * prop, 1));
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
          <p>
            Employee's Annual Holiday Allowance (inclusive of bank holidays):{" "}
            {totAnnAllowance}
          </p>
          <p>Employee's Annual Carry Over Allowance: {totCarryOver}</p>
          <p>
            Employee's pro-rata Holiday Allowance (Valid if Period Not Full):{" "}
            {ratAnnAllowance}
          </p>
          <p>Employee's pro-rata Carry Over Allowance {ratCarryOver}</p>
        </div>
      </div>
    </form>
  );
};
