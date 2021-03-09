import axios from "axios";
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;
export class Fetcher {
  static async getLoginWords(): Promise<string> {
    const fetch = await axios.get(`${BACKEND_URL}/user/words`);
    return fetch.data.words;
  }

  static async login(address: string, signature: string): Promise<string> {
    const fetch = await axios.post(`${BACKEND_URL}/user/login`, {
      address,
      signature,
    });
    return fetch.data.accessToken;
  }

  static async getProfile(token: string): Promise<ProfileInterface> {
    const fetch = await axios.get(`${BACKEND_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("fetch.data", fetch.data);
    return fetch.data;
  }

  static async updateEmail(token: string, email: string): Promise<string> {
    const fetch = await axios.post(
      `${BACKEND_URL}/user/email/update`,
      {
        email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return fetch.data.email;
  }

  static async verifyEmail(
    token: string,
    email: string,
    id: string
  ): Promise<boolean> {
    const fetch = await axios.get(`${BACKEND_URL}/user/email/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { email, id },
    });
    return fetch.data;
  }
}

export interface AddressInterface {
  address: string;
  created_at: string;
  id: string;
  updated_at: string;
  user_id: string;
}

export interface ProfileInterface {
  id: string;
  email: string | null;
  name: string | null;
  active: boolean;
  addresses: AddressInterface[];
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}
