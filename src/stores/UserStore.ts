import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";

class UserStore {
	@observable
	username: string = "Not Logged In";
	@observable
	token: string = "";

	@computed
	get authenticated() {
		return this.token.length > 0;
	}

	logout() {
		this.username = "Not Logged In";
		this.token = "";
	}
}

export default new UserStore();
