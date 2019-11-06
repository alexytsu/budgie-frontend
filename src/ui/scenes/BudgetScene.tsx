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
			b => b.id === this.state.selectedBudgetId
		);

		let dashboard = null;

		if (bud !== undefined) {
			const budProps = apiHelpers.convertBudget(bud);
			dashboard = (
				<>
					<div className="text-2xl">{budProps.category}</div>
					<div className="text-xl my-2">Transactions between {bud.startDate} - {bud.endDate}</div>
					{ApplicationStore.transactions_raw
						.filter(tr => tr.id === bud.category)
						.map(tr => apiHelpers.convertTransaction(tr))
						.map(tr => (
							<Transaction {...tr} />
						))}
				</>
			);
		}

		return (
			<div className="flex">
				<div className="w-1/2">
					<h1 className="text-xl mb-4">Budgets</h1>
					<AddNewBudgetModal></AddNewBudgetModal>
					{ApplicationStore.budgets_raw.map(b_raw => {
						const b = apiHelpers.convertBudget(b_raw);
						if (b.id === this.state.selectedBudgetId) {
							b.selected = true;
						}
						return (
							<div
								className="mb-8"
								key={b.id}
								onClick={() => this.setState({ selectedBudgetId: b.id })}
							>
								<div className="font-semibold text-green-800">{b.category}</div>
								<Budget {...b}></Budget>
							</div>
						);
					})}
				</div>
				<div className="w-full ml-8">{dashboard}</div>
			</div>
		);
	}
}
