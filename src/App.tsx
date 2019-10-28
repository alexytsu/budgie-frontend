import * as React from "react";
import { Component } from "react";
import LoginScene from "./ui/scenes/LoginScene";
import UserStore from "./stores/UserStore";
import ProfileScene from "./ui/scenes/ProfileScene";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LedgerScene from "./ui/scenes/LedgerScene";
import apiHelpers from "./util/api-helpers";
import ApplicationStore from "./stores/ApplicationStore";

const DEBUG = true;

@observer
export default class App extends Component {
	async componentDidMount() {
		if (DEBUG) {
			const loginResp = await apiHelpers.loginUser("joe", "password");
			UserStore.token = loginResp.token;
			UserStore.username = "Joe";
			ApplicationStore.transactions_raw = await apiHelpers.getAllTransactions(
				UserStore.token
			);
			ApplicationStore.categories_raw = await apiHelpers.getAllCategories(
				UserStore.token
			);
		}
	}

	render() {
		if (!UserStore.authenticated) {
			return <LoginScene></LoginScene>;
		}

		return (
			<div className="bg-gray-100 h-screen">
			<Router>
				<div className="bg-blue-900 mb-6 shadow">
					<div className="container mx-auto flex justify-between py-4">
						<Link className="text-white" to="/">
							Home
						</Link>
						<Link className="text-white" to="/transactions">
							Ledger
						</Link>
					</div>
				</div>

				<div className="container mx-auto">
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
			</div>
		);
	}
}
