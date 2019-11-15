import { observer } from "mobx-react";
import React = require("react");
import BudgetSceneStore from "../../../stores/BudgetSceneStore";
import apiHelpers from "../../../util/api-helpers";
import Budget from "./Budget";
import {
	BudgetResp,
	BudgetDisplayProps
} from "../../../util/types/BudgetTypes";
import moment = require("moment");
import Slider, { Settings as SliderSettings } from "react-slick";

interface BudgetGroup {
	name: string;
	category: number;
	currentlySelected: number;
	budgets: {
		disp: BudgetDisplayProps;
		raw: BudgetResp;
	}[];
}

export const BudgetList = observer(() => {
	// group budgets of same category together
	const initial: BudgetGroup[] = [];
	const budgetsGrouped = BudgetSceneStore.filteredBudgets.reduce(
		(groupList, budget) => {
			const budget_disp = apiHelpers.convertBudget(budget);

			const existingGroup = groupList.find(
				gr => gr.category === budget.category
			);

			if (existingGroup !== undefined) {
				existingGroup.budgets.push({ disp: budget_disp, raw: budget });
			} else {
				const group: BudgetGroup = {
					currentlySelected: 0,
					budgets: [
						{
							disp: budget_disp,
							raw: budget
						}
					],
					name: budget_disp.category,
					category: budget.category
				};
				groupList.push(group);
			}

			return groupList;
		},
		initial
	);

	// within each group, sort by startDate
	budgetsGrouped.forEach(group => {
		group.budgets.sort((a, b) => {
			return (
				moment(a.raw.startDate, "YYYY-MM-DD").valueOf() -
				moment(b.raw.startDate, "YYYY-MM-DD").valueOf()
			);
		});
	});

	// sort alphabetically
	budgetsGrouped.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	// make each budgetGroup a carousel
	const budgetCarousels = budgetsGrouped.map(group => {
		const sliderSettings: SliderSettings = {
			infinite: false,
			afterChange: function(index) {
				group.currentlySelected = index;
				const budget = group.budgets[group.currentlySelected].raw;
				BudgetSceneStore.selectBudget(budget);
			}
		};

		return (
			<div
				onClick={() => {
					const bud = group.budgets[group.currentlySelected].raw;
					BudgetSceneStore.selectBudget(bud);
				}}
				className="mb-4 mr-2"
				style={{ height: 150 }}
				key={group.category}
			>
				<div className="font-semibold text-gray-800">{group.name}</div>
				<div className="flex justify-between mb-1	">
					<div className="text-xs"> Budgets: {group.budgets.length}</div>{" "}
					<div className="text-xs text-blue-400">
						{group.budgets.length > 1 ? "Swipe to see more" : null}
					</div>
				</div>
				<Slider {...sliderSettings}>
					{group.budgets.map(bud => (
						<Budget
							key={bud.disp.id}
							{...bud.disp}
							selected={bud.disp.id === BudgetSceneStore.selectedBudgetId}
						></Budget>
					))}
				</Slider>
			</div>
		);
	});

	return <div>{budgetCarousels}</div>;
});
