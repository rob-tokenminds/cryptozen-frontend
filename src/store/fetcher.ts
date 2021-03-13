import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UserNotification } from ".";
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;
export class Fetcher {
  private static async get(
    path: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    try {
      const axiosGet = await axios.get(`${BACKEND_URL}${path}`, config);
      return axiosGet;
    } catch (error) {
      let message: any = "";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message = error.request;
      } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
      }
      if (message.message) {
        message = message.message;
      }
      console.log("message", message);
      console.log(error.config);
      alert(message);
      throw new Error(message);
    }
  }

  private static async post(
    path: string,
    params: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    try {
      const axiosPost = await axios.post(
        `${BACKEND_URL}${path}`,
        params,
        config
      );
      return axiosPost;
    } catch (error) {
      let message: any = "";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message = error.request;
      } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
      }
      if (message.message) {
        message = message.message;
      }
      console.log("message", message);
      console.log(error.config);
      alert(message);
      throw new Error(message);
    }
  }

  static async getLoginWords(): Promise<string> {
    const fetch = await Fetcher.get(`/user/words`);
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
    const fetch = await Fetcher.get(`/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("fetch.data", fetch.data);
    return fetch.data;
  }

  static async updateEmail(token: string, email: string): Promise<string> {
    const fetch = await Fetcher.post(
      `/user/email/update`,
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
    const fetch = await Fetcher.get(`/user/email/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { email, id },
    });
    return fetch.data;
  }

  static async createWallet(
    token: string,
    name: string,
    address: string,
    currency: string,
    email: string,
    sendEmail: boolean,
    plainEmail: string,
    type: string
  ): Promise<AddressBookInterface> {
    const fetch = await Fetcher.post(
      `/user/address-book/create`,
      {
        name,
        address,
        currency,
        email,
        sendEmail,
        plainEmail,
        type,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return fetch.data;
  }

  static async getAddressBookList(
    token: string
  ): Promise<AddressBookInterface[]> {
    const fetch = await Fetcher.get(`/user/address-book/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return fetch.data;
  }

  static async getAddressBook(id: string): Promise<AddressBookInterface> {
    const fetch = await Fetcher.get(`/user/address-book/get/${id}`);
    return fetch.data;
  }

  static async submitAddressBook(
    id: string,
    address: string
  ): Promise<boolean> {
    const fetch = await Fetcher.post(`/user/address-book/submit`, {
      id,
      address,
    });
    return fetch.data;
  }

  static async checkNewNotification(userId: string): Promise<boolean> {
    const fetch = await Fetcher.get(`/user/notification/new/${userId}`);
    return fetch.data;
  }
  static async getNotifications(token: string): Promise<UserNotification[]> {
    const fetch = await Fetcher.get(`/user/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return fetch.data;
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    const fetch = await Fetcher.get(
      `/user/notification/mark-as-read/${notificationId}`
    );
    return fetch.data;
  }

  static async getTransactions(
    token: string,
    address: string,
    currency = ""
  ): Promise<TransactionInterface[]> {
    const fetch = await Fetcher.get(`/user/transactions/${address}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { currency },
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

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  addresses: UserAddressInterface[];
  address_books: AddressBookInterface[];
  active: boolean;
  email_verified: boolean;
  user?: UserInterface;
  created_at: Date;
  updated_at: Date;
}

export interface UserAddressInterface {
  id: string;
  user_id: string;
  user: UserInterface;
  address: string;
  hashed_signature: string;
  created_at: Date;
  updated_at: Date;
}

export interface AddressBookInterface {
  id: string;
  user_id: string;
  user: UserInterface;
  email: string;
  currency: string;
  name: string;
  address: string;
  created_at: Date;
  updated_at: Date;
  type: "wallet" | "recipient";
}

export interface TransactionInterface {
  id: string;
  user_id: string;
  user?: UserInterface;
  blockNumber: number;
  timestamp: number;
  hash: string;
  nonce: number;
  from: string;
  to: string;
  value: string;
  contractAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: number;
  transactionIndex?: number;
  isError: boolean;
  isToken: boolean;
  isInternal: boolean;
  created_at: Date;
  updated_at: Date;
}
