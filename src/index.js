import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ButtonToolbar, DropdownButton, Dropdown } from "react-bootstrap";

class Box extends Component {
  handleChange = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.handleChange}
      />
    );
  }
}

class Grid extends Component {
  render() {
    const width = this.props.cols * 14;
    let rowsArr = [];
    let boxClass = "";

    for (let i = 0; i < this.props.rows; ++i) {
      for (let j = 0; j < this.props.cols; ++j) {
        let boxId = i + "_" + j;
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }

    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Buttons extends Component {
  handleSelect = (evt) => {
    this.props.gridSize(evt);
  };

  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-default" onClick={this.props.playButton}>
            Play
          </button>
          <button className="btn btn-default" onClick={this.props.pauseButton}>
            Pause
          </button>
          <button className="btn btn-default" onClick={this.props.clear}>
            Clear
          </button>
          <button className="btn btn-default" onClick={this.props.slow}>
            Slow
          </button>
          <button className="btn btn-default" onClick={this.props.fast}>
            Fast
          </button>
          <button className="btn btn-default" onClick={this.props.seed}>
            Seed
          </button>
        </ButtonToolbar>
        <DropdownButton
          title="Grid Size"
          id="size-menu"
          onSelect={this.handleSelect}
        >
          <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
          <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
          <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

class Main extends Component {
  constructor() {
    super();

    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generations: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
    };
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);

    gridCopy[row][col] = !gridCopy[row][col];

    this.setState({ gridFull: gridCopy });
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.props.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  fast = () => {
    this.speed = 10;
    this.playButton();
  };

  clear = () => {
    let grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));

    this.setState({
      gridFull: grid,
      generations: 0,
    });
  };

  gridSize = (size) => {
    if (size === "1") {
      this.cols = 20;
      this.rows = 10;
    } else if (size === "2") {
      this.cols = 50;
      this.rows = 30;
    } else {
      this.rows = 70;
      this.cols = 50;
    }

    this.clear();
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; ++j) {
        let count = 0;
        if (i > 0 && g[i - 1][j]) ++count;
        if (i > 0 && j > 0 && g[i - 1][j - 1]) ++count;
        if (i > 0 && j < this.cols - 1 && g[i - 1][j + 1]) ++count;
        if (j > 0 && g[i][j - 1]) ++count;
        if (j > 0 && i < this.rows - 1 && g[i + 1][j - 1]) ++count;
        if (i < this.rows - 1 && j < this.cols - 1 && g[i + 1][j + 1]) ++count;
        if (j < this.cols - 1 && g[i][j + 1]) ++count;
        if (i < this.rows - 1 && g[i + 1][j]) ++count;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }

    this.setState({
      gridFull: g2,
      generations: this.state.generations + 1,
    });
  };

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; ++j) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }

    this.setState({ gridFull: gridCopy });
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations : {this.state.generations}</h2>
      </div>
    );
  }
}

const arrayClone = (arr) => JSON.parse(JSON.stringify(arr));

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
