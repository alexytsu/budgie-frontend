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
import BudgetScene from "../../scenes/BudgetScene";
import { solarizedDark } from "react-syntax-highlighter/dist/styles/hljs";

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
				groupList.push({
					currentlySelected: 0,
					budgets: [
						{
							disp: budget_disp,
							raw: budget
						}
					],
					name: budget_disp.category,
					category: budget.category
				});
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

	// make each budgetGroup a carousel
	const budgetCarousels = budgetsGrouped.map(group => {
		const sliderSettings: SliderSettings = {
			arrows: true,
			dots: true,
			infinite: false,
			focusOnSelect: true,
			swipeToSlide: false,
			afterChange: function(index) {
				group.currentlySelected = index;
				const budget = group.budgets[group.currentlySelected].raw;
				BudgetSceneStore.selectBudget(budget);
			}
		};

		return (
			<div
				key={group.category}
				onClick={() => {
					BudgetSceneStore.selectBudget(group.budgets[group.currentlySelected].raw);
				}}
				style={{maxHeight: 250, borderWidth: 1, borderStyle: "solid", borderColor: "red" }}
			>
				<div>{group.category}</div>
				<Slider {...sliderSettings}>
					{group.budgets.map(bud => (
							<Budget {...bud.disp}></Budget>
					))}
				</Slider>
			</div>
		);
	});

	return <>{budgetCarousels}</>;
});
