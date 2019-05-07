import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import { parserCNH} from "../libs/awsLib";
import FacebookButton from "../components/FacebookButton";
import AWS from "aws-sdk";

// Function that returns the file content as base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Function that calls the Rekognition's DetectText API for extract info
// from user Identification
async function DetectText(imageData, email, password, callback) {
  AnonLog();

  var rekognition = new AWS.Rekognition();
  var params = {
    Image: {
      Bytes: imageData
    }
  };
  rekognition.detectText(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
     var texto = "";
      // show each face and build out estimated age table
      for (var i = 0; i < data.TextDetections.length; i++) {
        texto += ' ' + data.TextDetections[i].DetectedText;
      }
      console.log("saida: " + texto);
      callback(texto, email, password);
    }
  });
}

//Provides anonymous log on to AWS services
function AnonLog() {  
  // Configure the credentials provider to use your identity pool
  AWS.config.region = config.cognito.REGION; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
  });
}

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.base64 = null;

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null,
      nome: ""
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
    this.base64 = getBase64(this.file);
  }


  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5 TB.');
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {

      // Upload attachment provided by the user to S3 in a secure bucket
      const attachment = this.file
      ? await s3Upload(this.file, this.state.email)
      : null;

      // identifying information on the document image
      this.base64 = await getBase64(this.file);
      var image = null;
      image = atob(this.base64.split(";base64,")[1]);
      var length = image.length;
      var imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
      }

      var nome = "";

      const novoUser = await DetectText(imageBytes, this.state.email, this.state.password, function(texto, email, password){
        nome =  parserCNH(texto);
        console.log("Name::: " + nome);
        console.log("Email::: " + email);
        console.log("Pass::: " + password);

        // User sign up at Cognito User Pool using infos extract from his Identification
        return Auth.signUp({
          username: email,
          password: password,
          attributes: 
          {
            name: nome,
            'custom:s3-image-object': attachment
          }
        });
      });
      this.setState({newUser: novoUser});
      
    } catch (e) {
      alert(e.message);
    }
  
    this.setState({ isLoading: false });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      // User sign up confirmation
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      //await Auth.signIn(this.state.email, this.state.password);
  
      //this.props.userHasAuthenticated(true);

      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }
  

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  handleFbLogin = () => {
    this.props.userHasAuthenticated(true);
  };
  

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* <FacebookButton
            onLogin={this.handleFbLogin}
          />
          <hr /> */}

        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="file">
            <ControlLabel>Documento CNH</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
