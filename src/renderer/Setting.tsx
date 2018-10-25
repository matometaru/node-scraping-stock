import * as React from "react";

const SIGNUP_FORM_STYLE = {
  margin: "0 auto",
  padding: 30
};

type State = {
  code: string;
  errors: string[];
}

export default class Download extends React.Component<any, State> {

  render() {
    return (
      <form style={SIGNUP_FORM_STYLE}>
        <div className="form-group">
          <label>Email address</label>
          <input type="text" className="form-control" placeholder="Email"></input>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control"></textarea>
        </div>
        <select className="form-control">
          <option>Option one</option>
          <option>Option two</option>
          <option>Option three</option>
          <option>Option four</option>
          <option>Option five</option>
          <option>Option six</option>
          <option>Option seven</option>
          <option>Option eight</option>
        </select>
      </form>
    );
  }
}
