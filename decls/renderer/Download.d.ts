import * as React from "react";
declare type State = {
    code: string;
    errors: string[];
};
export default class Download extends React.Component<any, State> {
    constructor(props: any);
    handleOnChangeCode(e: React.FormEvent): void;
    handleOnSearch(e: React.FormEvent): void;
    search(): Promise<{}>;
    show(): Promise<{}>;
    render(): JSX.Element;
}
export {};
