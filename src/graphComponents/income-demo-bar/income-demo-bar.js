import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ml_project1 from "../../data/ml_project1_data.csv";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

function IncomeBar() {
  const [mlData, setMLData] = useState([]);

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

  const groupByIncome = (data) => {
    const incomeCounts = {};

    data.forEach((user) => {
      const incomeBucket = Math.floor(user.Income / 5000) * 5000;

      // Creating a label for the bucket (e.g., "$0 - $9999")
      const incomeLabel = `$${incomeBucket} - $${incomeBucket + 5000}`;

      if (incomeLabel in incomeCounts) {
        incomeCounts[incomeLabel] += 1;
      } else {
        incomeCounts[incomeLabel] = 1;
      }
    });

    return Object.entries(incomeCounts)
      .map(([label, count]) => {
        const [start] = label
          .split(" - ")
          .map((s) => parseInt(s.replace(/\D/g, "")));
        return { label, count, start };
      })
      .sort((a, b) => a.start - b.start)
      .map(({ label, count }) => ({ income: label, count }));
  };

  const incomeData = groupByIncome(mlData);
  console.log(incomeData);

  return (
    <BarChart
      width={600}
      height={400}
      data={incomeData}
      margin={{
        top: 20,
        right: 30,
        left: 10,
        bottom: 25,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="income"
        label={{
          value: "Income",
          position: "insideBottom",
          offset: -20,
          style: { textAnchor: "middle" },
        }}
      />
      <YAxis />
      <Tooltip />
      <Legend align="right" verticalAlign="top" />
      <Bar dataKey="count" fill="rgb(181,214,61)" />
    </BarChart>
  );
}

export default IncomeBar;
