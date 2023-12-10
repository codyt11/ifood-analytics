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

function EducationBar() {
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

  const groupByEducation = (data) => {
    const educationCounts = {};

    data.forEach((user) => {
      const education = user.Education;
      if (education in educationCounts) {
        educationCounts[education] += 1;
      } else {
        educationCounts[education] = 1;
      }
    });

    return Object.keys(educationCounts)
      .map((education) => ({
        education: education,
        count: educationCounts[education],
      }))
      .sort((a, b) => a.education - b.education);
  };

  const educationData = groupByEducation(mlData);

  return (
    <BarChart
      width={600}
      height={400}
      data={educationData}
      margin={{
        top: 20,
        right: 30,
        left: 10,
        bottom: 25,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="education"
        label={{
          value: "Education",
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

export default EducationBar;
