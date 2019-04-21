import React from "react";
import Webcam from "react-webcam";
 
export default class TakePhoto extends React.Component {

    state = {
        imageData : null,
        image_name: "",
        saveImage: false

    }

    setRef = webcam => {
        this.webcam = webcam;
      };
     
      capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        
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

