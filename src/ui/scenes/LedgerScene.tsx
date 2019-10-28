import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";

@observer
export default class LedgerScene extends Component {
	render() {
		return (
			<div>
				<button
					onClick={async () => {
						apiHelpers.loginUser("Joe", "password");
					}}
				>
					Login Request
				</button>
				<button
					onClick={async () => {
						await apiHelpers.createCategory(UserStore.token, "testCategory");
					}}
				>
					Create Category
				</button>
				<button
					onClick={async () => {
						this.setState(
							{
								categories: await apiHelpers.getAllCategories(UserStore.token)
							},
							() => console.log(this.state)
						);
					}}
				>
					Retrieve Categories
				</button>
			</div>
		);
	}
}
