import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";

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
						apiHelpers.createCategory("testCategory");
					}}
				>
					Create Category
				</button>
				<button
					onClick={async () => {
            this.setState({categories: apiHelpers.getAllCategories()}, () => console.log(this.state));
					}}
				>
          Retrieve Categories
				</button>
			</div>
		);
	}
}
