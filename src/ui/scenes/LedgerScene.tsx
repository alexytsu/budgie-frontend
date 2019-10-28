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
		return (
			<>
				<h1 className="text-xl">Transactions</h1>
				<div className="flex">
					<div className="w-full">
						{ApplicationStore.transactions_raw.map(tr_raw => {
							const tr = apiHelpers.convertTransaction(tr_raw);
							return (
								<div className="my-2">
									<Transaction key={tr.id} {...tr}></Transaction>
								</div>
							);
						})}
					</div>
					<div className="w-full">
						<div>Mlem</div>
					</div>
				</div>
			</>
		);
	}
}
