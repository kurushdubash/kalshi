import { KalshiClient } from "./kalshiClient";
import {
  KalshiEventMarket,
  KalshiLookupPoint,
  KalshiMultivariateEventCollection,
  KalshiMultivariateEventCollectionsRequest,
  KalshiSelectedMarket,
} from "../types/types";

export interface KalshiCollectionsClient {
  getMultivariateEventCollections(params?: KalshiMultivariateEventCollectionsRequest): Promise<KalshiMultivariateEventCollection[]>
  getMultivariateEventCollection(collectionTicker: string): Promise<KalshiMultivariateEventCollection>
  createMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket>
  getMultivariateEventCollectionLookupHistory(collectionTicker: string, lookbackSeconds?: number): Promise<KalshiLookupPoint[]>
  lookupTickersForMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket>
}

export class KalshiCollectionsClient {
  private client: KalshiClient;

  constructor(client: KalshiClient) {
    this.client = client;
  }

  public async getMultivariateEventCollections(params?: KalshiMultivariateEventCollectionsRequest): Promise<KalshiMultivariateEventCollection[]> {
    return this.client.sendGetRequest<KalshiMultivariateEventCollection[]>(
      `${this.client.apiUrl}/trade-api/v2/multivariate_event_collections/`,
      params
    );
  }

  public async getMultivariateEventCollection(collectionTicker: string): Promise<KalshiMultivariateEventCollection> {
    return this.client.sendGetRequest<KalshiMultivariateEventCollection>(
      `${this.client.apiUrl}/trade-api/v2/multivariate_event_collections/${collectionTicker}`
    );
  }

  public async createMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket> {
    return this.client.sendWriteRequest<KalshiEventMarket>(
      `${this.client.apiUrl}/trade-api/v2/multivariate_event_collections/${collectionTicker}`, 
      "POST",
      { selected_markets: selectedMarkets}
    );
  }

  public async getMultivariateEventCollectionLookupHistory(collectionTicker: string, lookbackSeconds?: number): Promise<KalshiLookupPoint[]> {
    const response = await this.client.sendGetRequest<{ lookup_points: KalshiLookupPoint[]} >(
      `${this.client.apiUrl}/trade-api/v2/multivariate_event_collections/${collectionTicker}/lookup`,
      {lookback_seconds: lookbackSeconds}
    );

    return response.lookup_points;
  }

  public async lookupTickersForMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket> {
    return this.client.sendWriteRequest<KalshiEventMarket>(
      `${this.client.apiUrl}/trade-api/v2/multivariate_event_collections/${collectionTicker}/lookup`,
      "PUT",
      {selected_markets: selectedMarkets}
    );
  }
}
