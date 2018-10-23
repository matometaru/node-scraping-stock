import * as React from "react";
import Errors from "./Errors";
import { isStockCode } from "../utils/useful";

const SIGNUP_FORM_STYLE = {
  margin: "0 auto",
  padding: 30
};

type State = {
  code: string;
  errors: string[];
}

export default class Download extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      code: "",
      errors: []
    };
    this.handleOnChangeCode = this.handleOnChangeCode.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
  }

  handleOnChangeCode(e: React.FormEvent) {
    this.setState({ code: (e.target as HTMLInputElement).value });
  }

  // 検索
  handleOnSearch(e: React.FormEvent) {
    const { code } = this.state;
    const errors = [];
    let isValid = true;
    e.preventDefault();
    if (!code.length) {
      isValid = false;
      errors.push("Code cann't be blank.");
    }
    if (!isValid) {
      // 必須入力チェックに該当した場合はエラーを表示する
      this.setState({ errors });
      return;
    }
    // 検索
    this.search().then(() => {
      // 検索結果表示
      this.show();
    }).catch(err => {
      this.setState({ errors: [err.message] });
    });
  }

  // 検索処理
  search() {
    return new Promise((resolve) => {
      if (isStockCode(this.state.code)) {
        console.log("search complete");
        resolve();
      }
    });
  }

  // 表示処理
  show() {
    return new Promise((resolve) => {
      console.log("show complete");
      resolve();
    });
  }

  render() {
    return (
      <form style={SIGNUP_FORM_STYLE} onSubmit={this.handleOnSearch}>
        <Errors errorMessages={this.state.errors} />
        <div className="form-group">
          <label>Email address*</label>
          <input
            type="input"
            className="form-control"
            placeholder="3798"
            value={this.state.code}
            onChange={this.handleOnChangeCode}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-large btn-primary">Create new account</button>
        </div>
      </form>
    );
  }
}
