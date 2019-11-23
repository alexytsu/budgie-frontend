import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import Transaction from "../components/transaction/Transaction";
import BankForm from "../components/accounts/LinkAccount"


interface ProfileSceneState {
	showDev: boolean;
}

@observer
export default class ProfileScene extends Component<{}, ProfileSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			showDev: false
		};
	}

	toggleDev = () => {
		this.setState({ showDev: !this.state.showDev });
	};

	retrieveCategories = async () => {
		ApplicationStore.categories_raw = await apiHelpers.getAllCategories(
			UserStore.token
		);
	};

	retrieveTransactions = async () => {
		ApplicationStore.transactions_raw = await apiHelpers.getAllTransactions(
			UserStore.token
		);
	};

	render() {
		return (
			<div className="flex h-full">
				<div className="h-full">
					<h1 className="text-xl">{UserStore.username}</h1>

					<div>First Name: {UserStore.first_name}</div>
					<div>Last Name: {UserStore.last_name}</div>
					<div>Email: {UserStore.email}</div>

					<div className="font-bold my-4">Show developer options</div>
					<button
						onClick={this.toggleDev}
						className="bg-red-600 text-white py-2 px-8 rounded m-4"
					>
						{this.state.showDev ? "Hide" : "Show"}
					</button>

					{this.state.showDev ? (
						<DevOptions store={UserStore}></DevOptions>
					) : null}

					<button
						className="bg-red-600 text-white py-2 px-8 rounded m-4"
						onClick={() => UserStore.logout()}
					>
						Logout
					</button>
				</div>
				<div>
					<BankForm></BankForm>
				</div>
			</div>
		);
	}
}

function DevOptions(props) {
	return (
		<div>
			<div>Token: {props.store.token}</div>
		</div>
	);
}

function ShowCategories(props) {
	return props.categories.map(cat => (
		<div key={cat.id}>
			{cat.id}: {cat.name}
		</div>
	));
}

function ShowTransactions(props) {
	return props.transactions.map(tr_raw => {
		const tr = apiHelpers.convertTransaction(tr_raw);
		return (
			<div key={tr_raw.id}>
				<div>{tr_raw.date}</div>
				<Transaction {...tr} />
			</div>
		);
	});
}
