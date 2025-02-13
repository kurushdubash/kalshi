import axios from "axios";
import fs from "fs";
import crypto, { KeyObject } from "crypto";

import { KALSHI_DEFAULT_URL } from "../constants/constants";
import {
  KalshiEvent,
  KalshiMarket,
  KalshiOrderBook,
  KalshiOrderRequest,
  KalshiOrderResponse,
  KalshiCancelResponse,
} from "../types/types";

const CRYPTO_SIGNING_TYPE = "sha256";

export interface KalshiClient {
  getKalshiEvent(eventTicker: string): Promise<KalshiEvent>;
  getKalshiMarket(marketTicker: string): Promise<KalshiMarket>;
  getKalshiMarkets(marketTickers?: string[]): Promise<KalshiMarket[]>;
  getKalshiMarketOrderBook(marketTicker: string): Promise<KalshiOrderBook>;
  createKalshiOrder(
    orderRequest: KalshiOrderRequest
  ): Promise<KalshiOrderResponse>;
  cancelKalshiOrder(orderId: string): Promise<KalshiCancelResponse>;
}

export class KalshiClientImpl implements KalshiClient {
  private privateKey: KeyObject;
  private kalshiAPIId: string;
  private apiUrl: string;

  constructor(key: KeyObject, kalshiAPIid: string, apiUrl?: string) {
    this.privateKey = key;
    this.kalshiAPIId = kalshiAPIid;
    this.apiUrl = apiUrl || KALSHI_DEFAULT_URL;
  }

  static createFromFile(
    filePath: string,
    kalshiAPIId: string,
    apiUrl?: string
  ): KalshiClient {
    const keyData = fs.readFileSync(filePath, "utf8");
    return new KalshiClientImpl(
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
    return new KalshiClientImpl(key, kalshiAPIId, apiUrl);
  }

  public async getKalshiEvent(eventTicker: string): Promise<KalshiEvent> {
    return this.sendGetRequest<KalshiEvent>(
      `${this.apiUrl}/trade-api/v2/events/${eventTicker}`
    );
  }

  public async getKalshiMarket(marketTicker: string): Promise<KalshiMarket> {
    return this.sendGetRequest<KalshiMarket>(
      `${this.apiUrl}/trade-api/v2/markets/${marketTicker}`
    );
  }

  public async getKalshiMarkets(
    marketTickers: string[]
  ): Promise<KalshiMarket[]> {
    return this.sendGetRequest<KalshiMarket[]>(
      `${this.apiUrl}/trade-api/v2/markets`
    );
  }

  public async getKalshiMarketOrderBook(
    marketTicker: string
  ): Promise<KalshiOrderBook> {
    return this.sendGetRequest<KalshiOrderBook>(
      `${this.apiUrl}/trade-api/v2/markets/${marketTicker}/orderbook`
    );
  }

  public async createKalshiOrder(
    orderRequest: KalshiOrderRequest
  ): Promise<KalshiOrderResponse> {
    return this.sendWriteRequest<KalshiOrderResponse>(
      `${this.apiUrl}/trade-api/v2/portfolio/orders`,
      "POST",
      orderRequest
    );
  }

  public async cancelKalshiOrder(
    orderId: string
  ): Promise<KalshiCancelResponse> {
    return this.sendWriteRequest<KalshiCancelResponse>(
      `${this.apiUrl}/trade-api/v2/portfolio/orders/${orderId}`,
      "DELETE"
    );
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

  protected async sendWriteRequest<T>(
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
      const response = await axiosFunc(`${url}`, body, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  protected async sendGetRequest<T>(url: string): Promise<T> {
    const headers = this.generateRequestHeaders(url, "GET");
    try {
      const response = await axios.get<T>(url, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
