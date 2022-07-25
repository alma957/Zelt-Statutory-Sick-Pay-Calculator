export interface Res {
  readonly week: string;
  readonly amount: string;
}
export const Results = (props: any): JSX.Element => {
  const results = props.results;

  if (results === undefined) return <></>;
  if (!props.enough) {
    return (
      <div>
        <p>{`You do not need to pay anything as your employee earns less than the statutory minimum`}</p>
      </div>
    );
  }
  const ress = (results as any).map((el: Res, index: number) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: index === results.length - 1 ? "none" : "solid",
        }}
      >
        <div>
          <p>{`For the week ending ${el.week} you need to pay:`}</p>
        </div>
        <div style={{ marginRight: "5px" }}>
          <p>
            <b>{el.amount}</b>
          </p>
        </div>
      </div>
    );
  });

  return <div>{ress}</div>;
};
