import * as React from "react";

export default class List extends React.Component<any, any> {

  // const { children } = this.props;
  // const validChildren = React.Children.toArray(children);

  render() {
    const list = [
      { name: "2018.css", size: "446" },
      { name: "2017.css", size: "446" },
      { name: "2016.css", size: "446" },
      { name: "2015.css", size: "446" },
    ];

    return (
      <table className="table-striped" >
        <thead>
          <tr>
            <th>名前</th>
            <th>変更日</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
