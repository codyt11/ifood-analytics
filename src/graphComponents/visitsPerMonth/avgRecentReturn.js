import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./avgRecentReturn.scss";
import ml_project1 from "../../data/ml_project1_data.csv";

function AvgRecentReturn() {
  const [mlData, setMLData] = useState([]);
  const [avgRecentReturn, setAvgRecentReturn] = useState([]);

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
      let totalReturn = 0;

      mlData.forEach((user) => {
        totalReturn += Number(user.Recency);
      });

      const average = Math.floor(totalReturn / mlData.length);
      setAvgRecentReturn(average);
    }
  }, [mlData]);

  return (
    <div className="recent">
      <p>Average Recent Return: {avgRecentReturn} Days.</p>
    </div>
  );
}
export default AvgRecentReturn;
