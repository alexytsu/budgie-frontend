import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";
import classNames = require("classnames");
import ApplicationStore from "../../stores/ApplicationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import RegistrationScene from "./RegistrationScene";
import AccountSceneStore from "../../stores/AccountSceneStore";

interface LoginSceneState {
	username: string;
	password: string;
	loginFailed: boolean;
	register: boolean;
}

@observer
export default class LoginScene extends Component<{}, LoginSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			loginFailed: false,
			register: false,
		};
	}

	onChangedInput = (
		field: "username" | "password",
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newState = { ...this.state };
		newState[field] = event.target.value;
		this.setState(newState);
	};

	attemptLogin = async () => {
		try {
			const loginResp = await apiHelpers.loginUser(
				this.state.username,
				this.state.password
			);
			await ApplicationStore.init(loginResp.token);
			await AccountSceneStore.init(loginResp.token);
			UserStore.token = loginResp.token;
			UserStore.username = this.state.username;
			UserStore.getUserDetails(loginResp.token, loginResp.id);
		} catch (e) {
			this.setState({ loginFailed: true });
		}
	};

	render() {
		const fieldDynamicClass = classNames({
			"shadow appearance-none bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline": true,
			"border-2 border-red-400": this.state.loginFailed
		});

		if (this.state.register) {
			return <RegistrationScene redirect={()=>{this.setState({register: false})}}></RegistrationScene>
		}

		return (
			<div className="bg-gray-200 h-screen w-screen">
				<div className="container mx-auto h-full flex justify-center items-center">
					<div className="w-1/2 shadow-md px-8 rounded-lg bg-white border-t-4 border-solid border-blue-600">
						<div className="items-center flex justify-center">
							<FontAwesomeIcon
								className="text-4xl text-blue-900 mr-4 pb-2"
								icon={faDove}
							></FontAwesomeIcon>
							<h1 className="font-sans text-5xl mt-6 mb-8 text-blue-900 text-center">
								Budgie
							</h1>
						</div>
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="username"
							>
								Username
							</label>
							<input
								className={fieldDynamicClass}
								id="username"
								type="text"
								placeholder="Username"
								onChange={e => this.onChangedInput("username", e)}
							></input>
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className={fieldDynamicClass}
								id="password"
								type="password"
								placeholder="Password"
								onChange={e => this.onChangedInput("password", e)}
								value={this.state.password}
							></input>
						</div>
						<div className="flex justify-between">
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline "
								onClick={this.attemptLogin}
							>
								Login
							</button>
							<button
								className="text-blue-900 text-sm font-bold py-2"
								onClick={()=> this.setState({register: true})}
							>
								Register
							</button>
						</div>
						<div className="font-bold text-sm mb-4">
							{this.state.loginFailed ? "Login Failed" : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
