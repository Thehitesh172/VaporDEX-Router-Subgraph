import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const DEFAULT_DECIMALS = 18;
export const USDC_DECIMALS = 6;
export const USDC_DENOMINATOR = BigDecimal.fromString("1000000");
export const BIGINT_NEG_ONE = BigInt.fromI32(-1);
export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_TWO = BigInt.fromI32(2);
export const BIGINT_THREE = BigInt.fromI32(3);
export const BIGINT_FIVE = BigInt.fromI32(5);
export const RECENT_BLOCK_THRESHOLD = BigInt.fromI32(5);
export const BIGINT_TEN = BigInt.fromI32(10);
export const BIGINT_FIFTY = BigInt.fromI32(50);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_THOUSAND = BigInt.fromI32(1000);
export const BIGINT_THREE_THOUSAND = BigInt.fromI32(3000);
export const BIGINT_FIVE_THOUSAND = BigInt.fromI32(5000);
export const BIGINT_TEN_THOUSAND = BigInt.fromI32(10000);
export const BIGINT_TWENTY_FIVE_THOUSAND = BigInt.fromI32(25000);
export const BIGINT_ONE_HUNDRED_THOUSAND = BigInt.fromI32(100000);
export const BIGINT_TWO_HUNDRED_FIFTY_THOUSAND = BigInt.fromI32(250000);
export const BIGINT_FOUR_HUNDRED_THOUSAND = BigInt.fromI32(400000);
export const BIGINT_MAX = BigInt.fromString(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

export const INT_NEGATIVE_ONE = -1 as i32;
export const INT_ZERO = 0 as i32;
export const INT_ONE = 1 as i32;
export const INT_TWO = 2 as i32;
export const INT_FOUR = 4 as i32;

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_TWO = new BigDecimal(BIGINT_TWO);
export const BIGDECIMAL_TEN = new BigDecimal(BIGINT_TEN);
export const BIGDECIMAL_HUNDRED = new BigDecimal(BIGINT_HUNDRED);

export const BIGDECIMAL_FIFTY_PERCENT = new BigDecimal(BIGINT_FIFTY);
export const MAX_UINT = BigInt.fromI32(2).times(BigInt.fromI32(255));
export const DAYS_PER_YEAR = new BigDecimal(BigInt.fromI32(365));
export const SECONDS_PER_DAY = 60 * 60 * 24;
export const SECONDS_PER_HOUR = 60 * 60;
export const MS_PER_DAY = new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000));
export const ONE_WEEK_IN_DAYS = BigInt.fromI32(7);

export const MS_PER_YEAR = DAYS_PER_YEAR.times(
  new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000))
);

// Imported into configurations typescript file to set minimum liquidity thresholds for estimating price using a liquidity pool;
export const MINIMUM_LIQUIDITY_THREE_THOUSAND = new BigDecimal(
  BIGINT_THREE_THOUSAND
);
export const MINIMUM_LIQUIDITY_FIVE_THOUSAND = new BigDecimal(
  BIGINT_FIVE_THOUSAND
);
export const MINIMUM_LIQUIDITY_TEN_THOUSAND = new BigDecimal(
  BIGINT_TEN_THOUSAND
);
export const MINIMUM_LIQUIDITY_TWENTY_FIVE_THOUSAND = new BigDecimal(
  BIGINT_TWENTY_FIVE_THOUSAND
);
export const MINIMUM_LIQUIDITY_ONE_THOUSAND = new BigDecimal(BIGINT_THOUSAND);
export const MINIMUM_LIQUIDITY_ONE_HUNDRED_THOUSAND = new BigDecimal(
  BIGINT_ONE_HUNDRED_THOUSAND
);
export const MINIMUM_LIQUIDITY_TWO_HUNDRED_FIFTY_THOUSAND = new BigDecimal(
  BIGINT_TWO_HUNDRED_FIFTY_THOUSAND
);
export const MINIMUM_LIQUIDITY_FOUR_HUNDRED_THOUSAND = new BigDecimal(
  BIGINT_FOUR_HUNDRED_THOUSAND
);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const VAPORDEX_ROUTER_ADDRESS = Address.fromString(
  "0xdef9ee39fd82ee57a1b789bc877e2cbd88fd5cae"
);
export const USDC_ADDRESS = Address.fromString(
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
);

export const TJRouter_V2_ADDRESS = Address.fromString(
  "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
);

export const DeployedBlockTimeStamp = 1664216963;
