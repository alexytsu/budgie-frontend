import * as React from "react";
import { Component } from "react";
import { render } from "react-dom";
import { observer } from "mobx-react";

import Transaction from "../../components/transaction/Transaction";
import { loginUser } from "../../../util/api-helpers";

@observer
export default class LedgerScene extends Component {

  async componentDidMount() {
    const bearerToken = await loginUser("joe", "password");
  }

  render() {
    return <div>Hi</div>;
  }

}