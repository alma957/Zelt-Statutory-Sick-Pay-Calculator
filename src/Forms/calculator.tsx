import {useEffect, useState} from "react";

import ReactSelect from "react-select";
import {
  statutes,
  eightWeeksOptions,
  workingsDays,
  inState,
  parseMonth,
  dailyRates,
} from "./options";
import {components} from "react-select";
import {Results, Res} from "./results";
export const Sickpaycalculator = (): JSX.Element => {
  const defDate = new Date(new Date().getFullYear(), 5, 6)
    .toISOString()
    .substring(0, 10);
  const [results, setResults] = useState<Array<Res>>();
  const [renderSecondStep, setRenderSecondStep] = useState<boolean>(true);
  const [isEntitled, setIsEntitle] = useState<boolean>(true);
  const validDateStart = new Date(2022, 3, 5);
  const [enoughSalary, setEnoughSalary] = useState<boolean>(false);
  const [entitlment, setEntitlement] = useState<string>("");
  const [irregularSchedule, setSchedule] = useState<boolean>(false);
  const [firstDaySick, setFirstDaySick] = useState<string>(defDate);
  const [lastDaySick, setLastDaySick] = useState<string>(
    new Date(new Date(defDate).getTime() + 1000 * 3600 * 24 * 5)
      .toISOString()
      .substring(0, 10)
  );
  const [additionalPiw, setadditionalPiw] = useState<boolean>(false);
  const [firstDaySickPrev, setFirstDaySickPrev] = useState<string>(
    new Date(lessEightWeeks(defDate)).toISOString().substring(0, 10)
  );
  const [lastDaySickPrev, setLastDaySickPrev] = useState<string>(
    new Date(new Date(firstDaySickPrev).getTime() + dayMill * 7)
      .toISOString()
      .substring(0, 10)
  );
  let [absoluteFirst, setAbsoluteFirst] = useState<string>(firstDaySick);

  const [state, setState] = useState<any>(inState);
  useEffect(() => {
    sumbt(
      firstDaySick,
      lastDaySick,
      firstDaySickPrev,
      lastDaySickPrev,
      state,
      additionalPiw
    );
  }, []);
  useEffect(() => {
    if (additionalPiw) setAbsoluteFirst(firstDaySickPrev);
    else setAbsoluteFirst(firstDaySick);
  }, [
    firstDaySick,
    lastDaySick,
    firstDaySickPrev,
    lastDaySickPrev,
    additionalPiw,
  ]);
  const crossPeriodDatesChecks = (
    firstDaySick: string,
    lastDaySick: string,
    firstDaySickPrev: string,
    lastDaySickPrev: string
  ) => {
    if (
      isDateValid(firstDaySick) &&
      isDateValid(lastDaySick) &&
      isDateValid(firstDaySickPrev) &&
      isDateValid(lastDaySickPrev)
    ) {
      const number2 = new Date(lastDaySickPrev).getTime();
      const number3 = new Date(firstDaySick).getTime();
      let ret = null;

      if (number2 >= number3) {
        (state as any)["error"]["second_period_end"] =
          "The end of the previous period must be at least one day before the start of the current period";
        (state as any)["error"]["first_period_start"] =
          "The start of the current period must be at least one day after the end of the previous period";
        ret = false;
      } else if (number3 - number2 > 1000 * 3600 * 24 * 7 * 8) {
        (state as any)["error"]["second_period_end"] =
          "The end of the previous period must be at least 8 weeks within the day before the start of the current period";
        (state as any)["error"]["first_period_start"] =
          "The start of the current period must be at least 8 weeks day after the end of the previous period";
        ret = false;
      } else {
        (state as any)["error"]["second_period_end"] = "";
        (state as any)["error"]["first_period_start"] = "";
        setRenderSecondStep(true);
        setAbsoluteFirst(firstDaySickPrev);

        ret = true;
      }
      setState({...state});
      return ret;
    }
  };
  const pairCheckingFirst = (
    start: string,
    end: string,
    toCheck: string,
    key: string,
    period: string
  ): boolean => {
    if (!isDateValid(toCheck)) {
      (state as any)["error"][key] = "Please insert a valid date";
      setState({...state});
      return false;
    } else {
      (state as any)["error"][key] = "";
      setState({...state});
    }
    if (isDateValid(start) && isDateValid(end)) {
      if (!isDifferenceValid(start, end)) {
        (state as any)["error"][key] =
          "The period difference must be more than 4 days in a row";
        setState({...state});
        return false;
      } else {
        (state as any)["error"][`${period}_period_start`] = "";
        (state as any)["error"][`${period}_period_start`] = "";
        if (!additionalPiw) {
          setAbsoluteFirst(firstDaySick);
          setRenderSecondStep(true);
        }

        return true;
      }
    } else {
      return false;
    }
  };
  const Option = (props: any) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() =>
              sumbt(
                firstDaySick,
                lastDaySick,
                firstDaySickPrev,
                lastDaySickPrev,
                state,
                additionalPiw
              )
            }
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  const sumbt = (
    firstDaySick: string,
    lastDaySick: string,
    firstDaySickPrev: string,
    lastDaySickPrev: string,
    state: any,
    additionalPiw: boolean
  ) => {
    if (
      !inputCheck(
        firstDaySick,
        lastDaySick,
        firstDaySickPrev,
        lastDaySickPrev,
        state,
        additionalPiw
      )
    ) {
      return;
    }

    const workingDays = state.workingDays.map((el: any) => el.value);

    const paymentLapse = state.eightWeeksOptions.value;

    const firstPayDate =
      paymentLapse === "eight_weeks"
        ? new Date(state.paydates.first).getTime()
        : null;
    const lastPayDate =
      paymentLapse === "eight_weeks"
        ? new Date(state.paydates.second).getTime()
        : null;

    if (paymentLapse === "eight_weeks") {
      if (
        state.periodEarnings /
          ((lastPayDate! - firstPayDate!) / (3600 * 1000 * 24 * 7)) <
        123
      ) {
        setEnoughSalary(false);
        return;
      }
    } else if (
      paymentLapse === "new_sick" ||
      paymentLapse === "less_eight_weeks"
    ) {
      if ((state.periodEarnings / state.daysPeriod) * 7 < 123) {
        setEnoughSalary(false);

        return;
      }
    }

    setEnoughSalary(true);

    const fdSick = new Date(firstDaySick).getTime();
    const ldSick = new Date(lastDaySick).getTime();
    const ldSickPrev = lastDaySickPrev
      ? new Date(lastDaySickPrev).getTime()
      : null;
    const fdSickPrev = firstDaySickPrev
      ? new Date(firstDaySickPrev).getTime()
      : null;

    const wDays = additionalPiw
      ? findWeeks(fdSickPrev as number, ldSickPrev as number, workingDays)!.at(
          -1
        )!.waitingDaysRemaining
      : 3;

    const qualPayDaysLastPeriod: Array<QualifyingDays> = findWeeks(
      fdSick,
      ldSick,
      workingDays,
      wDays
    )!;

    if (qualPayDaysLastPeriod === undefined) return;

    const tempResults = new Array<Res>();
    for (let q of qualPayDaysLastPeriod) {
      const end = q.week;

      const pay = calcAmount(q, dailyRates);
      tempResults.push({week: end, amount: pay.toFixed(2)});
    }
    setResults(tempResults);
  };

  const inputCheck = (
    firstDaySick: string,
    lastDaySick: string,
    firstDaySickPrev: string,
    lastDaySickPrev: string,
    state: any,
    additionalPiw: boolean
  ): boolean => {
    const fdsick = new Date(firstDaySick);
    const ldsick = new Date(lastDaySick);
    const fdsickprev = new Date(firstDaySickPrev);
    const ldsickprev = new Date(lastDaySickPrev);

    const workingDays = state.workingDays;
    const lastPaid = new Date(state.paydates.second);
    const firstPaid = new Date(state.paydates.first);

    if (state.periodEarnings === 0 || isNaN(state.periodEarnings)) {
      setEnoughSalary(false);

      return false;
    }

    if (
      additionalPiw &&
      !crossPeriodDatesChecks(
        firstDaySick,
        lastDaySick,
        firstDaySickPrev,
        lastDaySickPrev
      )
    ) {
      return false;
    }
    if (workingDays.length === 0) {
      state.error.workingDays = "You need to select one at least";
    } else {
      state.error.workingDays = "";
    }
    if (fdsick.getTime() < validDateStart.getTime()) {
      state.error.first_period_date = `The start date must be before ${formatDate(
        fdsick.toISOString().substring(0, 10)
      )}`;

      return false;
    } else {
      setState({...state});
    }
    for (let e in state.error) {
      if (state.error[e] !== "") {
        return false;
      }
    }

    state.error.first_period_date = "";
    setState({...state});

    return true;
  };
  return (
    <div>
      <form
        className="myForm"
        id="form"
        style={{marginLeft: "15px", marginRight: "15px"}}
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div className="input-help">
          <legend>Is your employee on Maternity leave? *</legend>
        </div>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={!isEntitled}
            onChange={e => {
              if (e.target.checked) {
                setIsEntitle(false);
              } else {
                setIsEntitle(true);
                sumbt(
                  firstDaySick,
                  lastDaySick,
                  firstDaySickPrev,
                  lastDaySickPrev,
                  state,
                  additionalPiw
                );
              }
            }}
            required
          />{" "}
          Yes{" "}
        </label>
        <label className="choice">
          {" "}
          <input
            type="radio"
            checked={isEntitled}
            onChange={e => {
              if (e.target.checked) {
                //window.location.replace("");
                setIsEntitle(true);
                sumbt(
                  firstDaySick,
                  lastDaySick,
                  firstDaySickPrev,
                  lastDaySickPrev,
                  state,
                  additionalPiw
                );
              } else {
                setIsEntitle(false);
              }
            }}
            required
          />{" "}
          No
        </label>

        <br></br>
        <h2 style={{display: !isEntitled ? "inline" : "none"}}>
          She is not entitled to statutory sick pay because she is on maternity
          leave
        </h2>
        <br></br>
        <div style={{display: isEntitled ? "inline" : "none"}}>
          <legend>
            Does your Employee have an irregular work schedule ? *
          </legend>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={irregularSchedule}
              onChange={e => {
                e.target.checked ? setSchedule(true) : setSchedule(false);
                sumbt(
                  firstDaySick,
                  lastDaySick,
                  firstDaySickPrev,
                  lastDaySickPrev,
                  state,
                  additionalPiw
                );
              }}
              required
            />{" "}
            Yes{" "}
          </label>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={!irregularSchedule}
              onChange={e => {
                sumbt(
                  firstDaySick,
                  lastDaySick,
                  firstDaySickPrev,
                  lastDaySickPrev,
                  state,
                  additionalPiw
                );
                e.target.checked ? setSchedule(false) : setSchedule(true);
              }}
              required
            />{" "}
            no
          </label>
          <br></br>
          <h2 style={{display: !irregularSchedule ? "none" : "block"}}>
            We currently do not support irregular work schedule. You will have
            to calculate it manually
          </h2>
          <br></br>
          <div style={{display: irregularSchedule ? "none" : "block"}}>
            <div>
              <label>
                <div className="input-help">
                  First day of sickness in the most recent period *{""}
                  <div style={{color: "red", fontSize: "8px"}}>
                    {state.error.first_period_start}
                  </div>
                </div>
                <input
                  type="date"
                  value={firstDaySick}
                  onChange={e => {
                    const date = e.target.value;
                    if (
                      pairCheckingFirst(
                        date,
                        lastDaySick,
                        date,
                        "first_period_start",
                        "first"
                      ) &&
                      additionalPiw
                    ) {
                      crossPeriodDatesChecks(
                        date,
                        lastDaySick,
                        firstDaySickPrev,
                        lastDaySickPrev
                      );
                    }
                    if (new Date(date).getTime() < validDateStart.getTime()) {
                      state.error.first_period_start = `You need to enter a date after ${formatDate(
                        validDateStart.toISOString().substring(0, 10)
                      )}`;
                    }

                    if (isDateValid(date)) setFirstDaySick(date);
                    sumbt(
                      date,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev,
                      state,
                      additionalPiw
                    );
                  }}
                  required
                />
              </label>
            </div>
            <br></br>
            <label>
              <div className="input-help">
                Enter the last day of sickness *
                <div style={{color: "red", fontSize: "8px"}}>
                  {state.error.first_period_end}
                </div>
              </div>
              <input
                type="date"
                value={lastDaySick}
                onChange={e => {
                  const date = e.target.value;
                  const pairValid = pairCheckingFirst(
                    firstDaySick,
                    date,
                    date,
                    "first_period_end",
                    "first"
                  );
                  if (pairValid && additionalPiw) {
                    crossPeriodDatesChecks(
                      firstDaySick,
                      date,
                      firstDaySickPrev,
                      lastDaySickPrev
                    );
                  }
                  if (isDateValid(date)) setLastDaySick(date);
                  sumbt(
                    firstDaySick,
                    date,
                    firstDaySickPrev,
                    lastDaySickPrev,
                    state,
                    additionalPiw
                  );
                }}
                required
              />
            </label>
            <br></br>
            <div className="input-help">
              <legend>
                Was your employee off sick within the previous 8 weeks ? *
              </legend>
            </div>
            <label className="choice">
              {" "}
              <input
                type="radio"
                checked={additionalPiw}
                onChange={e => {
                  e.target.checked
                    ? setadditionalPiw(true)
                    : setadditionalPiw(false);
                  if (
                    isDateValid(firstDaySickPrev) &&
                    isDateValid(lastDaySickPrev) &&
                    isDifferenceValid(firstDaySickPrev, lastDaySickPrev) &&
                    crossPeriodDatesChecks(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev
                    )
                  ) {
                    setAbsoluteFirst(firstDaySickPrev);
                    setRenderSecondStep(true);
                  }

                  sumbt(
                    firstDaySick,
                    lastDaySick,
                    firstDaySickPrev,
                    lastDaySickPrev,
                    state,
                    e.target.checked
                  );
                }}
                required
              />{" "}
              Yes{" "}
            </label>
            <label className="choice">
              {" "}
              <input
                type="radio"
                value="true"
                checked={!additionalPiw}
                onChange={e => {
                  e.target.checked
                    ? setadditionalPiw(false)
                    : setadditionalPiw(true);
                  if (
                    isDateValid(firstDaySick) &&
                    isDateValid(lastDaySick) &&
                    isDifferenceValid(firstDaySick, lastDaySick)
                  ) {
                    setRenderSecondStep(true);
                    setAbsoluteFirst(firstDaySick);
                  }
                  sumbt(
                    firstDaySick,
                    lastDaySick,
                    firstDaySickPrev,
                    lastDaySickPrev,
                    state,
                    e.target.checked ? false : true
                  );
                  if (e.target.checked) {
                    window.location.replace("");
                  }
                }}
                required
              />{" "}
              No
            </label>

            <div
              style={{
                display: additionalPiw ? "inline" : "none",
              }}
            >
              <div>
                <br></br>
                <label>
                  <div className="input-help">
                    Start date for this linked period *{""}
                    <div style={{color: "red", fontSize: "8px"}}>
                      {state.error.second_period_start}
                    </div>
                  </div>
                  <input
                    type="date"
                    value={firstDaySickPrev}
                    onChange={e => {
                      const date = e.target.value;

                      if (
                        pairCheckingFirst(
                          date,
                          lastDaySickPrev,
                          date,
                          "second_period_start",
                          "second"
                        ) &&
                        additionalPiw
                      ) {
                        crossPeriodDatesChecks(
                          firstDaySick,
                          lastDaySick,
                          date,
                          lastDaySickPrev
                        );
                      }
                      if (isDateValid(date)) setFirstDaySickPrev(date);

                      sumbt(
                        firstDaySick,
                        lastDaySick,
                        date,
                        lastDaySickPrev,
                        state,
                        additionalPiw
                      );
                    }}
                    required
                  />
                </label>
              </div>
              <br></br>
              <label>
                <div className="input-help">
                  Enter the last day of sickness *
                  <div style={{color: "red", fontSize: "8px"}}>
                    {state.error.second_period_end}
                  </div>
                </div>
                <input
                  type="date"
                  value={lastDaySickPrev}
                  onChange={e => {
                    const date = e.target.value;

                    if (
                      pairCheckingFirst(
                        firstDaySickPrev,
                        date,
                        date,
                        "second_period_end",
                        "second"
                      ) &&
                      additionalPiw
                    ) {
                      crossPeriodDatesChecks(
                        firstDaySick,
                        lastDaySick,
                        firstDaySickPrev,
                        date
                      );
                    }
                    if (isDateValid(date)) setLastDaySickPrev(date);
                    sumbt(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      date,
                      state,
                      additionalPiw
                    );
                  }}
                  required
                />
              </label>
            </div>
          </div>
          <div
            style={{
              display:
                renderSecondStep && !irregularSchedule ? "inline" : "none",
            }}
          >
            <br></br>
            <label>
              On {formatDate(absoluteFirst)} had you paid your employee at least
              8 weeks of earnings
              <ReactSelect
                defaultValue={{
                  label: "Yes, paid at least 8 weeks of earnings",
                  value: "eight_weeks",
                }}
                options={eightWeeksOptions}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                isSearchable={false}
                onChange={e => {
                  state.eightWeeksOptions = e;

                  setState({...state});
                  sumbt(
                    firstDaySick,
                    lastDaySick,
                    firstDaySickPrev,
                    lastDaySickPrev,
                    state,
                    additionalPiw
                  );
                }}
              />
            </label>

            <div
              style={{
                display: (state.eightWeeksOptions as any)
                  ? (state.eightWeeksOptions.value as string) === "eight_weeks"
                    ? "block"
                    : "none"
                  : "none",
              }}
            >
              <div>
                {/* <div>
                  <br></br>
                  <label>
                    How often do you pay your employee ?
                    <ReactSelect
                      options={paymentFrequency}
                      closeMenuOnSelect={true}
                      hideSelectedOptions={false}
                      components={{
                        Option,
                      }}
                      value={
                        state.paymentFrequency ? state.paymentFrequency : null
                      }
                      isSearchable={false}
                      onChange={(e) => {
                        state.paymentFrequency = e;

                        setState({ ...state });
                      }}
                    />
                  </label>
                </div> */}
                <br></br>
                <label>
                  <div className="input-help">
                    {" "}
                    On {formatDate(absoluteFirst)} what was the last normal
                    paydate ?
                    <div style={{color: "red", fontSize: "8px"}}>
                      {" "}
                      {state.error.second_pay_date}
                    </div>
                  </div>
                  <input
                    type="date"
                    value={state.paydates["second"]}
                    onChange={e => {
                      if (!isDateValid(e.target.value)) {
                        state.error.second_pay_date =
                          "Please insert a valid date";
                      } else if (
                        daysdifference(e.target.value, absoluteFirst) <= 0
                      ) {
                        state.error.second_pay_date =
                          "Date must be before " + formatDate(absoluteFirst);
                      } else {
                        state.error.second_pay_date = "";
                      }
                      if (isDateValid(e.target.value)) {
                        state.paydates["second"] = e.target.value;
                        setState({...state});
                      }
                      sumbt(
                        firstDaySick,
                        lastDaySick,
                        firstDaySickPrev,
                        lastDaySickPrev,
                        state,
                        additionalPiw
                      );
                    }}
                  />{" "}
                </label>
              </div>

              <div>
                <br></br>
                <label>
                  <div className="input-help">
                    {" "}
                    On{" "}
                    {absoluteFirst
                      ? formatDate(lessEightWeeks(state.paydates["second"]))
                      : ""}{" "}
                    what was the last normal paydate ?
                    <div style={{color: "red", fontSize: "8px"}}>
                      {state.error.first_pay_date}
                    </div>
                  </div>
                  <input
                    type="date"
                    value={state.paydates["first"]}
                    onChange={e => {
                      if (!isDateValid(e.target.value)) {
                        state.error.first_pay_date =
                          "Please insert a valid date";
                      } else if (
                        daysdifference(
                          e.target.value,
                          lessEightWeeks(absoluteFirst)
                        ) <= 0
                      ) {
                        state.error.first_pay_date =
                          "Date must be before " +
                          formatDate(lessEightWeeks(absoluteFirst));
                      } else {
                        state.error.first_pay_date = "";
                      }
                      if (isDateValid(e.target.value)) {
                        state.paydates["first"] = e.target.value;
                        setState({...state});
                      }
                      sumbt(
                        firstDaySick,
                        lastDaySick,
                        firstDaySickPrev,
                        lastDaySickPrev,
                        state,
                        additionalPiw
                      );
                    }}
                  />{" "}
                </label>
              </div>
              <div>
                <br></br>
                <legend>
                  Enter the amount paid over the period{" "}
                  {state.paydates &&
                  state.paydates.first &&
                  state.paydates.second
                    ? formatDate(state.paydates["first"]) +
                      " and " +
                      formatDate(state.paydates["second"])
                    : ""}
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={state.periodEarnings}
                    onChange={e => {
                      state.periodEarnings = parseFloat(e.target.value);
                      setState({
                        ...state,
                      });
                      sumbt(
                        firstDaySick,
                        lastDaySick,
                        firstDaySickPrev,
                        lastDaySickPrev,
                        state,
                        additionalPiw
                      );
                    }}
                  />
                </legend>
              </div>
            </div>
            <div
              style={{
                display: (state.eightWeeksOptions as any)
                  ? (state.eightWeeksOptions.value as string) ===
                    "less_eight_weeks"
                    ? "block"
                    : "none"
                  : "none",
              }}
            >
              <br></br>

              <legend>
                Enter the total amount paid before {formatDate(absoluteFirst)}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={state.periodEarnings}
                  onChange={e => {
                    state.periodEarnings = parseFloat(e.target.value);

                    if (state.periodEarnings < 0) {
                      state.periodEarnings = 0;
                      setState({...state});
                    } else {
                      setState({...state});
                    }
                    sumbt(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev,
                      state,
                      additionalPiw
                    );
                  }}
                />
              </legend>
              <br></br>
              <label>
                <div className="input-help">
                  Enter the number of days this period represents
                  <div style={{color: "red", fontSize: "8px"}}>
                    {state.error.moreThanEightWeeks}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={state.daysPeriod}
                  required
                  onChange={e => {
                    const value = parseFloat(e.target.value);
                    if (value <= 0) {
                      state.daysPeriod = 0;

                      setState({...state});
                    } else {
                      state.error.moreThanEightWeeks = "";
                      state.daysPeriod = parseFloat(e.target.value);
                      setState({...state});
                    }

                    sumbt(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev,
                      state,
                      additionalPiw
                    );
                  }}
                />
              </label>
            </div>
            <div
              style={{
                display: (state.eightWeeksOptions as any)
                  ? (state.eightWeeksOptions.value as string) === "new_sick"
                    ? "block"
                    : "none"
                  : "none",
              }}
            >
              {/* <div style={}>
                <br></br>

                <label>
                  How often do you pay your employee ?
                  <ReactSelect
                    options={paymentFrequency}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    value={
                      state.paymentFrequency ? state.paymentFrequency : null
                    }
                    isSearchable={false}
                    onChange={(e) => {
                      state.paymentFrequency = e;

                      setState({ ...state });
                    }}
                  />
                </label>
              </div> */}
              <br></br>
              <legend>
                Enter the total of earnings this period represents{" "}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={state.periodEarnings}
                  onChange={e => {
                    state.periodEarnings = parseFloat(e.target.value);
                    setState({...state});
                    sumbt(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev,
                      state,
                      additionalPiw
                    );
                  }}
                />
              </legend>
              <br></br>
              <label>
                <div className="input-help">
                  Enter the number of days this period represents
                  <div style={{color: "red", fontSize: "8px"}}>
                    {state.error.moreThanEightWeeks}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={state.daysPeriod}
                  onChange={e => {
                    const value = parseInt(e.target.value);
                    if (value <= 0) {
                      state.daysPeriod = 0;

                      setState({...state});
                    } else {
                      state.error.moreThanEightWeeks = "";
                      state.daysPeriod = parseInt(e.target.value);
                      setState({...state});
                    }
                    sumbt(
                      firstDaySick,
                      lastDaySick,
                      firstDaySickPrev,
                      lastDaySickPrev,
                      state,
                      additionalPiw
                    );
                  }}
                />
              </label>
            </div>
            <div>
              <div>
                <br></br>
                <label>
                  <div>
                    Which days of the week do they work ?
                    <div style={{color: "red", fontSize: "8px"}}>
                      {state.error.workingDays}
                    </div>
                  </div>
                  <ReactSelect
                    options={workingsDays}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={e => {
                      state.workingDays = e;
                      setState({...state});

                      if (e.length !== 0) {
                        state.error.workingDays = "";
                      } else {
                        state.error.workingDays =
                          "You need to select at least one day";
                      }
                      setState({...state});
                      sumbt(
                        firstDaySick,
                        lastDaySick,
                        firstDaySickPrev,
                        lastDaySickPrev,
                        state,
                        additionalPiw
                      );
                    }}
                    value={state.workingDays}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                  />{" "}
                </label>
              </div>
            </div>
            <br></br>
            <div
              className="flex-child"
              id="output"
              style={{
                background: "white",
                border: "solid black 3px",
              }}
            >
              <Results
                results={results}
                enough={enoughSalary}
                style={{padding: "1px"}}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export const calcAmount = (
  results: QualifyingDays,
  dailyRates: any
): number => {
  const qDays = results.qualifyingDays;
  let tot = 0;
  if (results.payableDays.length === 0) return 0;
  let relevantRates = null;
  for (let q of qDays) {
    const rates = findDailyRates(dailyRates, q);
    if (rates !== undefined) {
      relevantRates = rates;
      break;
    }
  }

  tot =
    relevantRates[results.qualifyingDays.length][results.payableDays.length];

  return parseFloat(tot.toFixed(2));
};
const between = (start: number, end: number, control: number) => {
  return end >= control && start <= control;
};
const findDailyRates = (dailyRates: any, control: number) => {
  for (let d of dailyRates) {
    if (between(d.start, d.end, control)) {
      return d.rates;
    }
  }
  return undefined;
};

interface QualifyingDays {
  readonly week: string;
  readonly qualifyingDays: Array<number>;
  readonly waitingDaysRemaining: number;
  readonly payableDays: Array<number>;
}
const dayMill = 3600 * 1000 * 24;
const findWeeks = (
  start: number,
  end: number,
  workingDays: Array<number>,
  wDays: number = 3
): Array<QualifyingDays> | undefined => {
  if (end < start) {
    return undefined;
  }

  let res = new Array<QualifyingDays>();
  let diff = end - start;

  let temp = start;
  let dayIndex: number;
  const covidDate = new Date(2022, 2, 24).getTime();
  let tempQualifyingDays = [];
  let tempPayableDays = [];
  while (diff >= 0) {
    const tempDate = new Date(temp);

    dayIndex = tempDate.getDay();
    if (workingDays.indexOf(dayIndex) !== -1) {
      tempQualifyingDays.push(tempDate.getTime());

      wDays--;
      if (wDays < 0 || temp < covidDate) {
        tempPayableDays.push(tempDate.getTime());
      }
    }
    if (dayIndex === 6) {
      res.push({
        week: formatDate(new Date(temp).toISOString().substring(0, 10)),
        qualifyingDays: JSON.parse(JSON.stringify(tempQualifyingDays)),
        waitingDaysRemaining: Math.max(wDays, 0),
        payableDays: JSON.parse(JSON.stringify(tempPayableDays)),
      });
      tempQualifyingDays.length = 0;
      tempPayableDays.length = 0;
    }

    temp += dayMill;
    diff = end - temp;
    if (diff < 0 && tempDate.getDay() !== 6) {
      while (new Date(temp).getDay() !== 6) {
        temp += dayMill;
      }
      res.push({
        week: formatDate(new Date(temp).toISOString().substring(0, 10)),
        qualifyingDays: tempQualifyingDays,
        waitingDaysRemaining: Math.max(wDays, 0),
        payableDays: tempPayableDays,
      });
    }
  }

  return res;
};
const formatDate = (formatDate: string): string => {
  const split = formatDate.split("-").map(el => parseInt(el));

  if (isNaN(split[0]) || isNaN(split[1]) || isNaN(split[2])) return "  ";

  const monthIndex: string = (split[1] - 1).toString();

  return (
    split[2].toString() +
    " " +
    parseMonth[monthIndex as keyof Object] +
    " " +
    split[0].toString()
  );
};
const daysdifference = (start: string, end: string) => {
  const res =
    (new Date(end).getTime() - new Date(start).getTime()) / (3600 * 1000 * 24);

  return res;
};
const lessEightWeeks = (per: string) => {
  return new Date(new Date(per).getTime() - 3600 * 1000 * 24 * (7 * 8 + 1))
    .toISOString()
    .substring(0, 10);
};

const isDateValid = (date: string) => {
  return new Date(date).toString() !== "" && !isNaN(new Date(date).getTime());
};
const isDifferenceValid = (start: string, end: string): boolean => {
  return (
    new Date(end).getTime() - new Date(start).getTime() >= 4 * 3600 * 1000 * 24
  );
};
