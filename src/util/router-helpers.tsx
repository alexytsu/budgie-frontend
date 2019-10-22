import * as React from "react";
import { Component } from "react";

import { Route, Redirect } from "react-router-dom";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";

export interface ProtectedRoute_I {
  children: any;
  path: string;
}

@observer
export class ProtectedRoute extends Component<ProtectedRoute_I, {}> {
  constructor(props) {
    super(props);
  }

  render() {
		const { children, ...rest } = this.props;

    if (UserStore.token !== null) {
      return <Route path="/protected">{children}</Route>;
    }

    return (
      <Redirect
        to={{
					pathname: "/login",
        }}
      ></Redirect>
    );
  }
}
