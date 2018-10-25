import * as React from "react";
import { Link } from "react-router";
import { soundCoin } from "./sounds/coin";

interface State {
  coin: number,
}

export default class Coin extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      coin: 1
    };
    this.handleOnClickCoin = this.handleOnClickCoin.bind(this);
  }

  handleOnClickCoin() {
    const sc = "data:audio/wav;base64," + soundCoin();
    const sound = new Audio(sc);
    let count = this.state.coin;
    count++;
    this.setState({ coin: count });
    sound.play();
  }

  render() {
    return (
      <div className="form-group">
        <button className="btn btn-large btn-primary" onClick={this.handleOnClickCoin}>Get Coin</button>
        <p>{this.state.coin}</p>
        <Link to="/download">Download</Link>
      </div>
    );
  }
}
