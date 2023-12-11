import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./itemsSold.scss";
import ml_project1 from "../../data/ml_project1_data.csv";
import Dropdown from "../dropDown";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

function ItemsSold() {
  const [mlData, setMLData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState("All Incomes");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [selectedEducation, setSelectedEducation] = useState(
    "All Education Levels"
  );

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
    const processData = () => {
      let processed = mlData;

      if (selectedIncome !== "All Incomes") {
        const [minIncome, maxIncome] = selectedIncome
          .replace(/\$/g, "")
          .replace(/,/g, "")
          .split(" - ")
          .map(Number);
        processed = processed.filter(
          (item) =>
            parseInt(item.Income) >= minIncome &&
            parseInt(item.Income) <= maxIncome
        );
      }
      console.log(processed);

      if (selectedAge !== "All Ages") {
        const currentYear = new Date().getFullYear();
        const ageAsNumber = Number(selectedAge);
        const birthYear = currentYear - ageAsNumber;
        processed = processed.filter(
          (item) => parseInt(item.Year_Birth) === birthYear
        );
      }
      console.log(processed);
      if (selectedEducation !== "All Education Levels") {
        processed = processed.filter(
          (item) => item.Education === selectedEducation
        );
      }
      console.log(processed);
      const aggregatedData = processed.reduce((acc, curr) => {
        const year = curr.Dt_Customer.split("-")[0];
        if (!acc[year]) {
          acc[year] = {
            year,
            MntWines: 0,
            MntFruits: 0,
            MntMeatProducts: 0,
            MntFishProducts: 0,
            MntSweetProducts: 0,
            MntGoldProds: 0,
          };
        }
        acc[year].MntWines += parseInt(curr.MntWines);
        acc[year].MntFruits += parseInt(curr.MntFruits);
        acc[year].MntMeatProducts += parseInt(curr.MntMeatProducts);
        acc[year].MntFishProducts += parseInt(curr.MntFishProducts);
        acc[year].MntSweetProducts += parseInt(curr.MntSweetProducts);
        acc[year].MntGoldProds += parseInt(curr.MntGoldProds);

        return acc;
      }, {});

      return Object.values(aggregatedData);
    };

    setFilteredData(processData());
  }, [mlData, selectedIncome, selectedEducation, selectedAge]);

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

  let ages = [{ age: "All Ages" }, ...groupByIndividualAges(mlData)];
  let incomes = [{ income: "All Incomes" }, ...groupByIncome(mlData)];
  let educationData = [
    { education: "All Education Levels" },
    ...groupByEducation(mlData),
  ];

  const handleAgeChange = (selectedAge) => {
    setSelectedAge(selectedAge);
  };

  const handleIncomeRangeChange = (selectedIncome) => {
    setSelectedIncome(selectedIncome);
  };

  const handleEducationChange = (selectedEducation) => {
    setSelectedEducation(selectedEducation);
  };

  return (
    <div className="chart-contain">
      <h4>Products Sold</h4>
      <div className="chart-and-filters">
        <div className="chart">
          <LineChart width={600} height={375} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="MntWines" stroke="rgb(128,0,0)" />
            <Line type="monotone" dataKey="MntFruits" stroke="rgb(189,45,0)" />
            <Line
              type="monotone"
              dataKey="MntMeatProducts"
              stroke="rgb(255,30,0)"
            />
            <Line
              type="monotone"
              dataKey="MntFishProducts"
              stroke="rgb(54,81,105)"
            />
            <Line
              type="monotone"
              dataKey="MntSweetProducts"
              stroke="rgb(232,140,255)"
            />
            <Line
              type="monotone"
              dataKey="MntGoldProds"
              stroke="rgb(112,82,0)"
            />
          </LineChart>
        </div>
        <div className="filters">
          <Dropdown
            className="dropBox"
            placeHolder="Filter By Income:"
            options={incomes.map((incomeObj) => incomeObj.income)}
            onOptionSelected={handleIncomeRangeChange}
          />

          <Dropdown
            className="dropBox"
            placeHolder="Filter By Age:"
            options={ages.map((ageObj) => ageObj.age)}
            onOptionSelected={handleAgeChange}
          />

          <Dropdown
            className="dropBox"
            placeHolder="Filter By Education:"
            options={educationData.map(
              (educationObj) => educationObj.education
            )}
            onOptionSelected={handleEducationChange}
          />
        </div>
      </div>
    </div>
  );
}
export default ItemsSold;
