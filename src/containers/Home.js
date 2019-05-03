import React, { Component } from "react";
import "./Home.css";
import YoutubeBackground from 'react-youtube-background'

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoURL: 'http://techslides.com/demos/sample-videos/small.mp4'
    };
  }

  render() {
    return (
      // <YoutubeBackground 
      //   videoId={string}     // default -> "jssO8-5qmag"
      //   aspectRatio={string} // default -> "16:9"
      //   overlay={string}       // defaults -> null | e.g. "rgba(0,0,0,.4)"
      //   className={string}   // defaults -> null
      //   onReady={func}       // defaults -> null
        
      // >
      //   {/* YOUR CONTENT */}
      // </YoutubeBackground>
      <div className="Home">
        <div className="lander">
          <h1>Ocktank</h1>
          <p>Privacy that matters!!</p>
          <br></br>
          <img src="octank.png" height="300" />
        </div>
        {/* <video id="background-video" loop autoPlay>
                <source src={this.state.videoURL} type="video/mp4" />
                <source src={this.state.videoURL} type="video/ogg" />
                Your browser does not support the video tag.
            </video> */
            }
      </div>
    );
  }
}
