import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import ApplicationStore from "../../stores/ApplicationStore";
import Transaction from "../components/transaction/Transaction";
import TransactionForm from "../components/transaction/TransactionForm";
import moment = require("moment");
import { number } from "prop-types";
import { triggerAsyncId } from "async_hooks";
import UserStore from "../../stores/UserStore";

interface LedgerSceneState {
	selectedTransactionId: number;
}

@observer
export default class LedgerScene extends Component<{}, LedgerSceneState> {
	constructor(props) {
		super(props);
		this.state = { selectedTransactionId: 0 };
	}

	render() {
		return (
			<div className="flex h-full pb-4">
				<div className="w-full h-full overflow-y-scroll mr-4 shadow rounded-lg px-2 bg-gray-100">
					{ApplicationStore.transactions_raw
						.sort((a, b) => {
							return moment(b.date).diff(a.date);
						})
						.map(tr_raw => {
							const tr = apiHelpers.convertTransaction(tr_raw);

							if (tr.id === this.state.selectedTransactionId) {
								return (
									<div key={tr.id} className="my-2 bg-red-300 p-2 rounded-lg">
										<Transaction {...tr}></Transaction>
									</div>
								);
							}

							return (
								<div
									key={tr.id}
									onClick={() => {
										this.setState({ selectedTransactionId: tr.id });
									}}
									className="my-2"
								>
									<Transaction {...tr}></Transaction>
								</div>
							);
						})}
					{this.state.selectedTransactionId !== 0 ? (
						<button
							className="rounded bg-red-600 text-white p-2 shadow"
							onClick={() => {
								ApplicationStore.deleteTransaction(
									UserStore.token,
									this.state.selectedTransactionId
								);
							}}
						>
							Delete
						</button>
					) : null}
				</div>
				<div className="w-full ml-4">
					<h1 className="text-xl">New Transaction</h1>
					<TransactionForm></TransactionForm>
				</div>
			</div>
		);
	}
}
