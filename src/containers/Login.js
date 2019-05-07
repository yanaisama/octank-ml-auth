import React, { Component } from "react";
import Webcam from "react-webcam";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth, API } from "aws-amplify";
import { s3UploadPub } from "../libs/awsLib";
import config from "../config";
import "./Login.css";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}


// Function that calls API Gateway to user login
function login(email) {
  return API.put(config.apiGateway.API_NAME, "/signin", {
    body: {
      username: email,
      password: null
    }
  });
}

// Function that calls API Gateway to respond to Challenge requested on login
function sendAuthAnswer(email, answer, session) {
  return API.put(config.apiGateway.API_NAME, "/sendcustomchallengeanswer", {
    body: {
      'username': email,
      'answer': answer,
      'session': session
    }
  });
}

// Function that parser the IdToken returned after login to get the user info
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(base64);
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: "",
        user: null,
        screenshot: null,
        imageData : null,
        image_name: "",
        saveImage: false,
        validated: false,
        attachment: "",
        session: ""
      };
      
  }

  validateForm() {
    return this.state.email.length > 0 ;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
  
    try {

      // User login through API Gateway
      const respAuth = await login(this.state.email);
      var respJS = JSON.parse(respAuth.body);
      this.setState({session: respJS.Session});
      
      //const cognituser = await Auth.signIn(this.state.email);
      this.setState({user: respJS.Username}); 
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }  
  
  async isAuthenticated() {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  }

  handleFbLogin = () => {
    this.props.userHasAuthenticated(true);
  };

  setRef = webcam => {
    this.webcam = webcam;
  };
  
  capture = async event => {

    // Capture image from user camera and send it to S3
    const imageSrc = this.webcam.getScreenshot();
    var file = dataURLtoFile(imageSrc, "id.png");
    const attachment = await s3UploadPub(file);

    // Response to login challenge through API Gateway
    const resp2 = await sendAuthAnswer(this.state.email, 'public/' + attachment, this.state.session)
    
    // Traditional way to respond login challenge using Amplify's Auth API
    // const resposta = await Auth.sendCustomChallengeAnswer(this.state.user,'public/' + attachment);

    if(resp2.statusCode == "200"){
      const tokens = JSON.parse(resp2.body);
      console.log('JWT:'+ JSON.stringify(parseJwt(tokens.idToken)));
      const nomeUser = parseJwt(tokens.idToken).name;
      this.props.history.push(
        {pathname: '/welcome', 
         state: {token: tokens.accessToken, nome: nomeUser}});
      this.props.userHasAuthenticated(true);
    }else{
      alert("Erro de autenticação. Favor tentar novamente!");
      this.setState({user: null, isLoading: false});
      this.props.history.push("/login");
    }
  };

  renderForm() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          {/* <FacebookButton
            onLogin={this.handleFbLogin}
          /> */}
          <hr />
          {/* <div className="TakePhoto">
            <Webcam
              audio={false}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={350}
              videoConstraints={videoConstraints}
            />
            <button onClick={this.capture}>Capture photo</button>
        </div> */}
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

  renderCameraForm() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
        <div className="Login">
            <Webcam
              audio={false}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={350}
              videoConstraints={videoConstraints}
            />
            <button onClick={this.capture}>Capture photo</button>
        </div>
    );
  }

  render(){
     return (<div className="Signup">
        {this.state.user === null
          ? this.renderForm()
          : this.renderCameraForm()}
      </div>)
  }
}
