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
  strike_type: "less" | "greater" | string;
  cap_strike: number;
  rules_primary: string;
  rules_secondary: string;
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
