import './styles/styles.css'
import React from 'react'
import ReactDOM from 'react-dom'

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.runningMode = false;
    this.state = {
      breakTime: 5,
      sessionTime: 25,
      running: false,
      currentTime: 25 * 60,
      timerMode: false,
      label: "Session"
    };
    this.timer = null;
    this.handleMode0 = this.handleMode0.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.timerFunction = this.timerFunction.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleMode0(event) {
    let id = event.target.id;
    if (this.state.running == false) {
      if (id == "break-decrement" && this.state.breakTime > 1) {
        this.setState((state) => ({
          breakTime: state.breakTime - 1
        }));
      } else if (id == "break-increment" && this.state.breakTime < 60) {
        this.setState((state) => ({
          breakTime: state.breakTime + 1
        }));
      } else if (id == "session-decrement" && this.state.sessionTime > 1) {
        this.setState((state) => ({
          sessionTime: state.sessionTime - 1,
          currentTime: (state.sessionTime - 1) * 60
        }));
      } else if (id == "session-increment" && this.state.sessionTime < 60) {
        this.setState((state) => ({
          sessionTime: state.sessionTime + 1,
          currentTime: (state.sessionTime + 1) * 60
        }));
      }
    }
  }
  handleStartStop(event) {
    console.log("start-stop btn press one");
    if (this.state.running) {
      this.runningMode = !this.runningMode;
      console.log("runnigMode: " + this.runningMode);
      if (this.runningMode == true) {
        this.timerID = setInterval(() => this.timerFunction(), 1000);
        document.getElementById("time-left").style.color = "DarkSlateGray";
      } else {
        clearInterval(this.timerID);
        document.getElementById("time-left").style.color = "SlateGray";
      }
    } else {
      this.setState((state) => {
        return {
          running: true
        };
      });
      this.runningMode = true;
      console.log(
        "Exit Restart, Enter to Run Mode" + ">>runnigMode: " + this.runningMode
      );

      this.timerID = setInterval(() => this.timerFunction(), 1000);
      document.getElementById("time-left").style.color = "DarkSlateGray";
    }
  }

  handleReset() {
    clearInterval(this.timerID);
    this.setState((state) => ({
      breakTime: 5,
      sessionTime: 25,
      running: false,
      currentTime: 25 * 60,
      timerMode: false,
      label: "Session"
    }));
    this.runningMode = false;
    this.audioBeep.load();
    document.getElementById("time-left").style.color = "LightSlateGray";
  }

  timerFunction() {
    if (this.state.currentTime <= 0) {
      if (!this.state.timerMode) {
        this.setState((state) => ({
          label: "Break",
          currentTime: state.breakTime * 60,
          timerMode: !state.timerMode
        }));
      } else {
        this.setState((state) => ({
          label: "Session",
          currentTime: state.sessionTime * 60,
          timerMode: !state.timerMode
        }));
      }
    } else {
      this.setState((state) => ({
        currentTime: state.currentTime - 1
      }));
    }
  }

  render() {
    return (
      <>
        <div id="title">
          <p>CLOCK 25 + 5</p>
        </div>
        <div id="timer">
          <div id="lcd">
           <Display
              time={this.state.currentTime}
              labelState={this.state.label}
            />
            <br />
            <div className="controls">
              <button onClick={this.handleStartStop} id="start_stop">
                Start / Stop
              </button>
              <button onClick={this.handleReset} id="reset">
                Reset
              </button>
            </div>
            <audio
              id="beep"
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              ref={(audio) => {
                this.audioBeep = audio;
              }}
            />
            <SessionControls
              time={this.state.sessionTime}
              handleClick={this.handleMode0}
              appState={this.state.running}
            />
            <BreakControls
              time={this.state.breakTime}
              handleClick={this.handleMode0}
              appState={this.state.running}
            />
          </div>
        </div>
        <footer>Created by Ariana Spretz - Copyright 2022</footer>
      </>
    );
  }
}
class Display extends React.Component {
  constructor(props) {
    super(props);
    this.mmss = this.mmss.bind(this);
  }
  mmss(val) {
    if (val > 0) {
      let timeMM = Math.floor(val / 60);
      let timeSS = val % 60;
      return (
        ("0" + timeMM.toString()).slice(-2) +
        ":" +
        ("0" + timeSS.toString()).slice(-2)
      );
    } else {
      let audio = document.getElementById("beep");
      audio.load();
      audio.play();
      return "00:00";
    }
  }

  render() {
    return (
      <div id="screen">
        <p id="timer-label">{this.props.labelState}</p>
        <p id="time-left">{this.mmss(this.props.time)}</p>
      </div>
    );
  }
}

const SessionControls = function (props) {
  return (
    <div id="session-controls">
      <p id="session-label">Session Length</p>
      <div className="btn-controls">
        <p id="session-length" className={props.appState == false ? "no-frozen" : "frozen"}>{props.time}</p>
        <button id="session-decrement" onClick={props.handleClick}>Down</button>
        <button id="session-increment" onClick={props.handleClick}>Up</button>
      </div>
    </div>
  );
};

const BreakControls = function (props) {
  return (
    <div id="break-controls">
      <p id="break-label">Break Length</p>
      <div className="btn-controls">
        <p id="break-length" className={props.appState == false ? "no-frozen" : "frozen"}>{props.time}</p>
        <button id="break-decrement" onClick={props.handleClick}>Down</button>
        <button id="break-increment" onClick={props.handleClick}>Up</button>
      </div>
    </div>
  );
};

export default Timer;
ReactDOM.render(<Timer />, document.getElementById("root"));
