import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from "react-dates";

import {
	TransactionType,
	CreateTransactionReq
} from "../../../util/types/TransactionTypes";

import "../../styles.css";
import ApplicationStore from "../../../stores/ApplicationStore";
import UserStore from "../../../stores/UserStore";
import moment = require("moment");
import AccountSceneStore from "../../../stores/AccountSceneStore";

interface TransactionFormState {
	amount: number;
	description: string;
	date: moment.Moment;
	category: number;
	account: string;
	type: TransactionType;
	warning: boolean;
	datePickerFocused: boolean;
}

export default class TransactionForm extends Component<
	{},
	TransactionFormState
> {
	constructor(props) {
		super(props);

		this.state = {
			amount: 0,
			description: "",
			date: moment(),
			category: 1,
			account: "",
			type: TransactionType.EXPENSE,
			warning: false,
			datePickerFocused: false
		};
	}

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	submitHandler = async e => {
		e.preventDefault(); // suppress the form being posted

		const newTransaction: CreateTransactionReq = {
			amount: this.state.amount * (this.state.type === TransactionType.INCOME ? -1: 1),
			category: this.state.category,
			date: this.state.date.format("YYYY-MM-DD"),
			description: this.state.description,
			account: this.state.account
		};

		try {
			await ApplicationStore.createTransaction(UserStore.token, newTransaction);
			const blankState = {
				amount: 0,
				description: "",
				date: moment(),
				category: 1,
				account: "",
				type: TransactionType.EXPENSE,
				warning: false,
				datePickerFocused: false
			};
			this.setState({
				...blankState
			});
		} catch {
			this.setState({ warning: true });
		}
	};

	render() {
		const { amount, description, category, account, type } = this.state;

		const formStyle = classNames({
			"w-full bg-white border-2 border-solid shadow-md rounded-lg p-8": true,
			"border-grey-200": !this.state.warning,
			"border-red-400": this.state.warning
		});

		return (
			<div className="flex justify-center items-center w-full">
				<form className={formStyle} onSubmit={this.submitHandler}>
					<input
						className="appearance-none border-2 border-solid rounded my-2 py-1 px-2 text-sm block w-full"
						type="number"
						name="amount"
						value={amount}
						placeholder="Amount"
						onChange={this.changeHandler}
					/>
					{/* <input
						className="border-2 border-solid rounded my-2 py-1 px-2 text-sm block"
						name="description"
						value={description}
						placeholder="Description"
						onChange={this.changeHandler}
					/> */}
					<select
						onChange={this.changeHandler}
						name="category"
						className="appearance-none form-select my-2 p-2 text-sm rounded bg-blue-100 shadow block w-full"
					>
						<option>Select Category</option>
						{ApplicationStore.categories_raw.map(cat => {
							return (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							);
						})}
					</select>
				
					<select
						onChange={this.changeHandler}
						name="account"
						className="appearance-none form-select my-2 p-2 text-sm rounded bg-blue-100 shadow block w-full"
					>
						<option>Select Account</option>
						{AccountSceneStore.accounts.map(acc => {
							return (
								<option key={acc.id} value={acc.id}>
									{acc.name}
								</option>
							);
						})}
					</select>

					<div className="flex justify-between mt-5">
						<div className="">
							<input
								className="form-radio cursor-pointer"
								type="radio"
								id="expense"
								name="type"
								value={TransactionType.EXPENSE}
								onChange={e => {
									this.setState({ type: TransactionType.EXPENSE });
								}}
							/>
							<label className="ml-2" htmlFor="expense">
								Expense
							</label>
						</div>

						<div>
							<input
								className="form-radio cursor-pointer"
								type="radio"
								id="income"
								name="type"
								value={TransactionType.INCOME}
								onChange={e => {
									this.setState({ type: TransactionType.INCOME });
								}}
							/>
							<label className="ml-2" htmlFor="income">
								Income
							</label>
						</div>
					</div>
					<div className="mt-5 float-left">
						<SingleDatePicker
							date={this.state.date}
							onDateChange={(date: moment.Moment) => this.setState({ date })}
							focused={this.state.datePickerFocused}
							onFocusChange={(focus) => {
								this.setState({ datePickerFocused: focus.focused});
							}}
							id="transaction_date"
							numberOfMonths={1}
							isOutsideRange={()=>false}
						></SingleDatePicker>
					</div>

					<button
						className="bg-blue-500 float-right hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 mt-8 rounded shadow focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Add
					</button>
				</form>
			</div>
		);
	}
}
