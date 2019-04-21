import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./PhotoChallenge.css";
import TakePhoto from "../components/TakePhoto";
import LoaderButton from "../components/LoaderButton";

export default class PhotoChallenge extends Component {
    render() {
        return (
          <div className="Login">
            <TakePhoto />
            <form onSubmit={this.handleSubmit}>
              <LoaderButton
                block
                bsSize="large"
                type="submit"
                text="Login"
                loadingText="Logging in…"
                />
            </form>
          </div>
        );
      }
}
