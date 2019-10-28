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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

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
			<div className="bg-purple-800 h-screen flex">
				<Router>
					<div className="shadow text-white flex-column justify-between p-6">
						<div className="flex">
							<FontAwesomeIcon
								className="self-center"
								icon={faDove}
							></FontAwesomeIcon>
							<h1 className="text-xl font-bold mx-2">Budgie</h1>
						</div>
						<div className="mt-6">
							<Link className="text-sm self-center mx-1" to="/">
								Home
							</Link>
						</div>
						<div className="my-2">
							<Link className="text-sm self-center mx-1" to="/transactions">
								Ledger
							</Link>
						</div>
						<div className="my-2">
							<Link className="text-sm self-center mx-1" to="/budgets">
								Budgets
							</Link>
						</div>
						<div className="my-2">
							<Link className="text-sm self-center mx-1" to="/categories">
								Categories
							</Link>
						</div>
						<div className="my-2">
							<Link className="text-sm self-center mx-1" to="/accounts">
								Accounts
							</Link>
						</div>
					</div>

					<div className="bg-gray-300 rounded-lg rounded-r-none w-full pt-6 px-8">
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
					</div>
				</Router>
			</div>
		);
	}
}
