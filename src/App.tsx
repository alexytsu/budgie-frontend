import * as React from "react";
import { Component } from "react";
import LoginScene from "./ui/scenes/LoginScene";
import UserStore from "./stores/UserStore";
import ProfileScene from "./ui/scenes/ProfileScene";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LedgerScene from "./ui/scenes/LedgerScene";

@observer
export default class App extends Component {
	render() {
		if (!UserStore.authenticated) {
			return <LoginScene></LoginScene>;
		}

		return (
			<Router>
				<div className="p-4 flex justify-around bg-blue-600">
					<Link className="text-white" to="/">
						Home
					</Link>
					<Link className="text-white" to="/transactions">
						Ledger
					</Link>
				</div>

				<div className="">
					<Switch>
						<Route path="/transactions">
							<LedgerScene></LedgerScene>
						</Route>
						<Route path="/">
							<ProfileScene></ProfileScene>
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}
