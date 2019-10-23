import axios from "axios";

import { API_URL } from "./config";

class ApiHelper {
	private token: string | null = null;

	async loginUser(username: string, password: string) {
		if (this.token === null) {
			const resp = await axios.post(API_URL + "/login/", {
				username,
				password
			});
			this.token = resp.data.token;
		}

		return this.token;
	}

	createCategory = async (category_name: string) => {
		const resp = await axios.post(
			API_URL + "/categories/",
			{ name: category_name },
			{
				headers: {
					Authorization: "Token " + this.token
				}
			}
		);

		return resp.data;
	};

	getAllCategories = async () => {
		const resp = await axios.get(API_URL + "/categories/", {
			headers: {
				Authorization: "Token " + this.token
			}
    });
    
    return resp.data;
	};
}

export default new ApiHelper();
