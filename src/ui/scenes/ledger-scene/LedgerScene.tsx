import * as React from "react";
import { Component } from "react";
import { render } from "react-dom";
import Transaction from "../../components/transaction/Transaction";
import { loginUser } from "../../../util/api-helpers";

export default class LedgerScene extends Component {

  async componentDidMount() {
    const bearerToken = await loginUser("joe", "password");
    console.log(bearerToken);
  }

  render() {
    return <div>Hi</div>;
  }

}