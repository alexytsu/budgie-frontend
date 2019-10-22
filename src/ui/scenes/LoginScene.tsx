import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";

@observer
export default class LoginScene extends Component {
	render() {
		return (
			<div className="bg-gray-200 h-screen w-screen">
			<div className="container mx-auto h-full flex justify-center items-center">
				<form className="w-1/2 shadow-md px-8 rounded-lg bg-white">
					<h1 className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-center">Budgie</h1>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Password
						</label>
						<input className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password"></input>
					</div>
					<button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-5 rounded focus:outline-none focus:shadow-outline">Login</button>
				</form>
			</div>
			</div>
		);
	}
}
