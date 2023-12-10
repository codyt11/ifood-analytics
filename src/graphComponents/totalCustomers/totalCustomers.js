import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ml_project1 from "../../data/ml_project1_data.csv";
import "./totalCustomers.scss";

function TotalCustomers() {
  const [mlData, setMLData] = useState([]);
  const [cby, setCby] = useState({});
  const [change, setChange] = useState(null);

  useEffect(() => {
    Papa.parse(ml_project1, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        setMLData(result.data);
      },
    });
  }, []);

  useEffect(() => {
    if (mlData.length > 0) {
      const yearCounts = customerLengthOfTime(mlData);
      setCby(yearCounts);
    }
  }, [mlData]);

  const customerLengthOfTime = (data) => {
    let yearCounts = {};

    const currentDate = new Date();

    data.forEach((user) => {
      const customerDate = new Date(user.Dt_Customer);
      const lengthOfTimeInYears = Math.floor(
        (currentDate - customerDate) / (1000 * 60 * 60 * 24 * 365)
      );

      if (!yearCounts[lengthOfTimeInYears]) {
        yearCounts[lengthOfTimeInYears] = 1;
      } else {
        yearCounts[lengthOfTimeInYears]++;
      }
    });
    return yearCounts;
  };

  const largestKey = Object.keys(cby).reduce(
    (max, key) => Math.max(max, parseInt(key, 10)),
    0
  );

  useEffect(() => {
    const change = Math.round(((cby[11] - cby[10]) / cby[10]) * 100);
    setChange(change);
  }, [cby]);

  return (
    <div className="lengthOfUser">
      <div className="newCustomers">
        Customers over last year {cby[largestKey]}
      </div>
      <div className="change">
        change over year <br />
        <span
          style={{
            color: "red",
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          {change}%
        </span>
      </div>
    </div>
  );
}

export default TotalCustomers;
