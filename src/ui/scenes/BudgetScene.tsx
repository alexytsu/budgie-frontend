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

import moment = require("moment");
import { ExpenseGraph } from "../components/graph/GraphType";
import Graph from "../components/graph/Graph";
import BudgetStories from "../../test/Budget.stories";

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
			const budget_disp = apiHelpers.convertBudget(bud);
			const graphData = {
				transactions: BudgetSceneStore.allTransactionsBudget,
				budget: budget_disp.limit,	
			}

			dashboard = (
				<div className="h-full flex">
					<div style={{ minWidth: 250 }} className="flex flex-col mx-2">
						<div className="font-bold text-4xl">
							{BudgetSceneStore.currentCategory.name}
						</div>
						<div className="my-4 font-bold text-lg text-gray-600">
							{moment(bud.startDate)
								.format("DD MMM")
								.toUpperCase()}{" "}
							-{" "}
							{moment(bud.endDate)
								.format("DD MMM")
								.toUpperCase()}
						</div>
						<div className="overflow-y-scroll mb-4 bg-gray-300 h-full rounded-lg shadow px-4">
							{BudgetSceneStore.allTransactionsBudget.length === 0 ? (
								<div className="my-2">
									No transactions recorded in this budget
								</div>
							) : (
								<TransactionListDateSections
									transactions={BudgetSceneStore.allTransactionsBudget}
								></TransactionListDateSections>
							)}
						</div>
					</div>
					<div className="flex flex-col mx-2d flex-1">
						<Budget {...budget_disp}></Budget>
						<div className="flex font-semibold py-4">
							<div>${budget_disp.spent.toFixed(2)} / </div>
							<div>${budget_disp.limit.toFixed(2)}</div>
						</div>
						<Graph {...graphData}></Graph>
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
