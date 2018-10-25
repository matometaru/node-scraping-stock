import * as React from "react";
interface State {
    coin: number;
}
export default class Coin extends React.Component<any, State> {
    constructor(props: any);
    handleOnClickCoin(): void;
    render(): JSX.Element;
}
export {};
