import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import Budget from "../components/budget/Budget";
import AddNewBudgetModal from "../components/budget/AddNewBudgetModal";
import Transaction from "../components/transaction/Transaction";
import BudgetSceneStore from "../../stores/BudgetSceneStore";
import { TransactionListDateSections } from "../components/transaction/TransactionLists";

interface BudgetSceneState {
	selectedBudgetId: number;
}

@observer
export default class BudgetScene extends Component<{}, BudgetSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			selectedBudgetId: 1
		};
	}

	render() {
		const bud = ApplicationStore.budgets_raw.find(
			b => b.id === BudgetSceneStore.selectedBudgetId
		);

		let dashboard = null;

		if (bud !== undefined) {
			const budProps = apiHelpers.convertBudget(bud);
			dashboard = (
				<div className="h-full flex">
					<div className="flex flex-col mx-2">
						<div>All Time Transactions</div>
						<div className="overflow-y-scroll">
							{
								<TransactionListDateSections
									transactions={BudgetSceneStore.allTransactionsCategory}
								></TransactionListDateSections>
							}
						</div>
					</div>
					<div className="flex flex-col mx-2d">
						<div>In This Budget</div>
						<div className="overflow-y-scroll">
							{
								<TransactionListDateSections
									transactions={BudgetSceneStore.allTransactionsBudget}
								></TransactionListDateSections>
							}
						</div>
					</div>
				</div>
			);
		}


		return (
			<div className="flex h-full">
				<div>
					<h1 className="text-xl mb-4">Budgets</h1>
					<AddNewBudgetModal></AddNewBudgetModal>
					{ApplicationStore.budgets_raw.map(b_raw => {
						const b = apiHelpers.convertBudget(b_raw);
						if (b.id === BudgetSceneStore.selectedBudgetId) {
							b.selected = true;
						}
						return (
							<div
								className="mb-8"
								key={b.id}
								onClick={() => {
									BudgetSceneStore.selectedBudgetId = b.id;
									console.log(b.id);
								}}
							>
								<div className="font-semibold text-green-800">{b.category}</div>
								<Budget {...b}></Budget>
							</div>
						);
					})}
				</div>
				<div className="w-full h-full ml-8">{dashboard}</div>
			</div>
		);
	}
}
