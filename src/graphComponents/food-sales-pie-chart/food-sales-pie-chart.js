import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./food-sales-pie-chart.scss";
import { PieChart, Pie, Cell, LabelList } from "recharts";
import ml_project1 from "../../data/ml_project1_data.csv";

function FoodPieChart() {
  const [mlData, setMLData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6666",
  ];

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
      const totalMntProducts = mlData.reduce(
        (totals, user) => {
          totals.mntFish += Number(user.MntFishProducts || 0);
          totals.mntFruits += Number(user.MntFruits || 0);
          totals.mntGold += Number(user.MntGoldProds || 0);
          totals.mntMeat += Number(user.MntMeatProducts || 0);
          totals.mntSweats += Number(user.MntSweetProducts || 0);
          totals.mntWines += Number(user.MntWines || 0);
          return totals;
        },
        {
          mntFish: 0,
          mntFruits: 0,
          mntGold: 0,
          mntMeat: 0,
          mntSweats: 0,
          mntWines: 0,
        }
      );

      setAllProducts([
        { name: "Fish", total: totalMntProducts.mntFish },
        { name: "Fruits", total: totalMntProducts.mntFruits },
        { name: "Gold", total: totalMntProducts.mntGold },
        { name: "Meat", total: totalMntProducts.mntMeat },
        { name: "Sweets", total: totalMntProducts.mntSweats },
        { name: "Wines", total: totalMntProducts.mntWines },
      ]);
    }
  }, [mlData]);

  return (
    <div className="pieChart">
      <h4>Products Sold</h4>
      <PieChart width={730} height={250}>
        <Pie
          data={allProducts}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
        >
          {allProducts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList
            dataKey="name"
            position="outside"
            style={{ fontSize: "20px", fontWeight: 1000, fill: "#000" }}
          />
        </Pie>
      </PieChart>
    </div>
  );
}

export default FoodPieChart;
