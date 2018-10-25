import * as React from "react";
// @ts-ignore
import { ListView, ListViewHeader, ListViewFooter, ListViewSection, ListViewSectionHeader, ListViewRow, ListViewSeparator, Text } from 'react-desktop/macOs';
import { Link } from "react-router";

export default class Layout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { selected: null };
  }

  renderSectionHeader(title: string) {
    return (
      <ListViewSectionHeader>
        {title}
      </ListViewSectionHeader>
    );
  }

  renderItem(title: string, info: string) {
    return (
      <ListViewRow
        onClick={() => this.setState({ selected: title })}
        background={this.state.selected === title ? '#d8dadc' : null}
      >
        <svg x="0px" y="0px" width="18" height="12" viewBox="0 0 18 12" style={{ marginRight: '6px' }}>
          <path fill="#727476" d="M13.2,0H4.9L0,6.8v3.7C0,11.3,0.7,12,1.5,12h15
    c0.8,0,1.5-0.7,1.5-1.5V6.8L13.2,0z M13.8,6.8L12.3,9L5.9,9L4.2,6.8l-3.1,0l4.2-6h7.4l4.2,6L13.8,6.8z"/>
          <polygon fill="#C9CBCD" points="13.8,6.8 12.3,9 5.9,9 4.2,6.8 1.2,6.7 5.4,0.8 12.8,0.8
    17,6.7 "/>
        </svg>
        <Text color="#414141" size="13">{info}</Text>
      </ListViewRow>
    );
  }

  render() {
    const { children } = this.props;
    return (
      <div className="pane-group">
        <div className="pane-sm sidebar">
          <ListView background="#f1f2f4">
            <ListViewSection header={this.renderSectionHeader('MENU')}>
              <Link to="/download">{this.renderItem('Item 1', 'Download')}</Link>
              <Link to="/upload">{this.renderItem('Item 2', 'Upload')}</Link>
              <Link to="/setting">{this.renderItem('Item 3', 'Setting')}</Link>
            </ListViewSection>
            <ListViewSeparator />
          </ListView>
        </div>
        <div className="pane">{children}</div>
      </div>
    );
  }

}
