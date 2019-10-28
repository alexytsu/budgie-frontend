import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";

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
		ApplicationStore.categories_raw = await apiHelpers.getAllCategories(UserStore.token);
	};

	retrieveTransactions = async () => {
		ApplicationStore.transactions_raw = await apiHelpers.getAllTransactions(UserStore.token);
	};

	render() {
		return (
			<div className="bg-gray-200 h-screen w-screen">
				<div className="container mx-auto pt-10">
					<div className="w-2/3 mx-auto bg-white p-8 rounded shadow">
						<h1 className="font-sans text-3xl font-semibold text-gray-800 text-center">
							{UserStore.username}
						</h1>

						<div className="font-bold my-4">Show developer options</div>
						<button
							onClick={this.toggleDev}
							className="bg-red-600 text-white py-2 px-8 rounded my-4"
						>
							{this.state.showDev ? "Hide" : "Show"}
						</button>
						{this.state.showDev ? (
							<DevOptions token={UserStore.token}></DevOptions>
						) : null}

						<div className="font-bold my-4 text-lg">User Data</div>

						<div className="flex flex-row justify-between">
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
							<div>
								<button
									onClick={this.retrieveTransactions}
									className="bg-teal-600 text-white py-2 px-8 rounded my-4"
								>
									Refresh Transactions
								</button>
								<ShowTransactions
									transactions={ApplicationStore.transactions_raw}
								/>
							</div>
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
						</div>
						<button
							className="bg-red-600 text-white py-2 px-8 rounded my-4"
							onClick={() => UserStore.logout()}
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		);
	}
}

function DevOptions(props) {
	return <div>Token: {props.token}</div>;
}

function ShowCategories(props) {
	return props.categories.map(cat => (
		<div>
			{cat.id}: {cat.name}
		</div>
	));
}

function ShowTransactions(props) {
	return props.transactions.map(tr => (
		<div>
			{tr.id}: {tr.amount}
		</div>
	));
}
