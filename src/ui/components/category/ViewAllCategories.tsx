import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import { observable } from "mobx";
import { observer } from "mobx-react";
import UserStore from "../../../stores/UserStore";

interface ViewAllCategoriesState {
	categories: any[];
	//warning: boolean;
}

@observer
export default class ViewAllCategories extends Component<
	{},
	ViewAllCategoriesState
> {
	constructor(props) {
		super(props);
		this.state = {
			categories: []
		};
	}

	async componentDidMount() {
		await apiHelpers.loginUser("joe", "password");
		const response = await apiHelpers.getAllCategories(UserStore.token);
		this.setState({ categories: response });
	}

	render() {
		return (
			<div className="bg-white rounded-lg shadow-md p-8">
				<label htmlFor="category">Categories</label>
				{this.state.categories.map(cat => {
					return <div>{cat.name}</div>;
				})}
			</div>
		);
	}
}
