import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import {
	TransactionType,
	CreateTransactionReq
} from "../../../util/types/TransactionTypes";

import "../../styles.css";
import "../../tailwind.css";
import ApplicationStore from "../../../stores/ApplicationStore";
import UserStore from "../../../stores/UserStore";

export default class TransactionForm extends Component<{}, any> {
	constructor(props) {
		super(props);

		this.state = {
			amount: "",
			description: "",
			date: new Date(),
			category: "",
			account: "",
			type: TransactionType.EXPENSE,
			warning: false
		};
	}

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	submitHandler = async e => {
		e.preventDefault(); // suppress the form being posted
		this.setState({ date: new Date(), warning: false });

		const newTransaction: CreateTransactionReq = {
			amount: parseFloat(this.state.amount),
			category: 1,
			date: "2019-10-3",
			operation: this.state.type
		};

		try {
			await ApplicationStore.createTransaction(UserStore.token, newTransaction);
			const blankState = {
				amount: "",
				description: "",
				date: new Date(),
				category: "",
				account: "",
				type: TransactionType.EXPENSE,
				warning: false
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
			"border-purple-200": !this.state.warning,
			"border-red-400": this.state.warning
		});

		return (
			<div className="flex justify-center items-center w-full">
				<form className={formStyle} onSubmit={this.submitHandler}>
					<input
						className="border-2 border-solid rounded my-2 py-1 px-2 text-sm"
						type="number"
						name="amount"
						value={amount}
						placeholder="Amount"
						onChange={this.changeHandler}
					/>
					<br />
					<input
						className="border-2 border-solid rounded my-2 py-1 px-2 text-sm"
						name="description"
						value={description}
						placeholder="Description"
						onChange={this.changeHandler}
					/>
					<br />
					<select className="my-2 p-2 text-sm rounded bg-purple-100 shadow">
						<option>Category1</option>
						<option>Category2</option>
						<option>Category3</option>
					</select>
					<br />
					<select className="my-2 p-2 text-sm rounded bg-purple-100 shadow">
						<option>Account1</option>
						<option>Account2</option>
					</select>
					<br />

					<div className="flex justify-between">
						<div className="">
							<input
								className="form-radio"
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
								className="form-radio"
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

					<br />
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 mb-5 rounded shadow focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Add
					</button>
				</form>
			</div>
		);
	}
}
