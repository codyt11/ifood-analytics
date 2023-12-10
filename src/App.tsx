import React, { useState } from "react";
import "./App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faForwardStep,
  faBackwardStep,
} from "@fortawesome/free-solid-svg-icons";
import Head from "./header/header";
import AgeBar from "./graphComponents/age-demo-bar/age-demo-bar";
import EducationBar from "./graphComponents/education-demo-bar/education-demo-bar";
import IncomeBar from "./graphComponents/income-demo-bar/income-demo-bar";
import TotalCustomers from "./graphComponents/totalCustomers/totalCustomers.js";
import ItemsSold from "./graphComponents/itemsSold/itemsSold.js";
import FoodPieChart from "./graphComponents/food-sales-pie-chart/food-sales-pie-chart";
import PurchaseBehavior from "./graphComponents/purchaseBehavior/purchaseBehavior";
import AvgRecentReturn from "./graphComponents/visitsPerMonth/avgRecentReturn";

const App = () => {
  const [currentChart, setCurrentChart] = useState("AgeBar");

  const charts = ["AgeBar", "EducationBar", "IncomeBar"];

  const nextChart = () => {
    const currentIndex = charts.indexOf(currentChart);
    const nextIndex = (currentIndex + 1) % charts.length;
    setCurrentChart(charts[nextIndex]);
  };

  const prevChart = () => {
    const currentIndex = charts.indexOf(currentChart);
    const prevIndex = (currentIndex - 1 + charts.length) % charts.length;
    setCurrentChart(charts[prevIndex]);
  };

  return (
    <div className="App">
      <div>
        <Head />
      </div>
      <div className="stats">
        <div className="top-contain">
          <div className="color"></div>
          <div className="widgets">WIDGETS</div>
        </div>
        <div className="graphs">
          <div className="demographics">
            <FontAwesomeIcon icon={faBackwardStep} onClick={prevChart} />
            {currentChart === "AgeBar" && <AgeBar />}
            {currentChart === "EducationBar" && <EducationBar />}
            {currentChart === "IncomeBar" && <IncomeBar />}
            <FontAwesomeIcon icon={faForwardStep} onClick={nextChart} />
          </div>
          <div className="items-sold">
            <ItemsSold />
          </div>
        </div>
        <div className="bottom-contain">
          <FoodPieChart />
          <TotalCustomers />
          <PurchaseBehavior />
          <AvgRecentReturn />
        </div>
      </div>
    </div>
  );
};

export default App;
