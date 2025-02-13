import { KalshiClient } from "./kalshiClient";
import {
  KalshiEvent,
  KalshiMarket,
  KalshiOrderBook,
  KalshiOrderRequest,
  KalshiOrderResponse,
  KalshiCancelResponse,
  KalshiMarketsRequest,
  KalshiEventsRequest,
  KalshiTradesRequest,
  KalshiTrade,
  KalshiSeries,
  KalshiCandlestick,
  KalshiCandlestickRequest,
} from "../types/types";

export interface KalshiMarketsClient {
  getEvents(eventsRequest?: KalshiEventsRequest): Promise<KalshiEvent[]>;
  getEvent(
    eventTicker: string,
    with_nested_markets: boolean
  ): Promise<KalshiEvent>;
  getMarkets(marketsRequest?: KalshiMarketsRequest): Promise<KalshiMarket[]>;
  getMarket(marketTicker: string): Promise<KalshiMarket>;
  getTrades(tradeRequest?: KalshiTradesRequest): Promise<KalshiTrade[]>;
  getMarketOrderBook(marketTicker: string): Promise<KalshiOrderBook>;
  getSeries(seriesTicker: string): Promise<KalshiSeries>;
  getMarketCandlesticks(
    ticker: string,
    seriesTicker: string,
    candleStickRequest: KalshiCandlestickRequest
  ): Promise<KalshiCandlestick[]>;
  createKalshiOrder(
    orderRequest: KalshiOrderRequest
  ): Promise<KalshiOrderResponse>;
  cancelKalshiOrder(orderId: string): Promise<KalshiCancelResponse>;
}

export class KalshiMarketsClient {
  private client: KalshiClient;

  constructor(client: KalshiClient) {
    this.client = client;
  }

  public async getEvents(
    eventsRequest?: KalshiEventsRequest
  ): Promise<KalshiEvent[]> {
    return this.client.sendGetRequest<KalshiEvent[]>(
      `${this.client.apiUrl}/trade-api/v2/events`,
      eventsRequest
    );
  }

  public async getEvent(
    eventTicker: string,
    with_nested_markets: boolean
  ): Promise<KalshiEvent> {
    return this.client.sendGetRequest<KalshiEvent>(
      `${this.client.apiUrl}/trade-api/v2/events/${eventTicker}`,
      { with_nested_markets }
    );
  }

  public async getMarkets(
    marketsRequest?: KalshiMarketsRequest
  ): Promise<KalshiMarket[]> {
    return this.client.sendGetRequest<KalshiMarket[]>(
      `${this.client.apiUrl}/trade-api/v2/markets`,
      marketsRequest
    );
  }

  public async getMarket(marketTicker: string): Promise<KalshiMarket> {
    return this.client.sendGetRequest<KalshiMarket>(
      `${this.client.apiUrl}/trade-api/v2/markets/${marketTicker}`
    );
  }

  public async getTrades(
    tradeRequest?: KalshiTradesRequest
  ): Promise<KalshiTrade[]> {
    return this.client.sendGetRequest<KalshiTrade[]>(
      `${this.client.apiUrl}/trade-api/v2/trades`,
      tradeRequest
    );
  }

  public async getMarketOrderBook(
    marketTicker: string,
    depth?: number
  ): Promise<KalshiOrderBook> {
    return this.client.sendGetRequest<KalshiOrderBook>(
      `${this.client.apiUrl}/trade-api/v2/markets/${marketTicker}/orderbook`,
      { depth }
    );
  }

  public async getSeries(seriesTicker: string): Promise<KalshiSeries> {
    return this.client.sendGetRequest<KalshiSeries>(
      `${this.client.apiUrl}/trade-api/v2/series/${seriesTicker}`
    );
  }

  public async getMarketCandlesticks(
    ticker: string,
    seriesTicker: string,
    candleStickRequest: KalshiCandlestickRequest
  ): Promise<KalshiCandlestick[]> {
    return this.client.sendGetRequest<KalshiCandlestick[]>(
      `${this.client.apiUrl}/trade-api/v2/series/${seriesTicker}/markets/${ticker}/candlesticks`
    );
  }

  public async createKalshiOrder(
    orderRequest: KalshiOrderRequest
  ): Promise<KalshiOrderResponse> {
    return this.client.sendWriteRequest<KalshiOrderResponse>(
      `${this.client.apiUrl}/trade-api/v2/portfolio/orders`,
      "POST",
      orderRequest
    );
  }

  public async cancelKalshiOrder(
    orderId: string
  ): Promise<KalshiCancelResponse> {
    return this.client.sendWriteRequest<KalshiCancelResponse>(
      `${this.client.apiUrl}/trade-api/v2/portfolio/orders/${orderId}`,
      "DELETE"
    );
  }
}
