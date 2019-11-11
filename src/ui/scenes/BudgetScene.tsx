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
import classNames = require("classnames");
import { CreateBudgetReq, BudgetPeriod } from "../../util/types/BudgetTypes";

interface BudgetSceneState {
	selectedBudgetId: number;
	newAmount: number;
}

@observer
export default class BudgetScene extends Component<{}, BudgetSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			selectedBudgetId: 1,
			newAmount: 0
		};
	}

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	updateBudget = () => {
		const newBud: CreateBudgetReq = {
			amount: this.state.newAmount,
			category: BudgetSceneStore.currentBudget.category,
			startDate: BudgetSceneStore.currentBudget.startDate,
			endDate: BudgetSceneStore.currentBudget.endDate
		};
		ApplicationStore.updateBudget(
			UserStore.token,
			BudgetSceneStore.selectedBudgetId,
			newBud
		);
	};

	render() {
		const bud = ApplicationStore.budgets_raw.find(
			b => b.id === BudgetSceneStore.selectedBudgetId
		);

		let dashboard = <></>;

		if (bud !== undefined) {
			const budget_disp = apiHelpers.convertBudget(bud);
			const graphData = {
				transactions: BudgetSceneStore.allTransactionsBudget,
				budget: budget_disp.limit
			};

			let fix = null;

			const buttonClass = classNames({
				"rounded bg-gray-500 text-white p-2": true,
				"bg-green-600": this.state.newAmount >= budget_disp.spent
			});

			fix = (
				<div className="rounded p-2 my-2 bg-white shadow flex justify-between">
					<div>
						<div>Allocate a New Amount:</div>
						<input
							name="newAmount"
							type="number"
							value={this.state.newAmount}
							onChange={this.changeHandler}
						></input>
					</div>
					<button onClick={() => this.updateBudget()} className={buttonClass}>
						Save Changes
					</button>
				</div>
			);

			const period_colour = classNames({
				"font-bold": true,
				"text-blue-500": budget_disp.period === BudgetPeriod.PAST,
				"text-green-500": budget_disp.period === BudgetPeriod.CURRENT,
				"text-yellow-500": budget_disp.period === BudgetPeriod.FUTURE
			});

			const period_colour_bg = classNames({
				"bg-blue-100": budget_disp.period === BudgetPeriod.PAST,
				"bg-green-100": budget_disp.period === BudgetPeriod.CURRENT,
				"bg-yellow-1	00": budget_disp.period === BudgetPeriod.FUTURE
			});

			let period_message = (
				<div className={period_colour}>{budget_disp.period.toUpperCase()}</div>
			);

			dashboard = (
				<div className="h-full flex">
					<div style={{ minWidth: 300 }} className="flex flex-col mx-2">
						<div className="font-bold text-4xl">
							{BudgetSceneStore.currentCategory.name}
						</div>
						<div className="my-4">
							{moment(bud.startDate)
								.format("DD MMM")
								.toUpperCase()}{" "}
							-{" "}
							{moment(bud.endDate)
								.format("DD MMM")
								.toUpperCase()}
						</div>
						<div
							className={
								period_colour_bg +
								" overflow-y-scroll mb-4 h-full rounded-lg shadow px-4"
							}
						>
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
					<div className="flex flex-col mx-2 flex-1">
						{period_message}
						<Budget selected={true} {...budget_disp}></Budget>
						{fix}
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
				<div className="flex flex-col">
					<div>
						<h1 className="text-xl mb-4">Budgets</h1>
						<AddNewBudgetModal></AddNewBudgetModal>
					</div>
					<div className="overflow-y-scroll">
						{ApplicationStore.getNetWorthOn(moment()) + "/" + ApplicationStore.getAmountBudgetdOn(moment())}
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
									}}
								>
									<div className="font-semibold">{b.category}</div>
									<Budget {...b}></Budget>
								</div>
							);
						})}
					</div>
				</div>
				<div className="w-full h-full ml-8">{dashboard}</div>
			</div>
		);
	}
}
