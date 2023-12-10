import React from "react";
import Dropdown from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import "./header.scss";

function Head() {
  return (
    <div className="head-container">
      <div className="logo">IFOOD</div>
      <div className="filter">
        <div className="filter-top">
          <Dropdown placeHolder="Select..." />
          <div className="icons">
            <FontAwesomeIcon icon={faGear} />
            <FontAwesomeIcon icon={faBell} />
            <div className="menu">menu</div>
          </div>
        </div>
        <div className="filter-bottom">
          <div className="dash-name">IFOOD Data Analytics</div>
        </div>
      </div>
    </div>
  );
}
export default Head;
