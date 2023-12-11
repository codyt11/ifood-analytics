import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./purchaseBehavior.scss";
import { PieChart, Pie, Cell, LabelList } from "recharts";
import ml_project1 from "../../data/ml_project1_data.csv";

function PurchaseBehavior() {
  const [mlData, setMLData] = useState([]);
  const [allPurchaseTypes, setAllPurchaseTypes] = useState([]);
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
      const totalPurchases = mlData.reduce(
        (totals, user) => {
          totals.deal += Number(user.NumDealsPurchases || 0);
          totals.web += Number(user.NumWebPurchases || 0);
          totals.catalog += Number(user.NumCatalogPurchases || 0);
          totals.store += Number(user.NumStorePurchases || 0);
          return totals;
        },
        {
          deals: 0,
          web: 0,
          catalog: 0,
          store: 0,
        }
      );

      setAllPurchaseTypes([
        { name: "Deals", total: totalPurchases.deals },
        { name: "Web", total: totalPurchases.web },
        { name: "Catalog", total: totalPurchases.catalog },
        { name: "Store", total: totalPurchases.store },
      ]);
    }
  }, [mlData]);

  return (
    <div className="pb-pieChart">
      <h4>Types of Purchases</h4>
      <PieChart width={730} height={250}>
        <Pie
          data={allPurchaseTypes}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
        >
          {allPurchaseTypes.map((entry, index) => (
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
export default PurchaseBehavior;
