import { observer } from "mobx-react";
import React = require("react");
import BudgetSceneStore from "../../../stores/BudgetSceneStore";
import apiHelpers from "../../../util/api-helpers";
import Budget from "./Budget";

export const BudgetList = observer(() => {
	return (
		<>
			{BudgetSceneStore.filteredBudgets.map(b_raw => {
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
		</>
	);
});
