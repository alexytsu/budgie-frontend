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
			
            <div className='container mx-auto h-full flex justify-center items-center'>
                <form className='bg-white border-l-4 border-solid border-green-600 shadow-md rounded px-8 p-4' onSubmit={this.submitHandler}>
                    <div className="p-4">
                        <input
                        className='border-2 border-solid rounded my-2'
                        type="number" name="amount"
                        value={amount} placeholder="Amount"
                        onChange={this.changeHandler}
                        />
                        <br/>
                        <input 
                        className='border-2 border-solid rounded my-2'
                        name="description" value={description} 
                        placeholder="Description" 
                        onChange={this.changeHandler}
                        />
                        <br/>
                        {/* <input 
                        className='border-2 border-solid rounded my-2'
                        name="category" value={category}
                        placeholder="Category"
                        onChange={this.changeHandler}
                        /> */}
                        <select>
                            <option>Category1</option>
                            <option>Category2</option>
                            <option>Category3</option>
                        </select>
                        <br/>
                        {/* <input 
                        className='border-2 border-solid rounded my-2'
                        name="account" value={account}
                        placeholder="Account"
                        onChange={this.changeHandler}
                        /> */}
                        <select>
                            <option>Account1</option>
                            <option>Account2</option>
                        </select>
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
                    <button className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 mb-5 rounded shadow focus:outline-none focus:shadow-outline'
                    type="submit">
                    Add
                    </button>
                </form>
            </div>
            
		);
	}
}