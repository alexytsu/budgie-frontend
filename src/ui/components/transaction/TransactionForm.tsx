import * as React from "react";
import {Component} from "react";
import axios from "axios";

import { TransactionType, TransactionDisplayProps } from "../../../util/types/TransactionTypes";

import "../../styles.css";
import "../../tailwind.css";
import { API_URL } from "../../../util/config";

export default class TransactionForm extends Component<{},any>{
    
    constructor(props) {
        super(props);

        this.state = {
            amount: "",
            description: "",
            date: new Date(),
            category: "",
            account: "",
            type: TransactionType.EXPENSE
        }
    }

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    
    submitHandler = e => {
        e.preventDefault()
        this.setState({date: new Date()})
        console.log(this.state)
        axios.post(API_URL + '/transactions/', this.state)
    }

	render() {
        const {amount, description, category, account, type} = this.state;
		return (
			<div className="">
                <form className="" onSubmit={this.submitHandler}>
                    <div className="">
                        <input
                        type="number" name="amount"
                        value={amount} placeholder="Amount"
                        onChange={this.changeHandler}
                        />
                        <br/>
                        <input 
                        name="description" value={description} 
                        placeholder="Description" 
                        onChange={this.changeHandler}
                        />
                        <br/>
                        <input 
                        name="category" value={category}
                        placeholder="Category"
                        onChange={this.changeHandler}
                        />
                        <br/>
                        <input 
                        name="account" value={account}
                        placeholder="Account"
                        onChange={this.changeHandler}
                        />
                        <br/>
                    </div>

                    <div className="">
                        <input 
                        type="radio" id="expense" 
                        name="skills" value="Android Development" 
                        onChange={e => {this.setState({type: TransactionType.EXPENSE})}}/>
                        <label htmlFor="expense">Expense</label>

                        <input 
                        type="radio" id="income" 
                        name="skills" value="iOS Development" 
                        onChange={e => {this.setState({type: TransactionType.INCOME})}}/>
                        <label htmlFor="income">Income</label>

                    </div>

                    <br/>
                    <button type="submit">Add</button>
                </form>
            </div>
		);
	}
}