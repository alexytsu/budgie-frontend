import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";

class UserStore {
	@observable
	username: string|null = null;

	@observable
	token: string|null = null;
}

export default new UserStore();
