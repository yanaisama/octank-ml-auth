import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Octank</h1>
          <p>Privacy that matters!!</p>
          <br></br>
          <img src="octank.png" height="300" alt="octank logo" />
        </div>
      </div>
    );
  }
}
