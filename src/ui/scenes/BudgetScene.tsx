import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import Budget from "../components/budget/Budget";

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
		return (
			<div className="flex">
				<div className="w-1/6">
					<h1 className="text-xl mb-4">Budgets</h1>
						{ApplicationStore.budgets_raw.map(b_raw => {
							const b = apiHelpers.convertBudget(b_raw);
							return( <div>
								<div className="text-xs font-bold">{b.category}</div>
								<Budget key={b.id} {...b}></Budget>
								</div>);
						})}
				</div>
				<div className="w-full">
				</div>
			</div>
		);
	}
}
