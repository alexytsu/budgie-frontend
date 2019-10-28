import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import { observer } from "mobx-react";
import UserStore from "../../../stores/UserStore";
import { CreateCategoryReq } from "../../../util/types/CategoryTypes";
import { TransactionType } from "../../../util/types/TransactionTypes";
import ApplicationStore from "../../../stores/ApplicationStore";

interface CreateCategoryState {
	category: CreateCategoryReq;
	warning: boolean;
	created: boolean;
}

@observer
export default class CreateCategory extends Component<{}, CreateCategoryState> {
	constructor(props) {
		super(props);

		this.state = {
			category: {
				name: "",
				operation: TransactionType.EXPENSE
			},
			warning: false,
			created: false
		};
	}

	onInputChanged = event => {
		const category = { ...this.state.category };
		category.name = event.target.value;
		this.setState({ category });
	};

	submit = async () => {
		if (this.state.category.name.length < 1) {
			this.setState({ warning: true });
			this.setState({ created: false });
		} else {
			this.setState({ warning: false });
			await ApplicationStore.createCategory(
				UserStore.token,
				this.state.category
			);
			this.setState({ created: true });
		}
	};

	render() {
		return (
			<div className="bg-white rounded-lg shadow-md p-8">
				<h1 className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-left">
					Create a Category
				</h1>
				<label htmlFor="category">Category Name:</label>
				<input
					id="category"
					placeholder="Category"
					value={this.state.category.name}
					onChange={event => this.onInputChanged(event)}
					className="mb-8 pl-6"
				/>
				<button
					onClick={this.submit}
					className="bg-teal-500 text-white py-2 px-4 rounded"
				>
					Create Category
				</button>
				{this.state.warning === true ? (
					<p className="text-red-600">Please enter a category name.</p>
				) : null}
				{this.state.created === true ? <p>Category Created</p> : null}
			</div>
		);
	}
}
