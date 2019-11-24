import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import "../../styles.css";
import ApplicationStore from "../../../stores/ApplicationStore";
import UserStore from "../../../stores/UserStore";
import AccountSceneStore, { LinkCred } from "../../../stores/AccountSceneStore";
import { observer } from "mobx-react";
import { BankDets } from "../../../stores/AccountSceneStore";
import { object } from "prop-types";
import { LoadingSpinnerComponent } from "../misc/LoadingSpinner";

interface UnlinkBankFormState {
	id: string
}

@observer
export default class UnlinkForm extends Component<
	{},
	UnlinkBankFormState
> {
	constructor(props) {
		super(props);
		this.state = {
            id: ""
		};
	}

	submitHandler = async e => {
		e.preventDefault(); // suppress the form being posted

		try {
			await AccountSceneStore.deleteBank(UserStore.token, this.state.id);
			const blankState = {
				id: ""
			};
			this.setState({
				...blankState
			});
		} catch {
			console.log("cannot perform delete")
		}
	};

	selBank = e => {
		console.log(e.target.value)
		let bank = AccountSceneStore.useraccounts.find(
			b => b.id === e.target.value
		)
		this.setState({id: bank.id})
	};
	
	render() {
		const { id } = this.state;

		const formStyle = classNames({
			"w-full bg-white border-2 border-solid shadow-md rounded-lg p-4": true,
			"border-grey-200": true
		});
	
		return (
			<div className="flex justify-center items-center w-full">
				<form className={formStyle} onSubmit={this.submitHandler}>	
					<h1 className="text-center">UNLINK BANK</h1>
					<select onChange={this.selBank} className="appearance-none form-select my-2 p-2 text-sm rounded bg-blue-100 shadow block w-full">
						<option value={"AU00000"}>Please select a bank</option>
						{AccountSceneStore.useraccounts.map(bank => {
							return (
								<option key={bank.id} value={bank.id}>
									{bank.loginId}
								</option>
							)
						})}
					</select>

					<button
						className="bg-blue-500 float-right hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 mt-8 rounded shadow focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Delete Bank
					</button>

				</form>
			</div>
		);
	}
}
