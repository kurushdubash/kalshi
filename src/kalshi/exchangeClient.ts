import { KalshiClient } from "./kalshiClient";
import {
  KalshiExchangeAnnouncement,
  KalshiExchangeSchedule,
  KalshiExchangeStatus,
} from "../types/types";

export interface KalshiExchangeClient {
  getExchangeAnnouncment(): Promise<KalshiExchangeAnnouncement[]>
  getExchangeSchedule(): Promise<KalshiExchangeSchedule>
  getExchangeStatus(): Promise<KalshiExchangeStatus>
}

export class KalshiExchangeClient {
  private client: KalshiClient;

  constructor(client: KalshiClient) {
    this.client = client;
  }

  public async getExchangeAnnouncment(
  ): Promise<KalshiExchangeAnnouncement[]> {
    const response = await this.client.sendGetRequest<{announcements: KalshiExchangeAnnouncement[]}>(
      `${this.client.apiUrl}/trade-api/v2/exchange/announcements`
    );
    return response.announcements;
  }

  public async getExchangeSchedule(
  ): Promise<KalshiExchangeSchedule> {
    return this.client.sendGetRequest<KalshiExchangeSchedule>(
      `${this.client.apiUrl}/trade-api/v2/exchange/schedule`
    );
  }

  public async getExchangeStatus(
  ): Promise<KalshiExchangeStatus> {
    return this.client.sendGetRequest<KalshiExchangeStatus>(
      `${this.client.apiUrl}/trade-api/v2/xchange/status`
    );
  }
}
