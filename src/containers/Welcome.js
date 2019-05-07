import React, { Component } from "react";
import "./Welcome.css";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import config from "../config";

// Function that calls an operation through API Gateway using access token
function callAuthStuff(message, token) {
  return API.post(config.apiGateway.API_NAME, "/doauthstuff ", {
    body: {
      'message': message
    },
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': token.replace(/"/g,"")
    }
  });
}

export default class Welcome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isKilled: false
    };
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    try {
      await callAuthStuff('Destroy!!', this.props.location.state.token);
      this.setState({ isKilled: true });
      this.props.history.push("/welcome");

    } catch (e) {
      alert(e.message);
    }
  }

  renderThanos(){
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome {this.props.location.state.nome}</h1>
          <br></br>
          <img src="thanos.jpg" height="300" />
          <form onSubmit={this.handleConfirmationSubmit}>
              <LoaderButton
                block
                bsSize="large"
                type="submit"
                isLoading={this.state.isLoading}
                text="Kill half the universe.."
                loadingText="Killing..."
              />
          </form>
        </div>
      </div>
    );
  }

  renderEndGame(){
    return (
      <div className="Home">
        <div className="lander">
          <h1>HAHHAHAHAHAHAHAHAAH !!!!</h1>
          <br></br>
          <img src="everyone.jpg" height="300" />
        </div>
      </div>
    );
  }

  render() {
    return (<div className="Welcome">
        {this.state.isKilled
          ? this.renderEndGame()
          : this.renderThanos()}
      </div>)
  }
}
