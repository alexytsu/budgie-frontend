import * as React from "react";
import { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { observable } from "mobx";
import UserStore from "./stores/UserStore";
import LoginScene from "./ui/scenes/LoginScene";
import { ProtectedRoute } from "./util/router-helpers";
import ProfileScene from "./ui/scenes/ProfileScene";
import "./ui/tailwind.css";
import LedgerScene from "./ui/scenes/LedgerScene";

export default class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/login">
						<LoginScene></LoginScene>
					</Route>
					<Route path="/protected">
						<LedgerScene></LedgerScene>
					</Route>
				</Switch>

			</Router>

		);
	}

}