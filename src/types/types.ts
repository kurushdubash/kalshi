export type KalshiMarket = {
  ticker: string;
  event_ticker: string;
  market_type: "binary" | string;
  title: string;
  subtitle: string;
  yes_sub_title: string;
  no_sub_title: string;
  open_time: string; // ISO 8601 date string
  close_time: string; // ISO 8601 date string
  expected_expiration_time: string; // ISO 8601 date string
  expiration_time: string; // ISO 8601 date string
  latest_expiration_time: string; // ISO 8601 date string
  settlement_timer_seconds: number;
  status: "active" | "inactive" | string;
  response_price_units: "usd_cent" | string;
  notional_value: number;
  tick_size: number;
  yes_bid: number;
  yes_ask: number;
  no_bid: number;
  no_ask: number;
  last_price: number;
  previous_yes_bid: number;
  previous_yes_ask: number;
  previous_price: number;
  volume: number;
  volume_24h: number;
  liquidity: number;
  open_interest: number;
  result: string;
  can_close_early: boolean;
  expiration_value: string;
  category: string;
  risk_limit_cents: number;
  strike_type: "less" | "greater" | "custom" | string;
  cap_strike: number;
  rules_primary: string;
  rules_secondary: string;
  custom_strike?: {
    [key: string]: string;
  };
};

export type KalshiEventInfo = {
  event_ticker: string;
  series_ticker: string;
  sub_title: string;
  title: string;
  mutually_exclusive: boolean;
  category: string;
  strike_date: string; // ISO 8601 date string
};

export type KalshiEvent = {
  markets: KalshiMarket[];
  event: KalshiEventInfo;
};

export type KalshiOrderBook = {
  orderbook: {
    no: number[][];
    yes: number[][];
  };
};

export type KalshiOrderRequest = {
  action: string; // Specifies if this is a buy or sell order
  client_order_id: string;
  count: number; // Number of contracts to be bought or sold
  side: "yes" | "no"; // Specifies order side
  ticker: string; // Market ticker
  type: "market" | "limit"; // Order type
  expiration_ts?: number; // Expiration time in unix seconds; optional for Good 'Till Cancelled
  buy_max_cost?: number; // Maximum cents to spend for market buy orders
  no_price?: number; // Submitting price for the No side in cents
  sell_position_floor?: number; // Prevents flipping position if set to 0
  yes_price?: number; // Submitting price for the Yes side in cents
};

export type KalshiOrderResponse = {
  order: {
    action: "buy" | "sell" | "OrderActionUnknown"; // Represents trade action
    client_order_id: string;
    created_time: string; // ISO 8601 date-time
    expiration_time: string; // ISO 8601 date-time
    no_price: number; // No price in cents
    order_id: string; // Unique order identifier
    side: "yes" | "no" | "SIDE_UNSET"; // Direction of the order
    status: "resting" | "canceled" | "executed" | "pending"; // Current order status
    ticker: string; // Unique market identifier
    type: "market" | "limit" | "OrderTypeUnknown"; // Order type
    user_id?: string; // Optional unique identifier for user
    yes_price: number; // Yes price in cents
  };
};

export type KalshiCancelResponse = {
  order: KalshiOrderResponse["order"];
  reduced_by: number;
};

export type KalshiMarketsRequest = {
  limit?: number; // Parameter to specify the number of results per page. Defaults to 100.
  cursor?: string; // Pointer to the next page of records in pagination.
  event_ticker?: string; // Event ticker to retrieve markets for.
  series_ticker?: string; // Series ticker to retrieve contracts for.
  max_close_ts?: number; // Restricts markets to those closing in or before this timestamp.
  min_close_ts?: number; // Restricts markets to those closing in or after this timestamp.
  status?: string; // Restricts markets to those with certain statuses: unopened, open, closed, settled.
  tickers?: string; // Restricts markets to those with certain tickers, as a comma-separated list.
};

export type KalshiEventsRequest = {
  limit?: number; // Parameter to specify the number of results per page. Defaults to 100.
  cursor?: string; // Pointer to the next page of records in pagination.
  status?: "unopened" | "open" | "closed" | "settled"; // Restricts events to those with certain statuses.
  series_ticker?: string; // Series ticker to retrieve contracts for.
  with_nested_markets?: boolean; // If the markets belonging to the events should be added in the response as a nested field in this event.
};

export type KalshiTradesRequest = {
  cursor?: string; // The Cursor represents a pointer to the next page of records in the pagination.
  limit?: number; // Parameter to specify the number of results per page. Defaults to 100.
  ticker?: string; // Parameter to specify a specific market to get trades from.
  min_ts?: number; // Restricts the response to trades after a timestamp.
  max_ts?: number; // Restricts the response to trades before a timestamp.
};

export type KalshiTrade = {
  count: number; // Number of contracts to be bought or sold
  created_time: string; // Date and time in ISO 8601 format
  no_price: number; // No price for this trade in cents
  taker_side: "yes" | "no" | "SIDE_UNSET"; // Side for the taker of this trade
  ticker: string; // Unique identifier for markets
  trade_id: string; // Unique identifier for this trade
  yes_price: number; // Yes price for this trade in cents
};

export type KalshiSeries = {
  category: string; // Category specifies the category which this series belongs to.
  contract_url: string; // ContractUrl provides a direct link to contract terms which govern the series.
  frequency: string; // Description of the frequency of the series.
  settlement_sources: {
    name: string; // The official name of the settlement source
    url: string; // The URL of the settlement source
  }[]; // Array of settlement sources
  tags: string[]; // Tags specifies the subjects that this series relates to.
  ticker: string; // Ticker that identifies this series.
  title: string; // Title describing the series.
};

export type KalshiCandlestick = {
  candlesticks: {
    end_period_ts: number; // Unix timestamp for the end of the candlestick period
    open_interest: number; // Number of contracts bought by end of the period
    price: {
      close: number; // Close price at the end of the candlestick period
      high: number; // Highest price during the candlestick period
      low: number; // Lowest price during the candlestick period
      open: number; // Open price at the start of the candlestick period
      previous: number; // Previous close price
    };
    volume: number; // Number of contracts bought during the period
    yes_ask: {
      close: number; // Close price for the Yes side
      high: number; // Highest price for the Yes side
      low: number; // Lowest price for the Yes side
      open: number; // Open price for the Yes side
      previous: number; // Previous close price for the Yes side
    };
    yes_bid: {
      close: number; // Close price for the Yes side
      high: number; // Highest price for the Yes side
      low: number; // Lowest price for the Yes side
      open: number; // Open price for the Yes side
      previous: number; // Previous close price for the Yes side
    };
    ticker: string; // Unique identifier for the market
  }[];
};

export type KalshiCandlestickRequest = {
  strart_ts: number;
  end_ts: number;
  period_interval: number;
};

export type KalshiExchangeAnnouncement = {
    delivery_time: string; // ISO 8601 date-time
    message: string; // The message contained within the announcement
    status: "info" | "warning" | "error"; // The current status of this announcement
    type: "info" | "warning" | "error"; // The type of the announcement
};

export type KalshiExchangeSchedule {
  schedule: {
    [day: string]: {
      close_time: string;
      open_time: string;
    }[];
  };
}

export type KalshiExchangeStatus = {
  exchange_active: boolean; // False if the core Kalshi exchange is no longer taking any state changes
  exchange_estimated_resume_time: string; // Date and time in ISO 8601 format
  trading_active: boolean; // True if trading is currently permitted on the exchange
};