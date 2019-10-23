import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";

interface LoginSceneState {
	username: string;
	password: string;
	authenticated: boolean;
}

@observer
export default class LoginScene extends Component<{},LoginSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			authenticated: false
		};
	}

	onChangedInput = (field: "username" | "password", event: React.ChangeEvent<HTMLInputElement>) => {
		const newState = {...this.state};
		newState[field] = event.target.value;
		this.setState(newState);
	}

	attemptLogin = async() => {
		const token = await apiHelpers.loginUser(this.state.username, this.state.password);
		console.log("Received token", token);
		UserStore.token = token;
		this.setState({authenticated: true});
	}

	render() {
		return (
			<div className="bg-gray-200 h-screen w-screen">
				<div className="container mx-auto h-full flex justify-center items-center">
					<div className="w-1/2 shadow-md px-8 rounded-lg bg-white">
						<h1 className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-center">
							Budgie
						</h1>
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="username"
							>
								Username
							</label>
							<input
								className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								id="username"
								type="text"
								placeholder="Username"
								onChange={(e)=>this.onChangedInput("username", e)}
								
							></input>
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								id="password"
								type="password"
								placeholder="Password"
								onChange={(e)=>this.onChangedInput("password", e)}
								value={this.state.password}
							></input>
						</div>
						<button 
							className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-5 rounded focus:outline-none focus:shadow-outline"
							onClick={this.attemptLogin}
						>
							Login
						</button>
					</div>
				</div>
			</div>
		);
	}
}
