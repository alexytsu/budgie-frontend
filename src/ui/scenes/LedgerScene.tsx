import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import { TransactionDisplayProps } from "../../util/types/TransactionTypes";
import Transaction from "../components/transaction/Transaction";

@observer
export default class LedgerScene extends Component {
	render() {
		return ApplicationStore.transactions_raw.map(tr_raw => {
			const tr: TransactionDisplayProps = {
				account: "Test",
				amount: tr_raw.amount,
				category: tr_raw.category.toString(),
				type: tr_raw.operation,
				date: new Date(tr_raw.date),
				description: ""
			};

			return <Transaction {...tr}></Transaction>;
		});
	}
}
