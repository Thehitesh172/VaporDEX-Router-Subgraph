import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
} from "@graphprotocol/graph-ts";
import {
  Router,
  RouterSwap as RouterSwapEvent,
} from "../../generated/Router/Router";
import {
  CumulativeMetric,
  DailyMetric,
  MonthlyMetric,
  Token,
  User,
  WeeklyMetric,
} from "../../generated/schema";
import {
  AVAX_DECIMALS,
  AVAX_USDC_PAIR,
  BIGDECIMAL_ONE,
  BIGINT_HUNDRED,
  BIGINT_ONE,
  BIGINT_TEN,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  DEFAULT_DECIMALS,
  DeployedBlockTimeStamp,
  SECONDS_PER_DAY,
  SECONDS_PER_WEEK,
  STABLES_TOKENS,
  USDC_ADDRESS,
  USDC_DECIMALS,
  VAPORDEX_ROUTER_ADDRESS,
  VPND_ADDRESS,
  VPND_AVAX_PAIR,
  WAVAX_ADDRESS,
} from "./constants";
import { ERC20 } from "../../generated/Router/ERC20";
import { Pair } from "../../generated/Router/Pair";

export function getOrCreateUser(event: RouterSwapEvent): User {
  let user = User.load(event.transaction.from);
  if (user === null) {
    let cumulativeMetrics = CumulativeMetric.load("TOTAL");
    if (cumulativeMetrics === null) {
      cumulativeMetrics = new CumulativeMetric("TOTAL");
      cumulativeMetrics.uniqueUsers = BIGINT_ZERO;
      cumulativeMetrics.numberOfSwaps = BIGINT_ZERO;
      cumulativeMetrics.totalVolumeUSD = BIGINT_ZERO.toBigDecimal();
      cumulativeMetrics.save();
    }
    cumulativeMetrics.uniqueUsers = cumulativeMetrics.uniqueUsers.plus(
      BIGINT_ONE
    );
    cumulativeMetrics.save();
    user = new User(event.transaction.from);
    user.numberOfSwaps = BIGINT_ZERO;
    user.totalUSDSwapped = BIGINT_ZERO;
    user.save();
  }

  return user;
}

export function getOrCreateToken(address: Address): Token {
  let token = Token.load(address);

  if (token === null) {
    token = new Token(address);
    token.id = address;
    token.totalVolumeUSD = BIGINT_ZERO;

    let erc20 = ERC20.bind(address);
    token.totalSupply = erc20.totalSupply();
    let symbol = erc20.symbol();
    let name = erc20.name();
    let decimals = erc20.decimals();
    token.decimals = decimals;
    token.name = name;
    token.symbol = symbol;
    token.numberOfBuys = BIGINT_ZERO;
    token.numberOfSells = BIGINT_ZERO;
    token.totalTokensBought = BIGINT_ZERO;
    token.totalTokensSold = BIGINT_ZERO;
  }
  token.currentPriceInUSD = new BigDecimal(BIGINT_ZERO);
  token.save();

  return token;
}

export function getOrCreateDailyMetrics(event: RouterSwapEvent): DailyMetric {
  let numDaysPassedAfterContractDeploment = getDailyID(event);

  let dailyMetrics = DailyMetric.load(
    numDaysPassedAfterContractDeploment.toString()
  );

  if (dailyMetrics === null) {
    dailyMetrics = new DailyMetric(
      numDaysPassedAfterContractDeploment.toString()
    );
    dailyMetrics.id = numDaysPassedAfterContractDeploment.toString();
    dailyMetrics.numberOfTransactions = BIGINT_ZERO;
    dailyMetrics.dailyActiveUsers = BIGINT_ZERO;
    dailyMetrics.volumeUSD = BIGINT_ZERO;
    dailyMetrics.timestamp = event.block.timestamp;
    dailyMetrics.save();
  }
  return dailyMetrics;
}

export function getDailyID(event: RouterSwapEvent): number {
  let dailyID =
    (event.block.timestamp.toI32() - DeployedBlockTimeStamp) / SECONDS_PER_DAY;

  return dailyID + 1;
}

export function getUsdPrice(token: Address): BigDecimal {
  if (token.equals(VPND_ADDRESS)) {
    return getVPNDPriceInUSD();
  } else if (token.equals(WAVAX_ADDRESS)) {
    return getAVAXPriceInUSD();
  } else if (STABLES_TOKENS.includes(token)) {
    return BIGDECIMAL_ONE;
  } else {
    return BIGINT_ZERO.toBigDecimal();
  }
}

export function getAVAXPriceInUSD(): BigDecimal {
  let pair = Pair.bind(AVAX_USDC_PAIR);
  let reserves = pair.getReserves();
  let reserve0 = reserves.getReserve0();
  let reserve1 = reserves.getReserve1();

  let avaxPrice = formatAmount(reserve1.toBigDecimal(), USDC_DECIMALS).div(
    formatAmount(reserve0.toBigDecimal(), AVAX_DECIMALS)
  );
  return avaxPrice;
}

export function getVPNDPriceInUSD(): BigDecimal {
  let pair = Pair.bind(VPND_AVAX_PAIR);
  let reserves = pair.getReserves();
  let reserve0 = reserves.getReserve0().toBigDecimal();
  let reserve1 = reserves.getReserve1().toBigDecimal();

  let vpndPriceInAVAX = reserve1.div(reserve0);

  let vpndPriceInUSD = getAVAXPriceInUSD().times(vpndPriceInAVAX);
  return vpndPriceInUSD;
}

export function formatAmount(amount: BigDecimal, decimals: i32): BigDecimal {
  return amount.div(BIGINT_TEN.pow(decimals as u8).toBigDecimal());
}

export function getOrCreateWeeklyMetrics(event: RouterSwapEvent): WeeklyMetric {
  let weekID = getWeekID(event).toString();
  let weeklyMetrics = WeeklyMetric.load(weekID);
  if (weeklyMetrics === null) {
    weeklyMetrics = new WeeklyMetric(weekID);
    weeklyMetrics.numberOfTransactions = BIGINT_ZERO;
    weeklyMetrics.weeklyActiveUsers = BIGINT_ZERO;
    weeklyMetrics.volumeUSD = BIGINT_ZERO;
    weeklyMetrics.timestamp = event.block.timestamp;
    weeklyMetrics.save();
  }
  return weeklyMetrics;
}

export function getWeekID(event: RouterSwapEvent): number {
  let weekID =
    (event.block.timestamp.toI32() - DeployedBlockTimeStamp) / SECONDS_PER_WEEK;

  return weekID + 1;
}

export function getMonthID(event: RouterSwapEvent): number {
  let monthID =
    ((event.block.timestamp.toI32() - DeployedBlockTimeStamp) * 12) /
    (365 * SECONDS_PER_DAY);

  return monthID + 1;
}

export function getOrCreateMonthlyMetrics(
  event: RouterSwapEvent
): MonthlyMetric {
  let monthID = getMonthID(event).toString();
  let monthlyMetrics = MonthlyMetric.load(monthID);
  if (monthlyMetrics === null) {
    monthlyMetrics = new MonthlyMetric(monthID);
    monthlyMetrics.numberOfTransactions = BIGINT_ZERO;
    monthlyMetrics.monthlyActiveUsers = BIGINT_ZERO;
    monthlyMetrics.volumeUSD = BIGINT_ZERO;
    monthlyMetrics.timestamp = event.block.timestamp;
    monthlyMetrics.save();
  }
  return monthlyMetrics;
}
