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
import { TransactionListDateSections } from "../components/transaction/TransactionLists";

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
				<div className="w-full h-full overflow-y-scroll mr-4 rounded-lg px-2">
					<TransactionListDateSections transactions={ApplicationStore.transactions_raw}></TransactionListDateSections>
				</div>
				<div className="w-full ml-4">
					<h1 className="text-xl">New Transaction</h1>
					<TransactionForm></TransactionForm>
				</div>
			</div>
		);
	}
}
