import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import { observer } from "mobx-react";
import UserStore from "../../../stores/UserStore";
import { CreateCategoryReq } from "../../../util/types/CategoryTypes";
import { TransactionType } from "../../../util/types/TransactionTypes";
import ApplicationStore from "../../../stores/ApplicationStore";

interface CreateCategoryState {
	category: CreateCategoryReq;
	warning: boolean;
	created: boolean;
	createdType: TransactionType;
	response: string;
}

@observer
export default class CreateCategory extends Component<{}, CreateCategoryState> {
	constructor(props) {
		super(props);

		this.state = {
			category: {
				name: "",
				operation: TransactionType.INCOME
			},
			warning: false,
			created: false,
			createdType: null,
			response: "",
		};
	}

	onInputChanged = event => {
		const category = { ...this.state.category };
		category.name = event.target.value;
		this.setState({ category });
	};

	onRadioChanged = event => {
		const category = { ...this.state.category };
		category.operation = event.target.value;
		this.setState({ category })
	};

	submit = async () => {
		if (this.state.category.name.length < 1) {
			this.setState({ warning: true });
			this.setState({ created: false });
		} else {
			this.setState({ warning: false });
			const submitResponse = await ApplicationStore.createCategory(
				UserStore.token,
				this.state.category
			);
			this.setState({ response : submitResponse.name })
			this.setState({ created: true });
		}
	};

	render() {
		return (
			<div className="pt-8">
				<label className="font-sans text-3xl font-semibold mt-6 mb-4 text-gray-800 text-left">
					Create a Category
				</label>
				<br></br>
				<input
					id="category"
					placeholder="Category"
					value={this.state.category.name}
					maxLength={30}
					onChange={event => this.onInputChanged(event)}
					className="rounded-l-lg p-2 border-t mr-0 text-gray-800 border-gray-200 bg-white"
				/>
				<button
					onClick={this.submit}
					className="bg-teal-500 text-white py-2 px-4 rounded-r-lg"
				>Create Category
				</button>
				<div className="mt-2">
					<div>
						<label className="inline-flex items-center">
							<input type="radio" 
									className="form-radio text-indigo-600"
									name="radio"
									value={TransactionType.INCOME}
									checked={this.state.category.operation === TransactionType.INCOME}
									onChange={this.onRadioChanged}>
							</input>
							<span className="ml-2">Income</span>
						</label>
					</div>
					<div>
						<label className="inline-flex items-center">
							<input type="radio"
									className="form-radio text-green-500"
									name="radio"
									value={TransactionType.EXPENSE}
									checked={this.state.category.operation === TransactionType.EXPENSE}
									onChange={this.onRadioChanged}>
							</input>
							<span className="ml-2">Expense</span>
						</label>
					</div>
				</div>
				{this.state.warning === true ? (
					<p className="text-red-600">Please enter a category name.</p>
				) : null}
				{this.state.response === "A category with that name and operation already exists." ? (
					<p className="text-red-600">{this.state.response}</p>
				) : <p>{this.state.category.operation === "IN" ? "Income" : "Expense"} category created</p>}
			</div>
		);
	}
}
