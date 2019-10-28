import axios from "axios";

import { API_URL } from "./config";

export interface LoginResp {
	id: number;
	token: string;
}
class ApiHelper {

	async loginUser(username: string, password: string):Promise<LoginResp>{
		const resp = await axios.post(API_URL + "/login/", {
			username,
			password
		}).catch((e)=>{
			throw e;
		});

		const data: LoginResp = {
			id: resp.data.id,
			token: resp.data.token,
		}

		console.log("Logging In", data);

		return data;
	}

	createCategory = async (token: string, category_name: string) => {
		const resp = await axios.post(
			API_URL + "/categories/",
			{ name: category_name, user: 1 },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		console.log(resp.status);
		return resp.data;
	};

	getAllCategories = async (token: string) => {
		const resp = await axios.get(API_URL + "/categories/", {
			headers: {
				Authorization: "Token " + token
			}
    });
    
    return resp.data;
	};

	getAllTransactions = async (token: string) => {
		const resp = await axios.get(API_URL + "/transactions/", {
			headers: {
				Authorization: "Token " + token
			}
    });
    
    return resp.data;
	};
}

export default new ApiHelper();
