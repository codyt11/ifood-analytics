import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import Dropdown from "../dropDown";
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

function AgeBar() {
  const [mlData, setMLData] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState("All Ages");

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
  const CustomTick = (props) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };

  const groupByAge = (data) => {
    const ageGroups = {};
    const rangeSize = 10;

    data.forEach((user) => {
      const age = new Date().getFullYear() - user.Year_Birth;
      if (age > 100 || age < 15) {
        return;
      }
      const rangeStart = Math.floor(age / rangeSize) * rangeSize;
      const rangeEnd = rangeStart + rangeSize;
      const rangeKey = `${rangeStart}-${rangeEnd}`;

      if (rangeKey in ageGroups) {
        ageGroups[rangeKey] += 1;
      } else {
        ageGroups[rangeKey] = 1;
      }
    });

    return Object.keys(ageGroups)
      .map((range) => ({
        ageRange: range,
        count: ageGroups[range],
      }))
      .sort((a, b) => {
        const aStart = parseInt(a.ageRange.split("-")[0], 10);
        const bStart = parseInt(b.ageRange.split("-")[0], 10);
        return aStart - bStart;
      });
  };

  const groupByIndividualAges = (data) => {
    const ageCounts = {};

    data.forEach((user) => {
      const age = new Date().getFullYear() - user.Year_Birth;
      if (age > 100 || age < 15) {
        return;
      }

      if (age in ageCounts) {
        ageCounts[age] += 1;
      } else {
        ageCounts[age] = 1;
      }
    });

    return Object.keys(ageCounts)
      .map((age) => ({
        age: Number(age),
        count: ageCounts[age],
      }))
      .sort((a, b) => a.age - b.age);
  };

  const ageData = useMemo(() => {
    return mlData.length > 0 ? groupByAge(mlData) : [];
  }, [mlData]);

  const individualAgeData = useMemo(
    () => groupByIndividualAges(mlData),
    [mlData]
  );

  const filteredData = useMemo(() => {
    if (!selectedAgeRange || selectedAgeRange === "All Ages") {
      return individualAgeData;
    }

    const [start, end] = selectedAgeRange.split("-").map(Number);
    return individualAgeData.filter(
      (item) => item.age >= start && item.age < end
    );
  }, [individualAgeData, selectedAgeRange]);

  useEffect(() => {
    if (ageData.length > 0) {
      const newAgeOptions = [
        "All Ages",
        ...ageData.map((ageGroup) => ageGroup.ageRange),
      ];
      setAgeOptions(newAgeOptions);
    }
  }, [ageData]);

  const handleAgeRangeChange = (selectedRange) => {
    setSelectedAgeRange(selectedRange);
  };

  return (
    <div>
      <div>
        <h4>Demographic By Age</h4>
      </div>

      <BarChart
        width={600}
        height={400}
        data={filteredData}
        margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" tick={<CustomTick />} />
        <YAxis />
        <Tooltip />

        <Legend align="right" verticalAlign="top" />
        <Bar dataKey="count" fill="rgb(126,180,45)" />
      </BarChart>

      <Dropdown
        placeHolder="Filter By:"
        options={ageOptions}
        onOptionSelected={handleAgeRangeChange}
      />
    </div>
  );
}

export default AgeBar;
