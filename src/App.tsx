import * as React from "react";
import { Component } from "react";
import LoginScene from "./ui/scenes/LoginScene";
import UserStore from "./stores/UserStore";
import ProfileScene from "./ui/scenes/ProfileScene";
import { observer } from "mobx-react";

@observer
export default class App extends Component {
	render() {
		if (!UserStore.authenticated) {
			return <LoginScene></LoginScene>;
		}

		return <ProfileScene></ProfileScene>;
	}
}
