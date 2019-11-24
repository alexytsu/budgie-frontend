import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";
import apiHelpers from "../util/api-helpers";
import AccountSceneStore from "./AccountSceneStore";

class UserStore {
	@observable
	username: string = "Not Logged In";

	@observable
	id: number=  0;

	@observable
	token: string = "";

	@observable
	first_name: string = "";

	@observable
	last_name: string = "";

	@observable
	email: string = "";

	@computed
	get authenticated() {
		return this.token.length > 0;
	}

	async getUserDetails(token: string, id: number) {
		const resp = await apiHelpers.getUserDetails(token, id);
		this.email = resp.email;
		this.first_name = resp.first_name;
		this.last_name = resp.last_name;
		this.username = resp.username;
	}

	logout() {
		this.username = "Not Logged In";
		this.token = "";
		AccountSceneStore.reset()
	}
}

export default new UserStore();
