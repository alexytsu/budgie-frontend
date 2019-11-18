import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";
import classNames = require("classnames");
import ApplicationStore from "../../stores/ApplicationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "@reach/router";

interface RegistrationSceneState {
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	email: string;
	registrationFailed: boolean;
	redirect_to_login: boolean;
}

@observer
export default class RegistrationScene extends Component<any, RegistrationSceneState> {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			email: "",
			first_name: "",
			last_name: "",
			registrationFailed: false,
			redirect_to_login: false,
		};
	}

	onChangedInput = (
		field: "username" | "password" | "email" | "first_name" | "last_name",
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newState = { ...this.state };
		newState[field] = event.target.value;
		this.setState(newState);
	};

	attemptRegistration = async () => {
		try {
			const registrationResp = await apiHelpers.registerUser(
				this.state.username,
				this.state.password,
				this.state.email,
				this.state.first_name,
				this.state.last_name,
			);

			this.setState({redirect_to_login: true});

		} catch (e) {
			this.setState({ registrationFailed: true });
		}
		this.props.redirect();
	};

	render() {

		if (this.state.redirect_to_login) {
			return <Redirect to="/login"></Redirect>
		}

		const fieldDynamicClass = classNames({
			"shadow appearance-none bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline": true,
			"border-2 border-red-400": this.state.registrationFailed
		});

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
								Register
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
								value={this.state.username}
								onChange={e => this.onChangedInput("username", e)}
							></input>

							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="email"
							>
							Email
							</label>
							<input
								className={fieldDynamicClass}
								id="email"
								type="email"
								placeholder="joe@example.com"
								value={this.state.email}
								onChange={e => this.onChangedInput("email", e)}
							></input>

							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="first_name"
							>
							First Name
							</label>
							<input
								className={fieldDynamicClass}
								id="first_name"
								type="text"
								placeholder="Joe"
								value={this.state.first_name}
								onChange={e => this.onChangedInput("first_name", e)}
							></input>

							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="last_name"
							>
								Last Name
							</label>
							<input
								className={fieldDynamicClass}
								id="last_name"
								type="text"
								placeholder="last_name"
								value={this.state.last_name}
								onChange={e => this.onChangedInput("last_name", e)}
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
								onClick={this.attemptRegistration}
							>
								Register
							</button>
						</div>
						<div className="font-bold text-sm mb-4">
							{this.state.registrationFailed ? "Login Failed" : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
