import axios from "axios";
import crypto, { KeyObject } from "crypto";
import fs from "fs";

import { KALSHI_DEFAULT_URL } from "../constants/constants";
import { KalshiMarketsClient } from "./marketClient";

const CRYPTO_SIGNING_TYPE = "sha256";

export class KalshiClient {
  private privateKey: KeyObject;
  private kalshiAPIId: string;
  public markets: KalshiMarketsClient;
  public apiUrl: string;

  constructor(key: KeyObject, kalshiAPIid: string, apiUrl?: string) {
    this.privateKey = key;
    this.kalshiAPIId = kalshiAPIid;
    this.apiUrl = apiUrl || KALSHI_DEFAULT_URL;
    this.markets = new KalshiMarketsClient(this);
  }

  static fromFile(
    filePath: string,
    kalshiAPIId: string,
    apiUrl?: string
  ): KalshiClient {
    const keyData = fs.readFileSync(filePath, "utf8");
    return new KalshiClient(
      crypto.createPrivateKey({
        key: keyData,
        format: "pem",
      }),
      kalshiAPIId,
      apiUrl
    );
  }

  static fromKey(
    key: KeyObject,
    kalshiAPIId: string,
    apiUrl?: string
  ): KalshiClient {
    return new KalshiClient(key, kalshiAPIId, apiUrl);
  }

  ////////////////////// HELPERS //////////////////////

  protected signPssText(privateKey: crypto.KeyObject, text: string): string {
    const message = Buffer.from(text, "utf-8");

    try {
      const signature = crypto.sign(CRYPTO_SIGNING_TYPE, message, {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      });
      return signature.toString("base64");
    } catch (error) {
      throw new Error("RSA sign PSS failed: " + (error as Error).message);
    }
  }

  protected generateRequestHeaders(
    path: string,
    method: "POST" | "GET" | "DELETE" | "PUT"
  ): Record<string, string> {
    const currentTime = new Date();
    const currentTimeMilliseconds = currentTime.getTime();
    const timestampStr = currentTimeMilliseconds.toString();

    const msgString = timestampStr + method + path;

    const sig = this.signPssText(this.privateKey, msgString);

    const headers = {
      "KALSHI-ACCESS-KEY": this.kalshiAPIId,
      "KALSHI-ACCESS-SIGNATURE": sig,
      "KALSHI-ACCESS-TIMESTAMP": timestampStr,
      "Content-Type": "application/json",
    };
    return headers;
  }

  public async sendWriteRequest<T>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: any
  ): Promise<T> {
    let axiosFunc;

    const headers = this.generateRequestHeaders(url, method);

    switch (method) {
      case "POST":
        axiosFunc = axios.post<T>;
        break;
      case "PUT":
        axiosFunc = axios.put<T>;
        break;
      case "DELETE":
        axiosFunc = axios.delete<T>;
        break;
    }

    try {
      const response = await this.sendWithRetries(() => axiosFunc(`${url}`, body, { headers }));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async sendGetRequest<T>(url: string, params?: any): Promise<T> {
    const headers = this.generateRequestHeaders(url, "GET");
    try {
      const response = await this.sendWithRetries(() => axios.get<T>(url, { headers, params }));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async sendWithRetries<T>(func: () => Promise<T>, retries = 3): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await func();
      } catch (error: any) {
        if (error.response?.status === 429) {
          const delay = attempt * 250;
          await new Promise((res) => setTimeout(res, delay));
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Request failed after ${retries} attempts`);
  }
}
