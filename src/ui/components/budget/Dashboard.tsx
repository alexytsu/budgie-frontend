import * as React from "react";

import { BudgetResp, BudgetDisplayProps, BudgetPeriod } from "../../../util/types/BudgetTypes";
import { observer } from "mobx-react";
import BudgetSceneStore from "../../../stores/BudgetSceneStore";
import moment = require("moment");
import { TransactionListDateSections } from "../transaction/TransactionLists";
import Budget from "./Budget";
import apiHelpers from "../../../util/api-helpers";
import { SmartEditBudget } from "./SmartEditBudget";

import classNames from "classnames";

interface DashboardProps {
	budget: BudgetResp;
	budget_disp: BudgetDisplayProps;
}

export const Dashboard = observer((props: DashboardProps) => {
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
			<div className="flex flex-col">
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
				<div className="overflow-hidden overflow-y-scroll h-full mb-4">
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
				<div className="flex font-semibold py-4">
					<div>${props.budget_disp.spent.toFixed(2)} / </div>
					<div>${props.budget_disp.limit.toFixed(2)}</div>
				</div>
				<SmartEditBudget
					budget_disp={apiHelpers.convertBudget({
						id: props.budget.id,
						...BudgetSceneStore.newBudget
					})}
				/>
			</div>
		</div>
	);
});
