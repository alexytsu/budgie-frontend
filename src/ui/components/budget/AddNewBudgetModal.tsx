import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import { CreateBudgetReq } from "../../../util/types/BudgetTypes";

import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import { budgetScene } from "../../../test/Budget.stories";

interface AddBudgetState {
	budgetProps: CreateBudgetReq;
	error: boolean;
	showing: boolean;
}

@observer
export default class AddNewBudgetModal extends Component<{}, AddBudgetState> {
	constructor(props) {
		super(props);

		this.state = {
			budgetProps: {
				amount: 0,
				categoryId: 0,
				endDate: new Date(),
				startDate: new Date()
			},
			error: false,
			showing: true
		};
	}

	changeHandler = e => {
		const budgetProps = this.state.budgetProps;
		budgetProps[e.target.name] = e.target.value;
		this.setState({ budgetProps });
	};

	render() {
		return (
			<div id="modal container">
				<div className="text-md">Add a New Budget</div>
				<select
					name="categoryId"
					value={this.state.budgetProps.categoryId}
					onChange={this.changeHandler}
				>
					{ApplicationStore.categories_raw.map(cat_raw => (
						<option value={cat_raw.id}>{cat_raw.name}</option>
					))}
				</select>
				<input
					name="amount"
					value={this.state.budgetProps.amount}
					onChange={this.changeHandler}
				/>
			</div>
		);
	}
}
