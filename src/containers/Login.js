import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import "./Login.css";
import { Auth } from "aws-amplify";
import config from "../config";
import { detectText } from "../libs/awsLib";
import FacebookButton from "../components/FacebookButton";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.base64 = null;

    this.state = {
        isLoading: false,
        email: "",
        password: ""
      };
      
  }

  validateForm() {
    return this.state.email.length > 0 ;
    //&& this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  getText = async () => {
    // Chamar a API do API Gateway para recuperar textos presentes na imagem enviada


    // try {
    //   const { bla} = await detectText(
    //     this.base64
    //   );

    //   console.log("bla:"+ bla);
    // } catch (err) {
    //   console.log("error", err);
    //   alert("An error has occured");
    // }


};

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
  
    try {
      //await Auth.signIn(this.state.email, this.state.password);
      Auth.signIn(this.state.email)
        //.then(user => console.log(user))
        .then(user => Auth.sendCustomChallengeAnswer(user,'5'))
        .then(()=> this.props.switchComponent("Welcome"))
        .catch(err => console.log(err));

      this.props.userHasAuthenticated(true);
      this.base64 = await getBase64(this.file);
      this.getText();

      this.props.history.push("/camera");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }  
  
  handleFbLogin = () => {
    this.props.userHasAuthenticated(true);
  };
  

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FacebookButton
            onLogin={this.handleFbLogin}
          />
          <hr />

          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
            />
        </form>
      </div>
    );
  }
}
