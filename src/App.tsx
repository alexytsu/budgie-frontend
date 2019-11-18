import * as React from "react";
import { Component } from "react";
import LoginScene from "./ui/scenes/LoginScene";
import UserStore from "./stores/UserStore";
import ProfileScene from "./ui/scenes/ProfileScene";
import { observer } from "mobx-react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	withRouter
} from "react-router-dom";
import LedgerScene from "./ui/scenes/LedgerScene";
import apiHelpers from "./util/api-helpers";
import ApplicationStore from "./stores/ApplicationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import BudgetScene from "./ui/scenes/BudgetScene";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./custom.css";

import CategoryScene from "./ui/scenes/CategoryScene";
import NetWorthVsBudgetedGraph from "./ui/components/graphs/NetWorthVsBudgetedGraph";
import classNames = require("classnames");

const DEBUG = true;

@observer
class App extends Component<any, {}> {
	async componentDidMount() {
		if (DEBUG) {
			const loginResp = await apiHelpers.loginUser(
				"testmanpersonface",
				"password"
			);
			UserStore.token = loginResp.token;
			UserStore.username = "TestUserFacePersonManFace";
			ApplicationStore.init(loginResp.token);
		}

		console.log(this.props.location);
	}

	render() {
		if (!UserStore.authenticated) {
			return <LoginScene></LoginScene>;
		}

		return (
			<div className="bg-gray-900 h-screen flex">
				<Router>
							<Navbar></Navbar>
					<div className="bg-gray-100 rounded-lg rounded-r-none w-full pt-6 px-8 h-full">
						<div className="mx-auto h-full">
							<Switch>
								<Route path="/transactions">
									<LedgerScene></LedgerScene>
								</Route>
								<Route path="/budgets">
									<BudgetScene></BudgetScene>
								</Route>
								<Route path="/categories">
									<CategoryScene />
								</Route>
								<Route path="/accounts">
									<NetWorthVsBudgetedGraph></NetWorthVsBudgetedGraph>
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
const Navbar = withRouter(({...props}) => {
	console.log(props.location);

	const homeStyle = classNames({
		"py-4 px-8 text-lg font-semibold text-blue-100": true,
		"rounded-l-lg bg-blue-300 text-blue-900 font-bold": props.location.pathname === "/",
	});
	const ledgerStyle = classNames({
		"py-4 px-8 text-lg font-semibold text-teal-100": true,
		"rounded-l-lg bg-teal-300 text-teal-900 font-bold": props.location.pathname === "/transactions",
	});
	const budgetStyle = classNames({
		"py-4 px-8 text-lg text-green-100 font-semibold": true,
		"rounded-l-lg bg-green-300 text-green-900 font-bold": props.location.pathname === "/budgets",
	});
	const categoryStyle = classNames({
		"py-4 px-8 text-lg text-orange-100 font-semibold": true,
		"rounded-l-lg bg-yellow-300 text-yellow-900 font-bold": props.location.pathname === "/categories",
	});
	const accountStyle = classNames({
		"py-4 px-8 text-lg text-orange-100 font-semibold": true,
		"rounded-l-lg bg-orange-300 text-orange-900 font-bold": props.location.pathname === "/accounts",
	});
	

	return (
		<div className="shadow text-white flex-column justify-between">
			<div className="flex p-8">
				<FontAwesomeIcon
					className="self-center"
					icon={faDove}
				></FontAwesomeIcon>
				<h1 className="text-xl font-bold mx-2">Budgie</h1>
			</div>
			<div className={homeStyle}>
				<Link className="" to="/">
					Home
				</Link>
			</div>
			<div className={ledgerStyle}>
				<Link to="/transactions">
					Ledger
				</Link>
			</div>
			<div className={budgetStyle}>
				<Link to="/budgets">
					Budgets
				</Link>
			</div>
			<div className={categoryStyle}>
				<Link to="/categories">
					Categories
				</Link>
			</div>
			<div className={accountStyle}>
				<Link to="/accounts">
					Accounts
				</Link>
			</div>
		</div>
	);
});

export default App;
