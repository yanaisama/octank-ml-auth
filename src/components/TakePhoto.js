import React from "react";
import Webcam from "react-webcam";
import { s3Upload } from "../libs/awsLib";
import { Auth } from "aws-amplify";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
 
export default class TakePhoto extends React.Component {

    state = {
        imageData : null,
        image_name: "",
        saveImage: false

    }

    setRef = webcam => {
        this.webcam = webcam;
      };
     
    capture = (e) => {
        const imageSrc = this.webcam.getScreenshot();
        var file = dataURLtoFile(imageSrc, "teste.png");
        const attachment = file ? s3Upload(file) : null;
        console.log("file key: " + attachment);
        const credentials = Auth.currentCredentials();
        console.log("userId: " + credentials.identityId);
        const resposta = Auth.sendCustomChallengeAnswer(this.state.user,'private/' + credentials.identityId + '/' + attachment);
        console.log("Resultado login: " + resposta);
        
        if(resposta){
          this.props.history.push("/");
        }
    
        this.setState({
            imageData: imageSrc
        })
      };

      onClickRetake = (e) => {
          e.persist();
          this.setState({
              imageData: null
          })
      }

      onClickSave = (e) => {
          e.persist();
          this.setState((previousState) => {
              return{
                  saveImage:!previousState.saveImage
              }
          })
      }

      handleChange= (e) => {
          e.persist();
          this.setState({
              [e.target.name]: e.target.value
          })
      }
     
      render() {
        const videoConstraints = {
          width: 1280,
          height: 720,
          facingMode: "user"
        };
     
        return (
          <div className="TakePhoto">
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
    }

