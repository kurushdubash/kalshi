# kalshi-sdk
An *unofficial* typescript client for https://kalshi.com/.

Currently only implements the [Markets APIs](https://trading-api.readme.io/reference/getevents):

# To install

`yarn add kalshi-sdk` or `npm install kalshi-sdk`

To use the client, you will [need an API key](https://trading-api.readme.io/reference/api-keys) and API Key ID from Kalshi.

To instnatiate the client, you can either do so by providing a path to your `.pem` file or by supplying the key directly:

Via a `.pem` file
```
const kalshiClient = KalshiClient.fromFile(filePath, KALSHI_API_ID_HERE);
```

or via the key directly:
```
const kalshiClient = KalshiClient.fromKey(key, KALSHI_API_ID_HERE);
```

# Using the Client

To use the client, you can invoke any of the market commands:
```
const market = await kalshiClient.markets.getMarket("KXEURUSDH-25FEB1416-T1.04899");
```

Currently supports the market, exchange, and collections APIs. (Websockets & Portfolio to come).

The current supported interface for the market types are:
```
getEvents(eventsRequest?: KalshiEventsRequest): Promise<KalshiEvent[]>;
getEvent(eventTicker: string, with_nested_markets: boolean): Promise<KalshiEvent>;
getMarkets(marketsRequest?: KalshiMarketsRequest): Promise<KalshiMarket[]>;
getMarket(marketTicker: string): Promise<KalshiMarket>;
getTrades(tradeRequest?: KalshiTradesRequest): Promise<KalshiTrade[]>;
getMarketOrderBook(marketTicker: string): Promise<KalshiOrderBook>;
getSeries(seriesTicker: string): Promise<KalshiSeries>;
getMarketCandlesticks(ticker: string,seriesTicker: string, candleStickRequest: KalshiCandlestickRequest): Promise<KalshiCandlestick[]>;
createKalshiOrder(orderRequest: KalshiOrderRequest): Promise<KalshiOrderResponse>;
cancelKalshiOrder(orderId: string): Promise<KalshiCancelResponse>;
```

For exchange:
```
getExchangeAnnouncment(): Promise<KalshiExchangeAnnouncement[]>
getExchangeSchedule(): Promise<KalshiExchangeSchedule>
getExchangeStatus(): Promise<KalshiExchangeStatus>
```
usage of client: 
```
const market = await kalshiClient.exchange.getExchangeStatus();
```


For collections: 
```
getMultivariateEventCollections(params?: KalshiMultivariateEventCollectionsRequest): Promise<KalshiMultivariateEventCollection[]>
getMultivariateEventCollection(collectionTicker: string): Promise<KalshiMultivariateEventCollection>
createMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket>
getMultivariateEventCollectionLookupHistory(collectionTicker: string, lookbackSeconds?: number): Promise<KalshiLookupPoint[]>
lookupTickersForMarketInMultivariateEventCollection(collectionTicker: string, selectedMarkets: KalshiSelectedMarket[]): Promise<KalshiEventMarket>
```

usage of client: 
```
const market = await kalshiClient.collections.getMultivariateEventCollections();
```
