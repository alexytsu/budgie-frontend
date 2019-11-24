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

interface BankFormState {
	banktype: BankDets,
    loginIdCaption: string,
    passwordCaption: string,
    institution: string,
    secondaryLoginId: string,
	securityCode: number
	warning: boolean
	loading: boolean
}

@observer
export default class BankForm extends Component<
	{},
	BankFormState
> {
	constructor(props) {
		super(props);
		this.state = {
            loginIdCaption: "gavinBelson",
            passwordCaption: "hooli2016",
            institution: "AU00000",
            secondaryLoginId: null,
			securityCode: null,
			banktype: {
				id: null,
				name: null,
				loginId: null,
				passwordCaption: null,
				secondaryLoginCaption: null,
				securityCodeCaption: null
			},
			warning: false,
			loading: AccountSceneStore.loading
		};
	}

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		console.log(e.target.value)
		this.setState({ ...stateCopy });
	};

	submitHandler = async e => {
		e.preventDefault(); // suppress the form being posted

		const bankForm: LinkCred = {
			loginId: this.state.loginIdCaption,
			password: this.state.passwordCaption,
			institution: this.state.institution,
			secondaryLoginId: this.state.secondaryLoginId,
			securityCode: this.state.securityCode
		};

		try {
			await AccountSceneStore.linkBank(UserStore.token, bankForm);
			const blankState = {
				loginIdCaption: "",
				passwordCaption: "",
				institution: "",
				secondaryLoginId: null,
				securityCode: null,
				banktype: {
					id: null,
					name: null,
					loginId: null,
					passwordCaption: null,
					secondaryLoginCaption: null,
					securityCodeCaption: null
				},
				warning: true
			};
			this.setState({
				...blankState
			});
		} catch {
			this.setState({ warning: true });
		}
	};

	selBank = e => {
		console.log(e.target.value)
		let bank = AccountSceneStore.banks.find(
			b => b.id === e.target.value
		)
		this.setState({banktype: bank})
		this.setState({institution: bank.id})
		this.setState({ warning: false });
	};

	checkLink = e => {
		const reply = AccountSceneStore.checkBankLink(UserStore.token)
	}

	getuseraccounts = e => {
		console.log("haha")
		AccountSceneStore.getuserbank(UserStore.token)
	}
	
	render() {
		const { banktype } = this.state;

		const formStyle = classNames({
			"w-full bg-white border-2 border-solid shadow-md rounded-lg p-8": true,
			"border-grey-200": !this.state.warning,
			"border-green-400": this.state.warning
		});
	
		return (
			<div className="flex justify-center items-center w-full">
				<form className={formStyle} onSubmit={this.submitHandler}>	
					<select onChange={this.selBank} className="appearance-none form-select my-2 p-2 text-sm rounded bg-blue-100 shadow block w-full">
						<option value={"AU00000"}>Please select a bank</option>
						{AccountSceneStore.banks.map(bank => {
							return (
								<option key={bank.id} value={bank.id}>
									{bank.name}
								</option>
							)
						})}
					</select>
				
					
					{Object.keys(banktype).map(i => {
						if (banktype[i] !== null && (i !== "id" && i !== "name")) {
							return (
								<input
									className="appearance-none border-2 border-solid rounded my-2 py-1 px-2 text-sm block w-full"
									name={i}
									key={i}
									placeholder={banktype[i]}
									onChange={this.changeHandler}
								/>
							)
						}
					})}

					<button
						className="bg-blue-500 float-right hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 mt-8 rounded shadow focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Add Bank
					</button>
				</form>
			</div>
		);
	}
}
