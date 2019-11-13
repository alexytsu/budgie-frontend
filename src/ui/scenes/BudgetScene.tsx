import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import * as ReactModal from "react-modal";

ReactModal.setAppElement("#root");

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
import BudgetOverTimeGraph from "../components/budget/BudgetOverTimeGraph";

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

			let period_message = (
				<div className={period_colour}>{budget_disp.period.toUpperCase()}</div>
			);

			dashboard = (
				<div className="h-full flex">
					<div style={{ minWidth: 300 }} className="flex flex-col mx-2">
						<div className="font-bold text-4xl">
							{BudgetSceneStore.currentCategory.name}
						</div>
						<div className="font-semibold text-gray-700 mt-4">
						TRANSACTIONS
						</div>
						<div className="mb-2">
							{moment(bud.startDate)
								.format("DD MMM")
								.toUpperCase()}{" "}
							-{" "}
							{moment(bud.endDate)
								.format("DD MMM")
								.toUpperCase()} 
						</div>
						<div className="overflow-hidden overflow-y-scroll mb-4 h-full">
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
				<ReactModal
					isOpen={BudgetSceneStore.modalOpen}
					onRequestClose={() => BudgetSceneStore.closeModal()}
				>
					<AddNewBudgetModal></AddNewBudgetModal>
					<BudgetOverTimeGraph></BudgetOverTimeGraph>
				</ReactModal>
				<div style={{ minWidth: 250 }} className="flex flex-col mr-8">
					<div>
						<h1 className="text-xl mb-4">Budgets</h1>
					</div>
					<AmountBudgetedSummary date={moment()}></AmountBudgetedSummary>
					<button
						className="p-1 rounded bg-green-700 text-white my-4 font-semibold"
						onClick={() => BudgetSceneStore.openModal()}
					>
						Add Budget
					</button>
					<div className="overflow-y-scroll">
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

const AmountBudgetedSummary = observer((props: { date: moment.Moment }) => {
	return (
		<div className="text-sm rounded border px-2">
			<table className="my-2 table-auto text-right text-sm w-full">
				<thead>
					<tr className="text-gray-700">
						<th className="text-left pb-2">Date</th>
						<th className="pb-2">Budgeted</th>
						<th className="pb-2">Net Worth</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="text-left">Today</td>
						<td>{ApplicationStore.getAmountBudgetdOn(moment())}</td>
						<td>{ApplicationStore.getNetWorthOn(moment())}</td>
					</tr>
					<tr>
						<td className="text-left py-2">Last Month</td>
						<td className="py-2">
							{ApplicationStore.getAmountBudgetdOn(
								moment()
									.subtract(1, "month")
									.startOf("month")
							)}
						</td>
						<td className="py-2">
							{ApplicationStore.getNetWorthOn(
								moment()
									.subtract(1, "month")
									.startOf("month")
							)}
						</td>
					</tr>
					{moment().isSame(props.date, "day") ? null : (
						<tr>
							<td className="text-left py-2">
								Selected Date: {props.date.format("(DD MMM)")}
							</td>
							<td className="py-2">{ApplicationStore.getAmountBudgetdOn(moment())}</td>
							<td className="py-2">{ApplicationStore.getNetWorthOn(moment())}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
});
