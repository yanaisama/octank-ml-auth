import React, { Component } from "react";
import "./Welcome.css";

export default class Welcome extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome</h1>
          <p>Hello !!!</p>
          <br></br>
          <img src="thanos.jpg" height="300" />
        </div>
      </div>
    );
  }
}
