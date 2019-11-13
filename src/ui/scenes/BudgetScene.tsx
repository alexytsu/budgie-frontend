import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import * as ReactModal from "react-modal";
import { DateRangePicker } from "react-dates";

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
import {
	CreateBudgetReq,
	BudgetPeriod,
	BudgetDisplayProps,
	BudgetResp
} from "../../util/types/BudgetTypes";
import BudgetOverTimeGraph from "../components/budget/BudgetOverTimeGraph";
import { number } from "prop-types";
import { start } from "repl";

interface BudgetSceneState {
	selectedBudgetId: number;
	newAmount: number;
}

@observer
export default class BudgetScene extends Component<{}, BudgetSceneState> {
	constructor(props) {
		super(props);

		let firstId = 0;

		if (ApplicationStore.budgets_raw.length > 0) {
			firstId = ApplicationStore.budgets_raw[0].id;
		}

		this.state = {
			selectedBudgetId: firstId,
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
						className="p-1 rounded bg-blue-800 text-white my-4 font-semibold"
						onClick={() => BudgetSceneStore.openModal()}
					>
						Manage...
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
										BudgetSceneStore.selectBudget(b_raw);
									}}
								>
									<div className="font-semibold">{b.category}</div>
									<Budget {...b}></Budget>
								</div>
							);
						})}
					</div>
				</div>
				<div className="w-full h-full ml-8">
					{bud !== undefined ? (
						<Dashboard
							budget={bud}
							budget_disp={apiHelpers.convertBudget(bud)}
						></Dashboard>
					) : null}
				</div>
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
							<td className="py-2">
								{ApplicationStore.getAmountBudgetdOn(moment())}
							</td>
							<td className="py-2">
								{ApplicationStore.getNetWorthOn(moment())}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
});

interface DashboardProps {
	budget: BudgetResp;
	budget_disp: BudgetDisplayProps;
}

const Dashboard = observer((props: DashboardProps) => {
	// sync some store state to the current budget

	const graphData = {
		transactions: BudgetSceneStore.allTransactionsBudget,
		budget: props.budget_disp.limit
	};

	const period_colour = classNames({
		"font-bold": true,
		"text-blue-500": props.budget_disp.period === BudgetPeriod.PAST,
		"text-green-500": props.budget_disp.period === BudgetPeriod.CURRENT,
		"text-yellow-500": props.budget_disp.period === BudgetPeriod.FUTURE
	});
	let period_message = (
		<div className={period_colour}>
			{props.budget_disp.period.toUpperCase()}
		</div>
	);

	return (
		<div className="h-full flex">
			<div style={{ minWidth: 500 }} className="flex flex-col">
				<div className="font-bold text-4xl">
					{BudgetSceneStore.currentCategory.name}
				</div>
				<div className="font-semibold text-gray-700 mt-4">TRANSACTIONS</div>
				<div className="mb-2">
					{moment(props.budget_disp.startDate)
						.format("DD MMM")
						.toUpperCase()}{" "}
					-{" "}
					{moment(props.budget_disp.endDate)
						.format("DD MMM")
						.toUpperCase()}
				</div>
				<div className="overflow-hidden overflow-y-scroll mb-4 h-full">
					{BudgetSceneStore.allTransactionsBudget.length === 0 ? (
						<div className="my-2">No transactions recorded in this budget</div>
					) : (
						<TransactionListDateSections
							transactions={BudgetSceneStore.allTransactionsBudget}
						></TransactionListDateSections>
					)}
				</div>
			</div>
			<div className="flex flex-col ml-8 flex-1">
				{period_message}
				<Budget
					selected={true}
					{...apiHelpers.convertBudget({
						id: props.budget.id,
						...BudgetSceneStore.newBudget
					})}
				></Budget>
				<Edit
					budget_disp={apiHelpers.convertBudget({
						id: props.budget.id,
						...BudgetSceneStore.newBudget
					})}
				/>
				<div className="flex font-semibold py-4">
					<div>${props.budget_disp.spent.toFixed(2)} / </div>
					<div>${props.budget_disp.limit.toFixed(2)}</div>
				</div>
				<Graph {...graphData}></Graph>
			</div>
		</div>
	);
});

const Edit = observer((props: { budget_disp: BudgetDisplayProps }) => {
	const buttonColor = classNames({
		"bg-green-600":
			BudgetSceneStore.newBudget.amount >= props.budget_disp.spent,
		"bg-red-600": BudgetSceneStore.newBudget.amount < props.budget_disp.spent
	});
	return (
		<div className="my-2 bg-white shadow flex justify-between">
			<div className="bg-blue-900 p-6">
				<h2 className="font-semibold text-blue-100 text-lg">
					Edit this budget
				</h2>
				<div className="text-blue-100">
					Begin editing values to see a live preview of your changes
				</div>
			</div>
			<div className="p-6">
				<div>Amount</div>
				<input
					id="newAmount"
					name="newAmount"
					className="rounded bg-gray-200 p-2 text-right mb-2"
					type="number"
					value={BudgetSceneStore.newBudget.amount}
					onChange={e => {
						const newAmount = parseFloat(e.target.value);
						BudgetSceneStore.newBudget.amount = isNaN(newAmount)
							? undefined
							: apiHelpers.round(newAmount, 2);
					}}
				></input>
				<div>Period</div>
				<DateRangePicker
					startDateId="newBudgetStartDate"
					startDate={moment(BudgetSceneStore.newBudget.startDate, "YYYY-MM-DD")}
					endDateId="newBudgetEndDate"
					endDate={moment(BudgetSceneStore.newBudget.endDate, "YYYY-MM-DD")}
					focusedInput={BudgetSceneStore.newBudgetDatePickerFocus}
					onDatesChange={({ startDate, endDate }) => {
						BudgetSceneStore.newBudget.startDate = startDate.format(
							"YYYY-MM-DD"
						);
						BudgetSceneStore.newBudget.endDate = endDate.format("YYYY-MM-DD");
					}}
					onFocusChange={calendarFocus => {
						BudgetSceneStore.newBudgetDatePickerFocus = calendarFocus;
					}}
					isOutsideRange={() => false}
					numberOfMonths={2}
				/>
			</div>
			<div
				className={buttonColor + " h-full flex flex-col justify-center px-2"}
			>
				<div
					onClick={() => BudgetSceneStore.updateBudget(UserStore.token)}
					className="text-white text-center mx-auto"
				>
					Save Budget
				</div>
			</div>
		</div>
	);
});
