import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import axios from "axios";
import { API_URL } from "../../util/config";
import UserStore from "../../stores/UserStore";
import { runInThisContext } from "vm";
import { Redirect, Link } from "@reach/router";

interface LoginState {
	username: string;
	password: string;
	redirect: boolean;
}

@observer
export default class LoginScene extends Component<{}, LoginState> {


	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			redirect: false,
		}

	}

	async submitForm() {
		const token = await apiHelpers.loginUser(this.state.username, this.state.password);
		UserStore.username = this.state.username;
		UserStore.token = token;
		this.setState({redirect: true});
	}

	inputChangeHandler(field:"username"|"password", e) {
		if (field === "username") {
			this.setState({username: e.target.value});
		} else if(field === "password") {
			this.setState({password: e.target.value});
		}
	}

	render() {

		if(this.state.redirect) {
			return <Link to='/protected'>Go</Link>
		}

		return (
			<div className="bg-gray-200 h-screen w-screen">
			<div className="container mx-auto h-full flex justify-center items-center">
				<div className="w-1/2 shadow-md px-8 rounded-lg bg-white">
					<h1 className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-center">Budgie</h1>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input 
							className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
							id="username"
							type="text"
							placeholder="Username"
							onChange={(e)=>this.inputChangeHandler("username", e)}
							value={this.state.username}>
						</input>
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Password
						</label>
						<input 
							onChange={(e)=>this.inputChangeHandler("password", e)}
						className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password"></input>
					</div>
					<button onClick={()=>this.submitForm()} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-5 rounded focus:outline-none focus:shadow-outline">Login</button>
				</div>
			</div>
			</div>
		);
	}
}
