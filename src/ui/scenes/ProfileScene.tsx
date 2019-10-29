import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import Transaction from "../components/transaction/Transaction";

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
			<div className="flex">
				<div>
					<h1 className="text-xl">{UserStore.username}</h1>

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

				<div className="h-full">
					<h2 className="font-bold my-4 text-lg">User Data</h2>

					<div className="flex flex-row justify-between h-full">
						<div>
							<button
								onClick={this.retrieveCategories}
								className="bg-teal-600 text-white py-2 px-8 rounded my-4"
							>
								Refresh Categories
							</button>
							<ShowCategories
								categories={ApplicationStore.categories_raw}
							></ShowCategories>
						</div>
						<div className="h-full">
							<button
								onClick={this.retrieveTransactions}
								className="bg-teal-600 text-white py-2 px-8 rounded my-4"
							>
								Refresh Transactions
							</button>
							<div className="overflow-y-scroll h-full">
								<ShowTransactions
									transactions={ApplicationStore.transactions_raw}
								/>
							</div>
						</div>
					</div>
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
		<div>
			{cat.id}: {cat.name}
		</div>
	));
}

function ShowTransactions(props) {
	return props.transactions.map(tr_raw => {
		const tr = apiHelpers.convertTransaction(tr_raw);
		console.log(tr_raw.date);
		return (
			<div>
				<div>{tr_raw.date}</div>
				<Transaction {...tr} />
			</div>
		);
	});
}
