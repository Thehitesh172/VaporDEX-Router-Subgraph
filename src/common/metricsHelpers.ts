import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import {
  CumulativeMetric,
  DailyUser,
  MonthlyUser,
  RouterSwap,
  Token,
  User,
  WeeklyUser,
} from "../../generated/schema";
import {
  AVAX_DECIMALS,
  BIGINT_ONE,
  BIGINT_TEN,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  DeployedBlockTimeStamp,
  USDC_ADDRESS,
  USDC_DECIMALS,
  VAPORDEX_ROUTER_ADDRESS,
  VPND_ADDRESS,
  WAVAX_ADDRESS,
} from "./constants";
import {
  formatAmount,
  getAVAXPriceInUSD,
  getDailyID,
  getMonthID,
  getOrCreateDailyMetrics,
  getOrCreateMonthlyMetrics,
  getOrCreateToken,
  getOrCreateUser,
  getOrCreateWeeklyMetrics,
  getVPNDPriceInUSD,
  getWeekID,
} from "./getters";
import {
  Recovered as RecoveredEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Router,
  RouterSwap as RouterSwapEvent,
  UpdatedAdapters as UpdatedAdaptersEvent,
  UpdatedFeeClaimer as UpdatedFeeClaimerEvent,
  UpdatedMinFee as UpdatedMinFeeEvent,
  UpdatedTrustedTokens as UpdatedTrustedTokensEvent,
} from "../../generated/Router/Router";
import { getUsdPrice } from "./getters";

export function updateUserMetrics(
  event: RouterSwapEvent,
  tokenBoughtUSD: BigDecimal
): void {
  let user = getOrCreateUser(event);
  user.numberOfSwaps = user.numberOfSwaps.plus(BIGINT_ONE);
  user.totalUSDSwapped = user.totalUSDSwapped.plus(tokenBoughtUSD);
  user.save();
}

export function updateSwapMetrics(
  event: RouterSwapEvent,
  tokenSold: Token,
  tokenBought: Token,
  tokenBoughtUSD: BigDecimal,
  tokenSoldUSD: BigDecimal
): void {
  let entity = new RouterSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.tokenIn = event.params.tokenIn;
  entity.tokenOut = event.params.tokenOut;
  entity.amountIn = event.params.amountIn;
  entity.amountOut = event.params.amountOut;
  let formattedUSdValue = tokenSoldUSD.times(
    formatAmount(event.params.amountIn.toBigDecimal(), tokenSold.decimals)
  );
  entity.usdValue = formattedUSdValue;

  let cumulativeMetrics = CumulativeMetric.load("TOTAL");
  if (cumulativeMetrics === null) {
    cumulativeMetrics = new CumulativeMetric("TOTAL");
    cumulativeMetrics.uniqueUsers = BIGINT_ZERO;
    cumulativeMetrics.numberOfSwaps = BIGINT_ZERO;
    cumulativeMetrics.totalVolumeUSD = BIGINT_ZERO.toBigDecimal();
    cumulativeMetrics.save();
  }
  cumulativeMetrics.numberOfSwaps = cumulativeMetrics.numberOfSwaps.plus(
    BIGINT_ONE
  );
  cumulativeMetrics.totalVolumeUSD = cumulativeMetrics.totalVolumeUSD.plus(
    formattedUSdValue
  );
  cumulativeMetrics.save();
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function updateTokenMetrics(
  event: RouterSwapEvent,
  tokenSold: Token,
  tokenBought: Token,
  tokenBoughtUSD: BigDecimal,
  tokenSoldUSD: BigDecimal
): void {
  tokenSold.numberOfSells = tokenSold.numberOfSells.plus(BIGINT_ONE);
  tokenSold.totalTokensSold = tokenSold.totalTokensSold.plus(
    event.params.amountIn
  );

  tokenBought.numberOfBuys = tokenBought.numberOfBuys.plus(BIGINT_ONE);
  tokenBought.totalTokensBought = tokenBought.totalTokensBought.plus(
    event.params.amountOut
  );

  tokenBought.totalVolumeUSD = tokenBought.totalVolumeUSD.plus(
    formatAmount(
      event.params.amountOut.toBigDecimal(),
      tokenBought.decimals
    ).times(tokenBoughtUSD)
  );

  tokenSold.totalVolumeUSD = tokenSold.totalVolumeUSD.plus(
    formatAmount(
      event.params.amountIn.toBigDecimal(),
      tokenSold.decimals
    ).times(tokenSoldUSD)
  );
  tokenBought.currentPriceInUSD = tokenBoughtUSD;
  tokenSold.currentPriceInUSD = tokenSoldUSD;
  tokenSold.save();
  tokenBought.save();
}

export function updateDailyMetrics(
  event: RouterSwapEvent,
  usdValue: BigDecimal
): void {
  let dailyMetrics = getOrCreateDailyMetrics(event);
  let userDayID = getDailyID(event)
    .toString()
    .concat(event.transaction.from.toHexString());

  let dailyUser = DailyUser.load(userDayID);
  if (dailyUser === null) {
    dailyUser = new DailyUser(userDayID);
    dailyUser.address = event.transaction.from;
    dailyMetrics.dailyActiveUsers = dailyMetrics.dailyActiveUsers.plus(
      BIGINT_ONE
    );
    dailyUser.save();
  }
  dailyMetrics.volumeUSD = dailyMetrics.volumeUSD.plus(usdValue);
  dailyMetrics.numberOfTransactions = dailyMetrics.numberOfTransactions.plus(
    BIGINT_ONE
  );
  dailyMetrics.save();
}

export function updateWeeklyMetrics(
  event: RouterSwapEvent,
  usdValue: BigDecimal
): void {
  let weeklyMetrics = getOrCreateWeeklyMetrics(event);
  let userWeekID = getWeekID(event)
    .toString()
    .concat(event.transaction.from.toHexString());
  let weeklyUser = WeeklyUser.load(userWeekID);

  if (weeklyUser === null) {
    weeklyUser = new WeeklyUser(userWeekID);
    weeklyUser.address = event.transaction.from;
    weeklyMetrics.weeklyActiveUsers = weeklyMetrics.weeklyActiveUsers.plus(
      BIGINT_ONE
    );
    weeklyUser.save();
  }
  weeklyMetrics.numberOfTransactions = weeklyMetrics.numberOfTransactions.plus(
    BIGINT_ONE
  );
  weeklyMetrics.volumeUSD = weeklyMetrics.volumeUSD.plus(usdValue);
  weeklyMetrics.save();
}

export function updateMonthlyMetrics(
  event: RouterSwapEvent,
  usdValue: BigDecimal
): void {
  let monthlyMetrics = getOrCreateMonthlyMetrics(event);
  let userMonthID = getMonthID(event)
    .toString()
    .concat(event.transaction.from.toHexString());

  let monthlyUser = MonthlyUser.load(userMonthID);

  if (monthlyUser === null) {
    monthlyUser = new MonthlyUser(userMonthID);
    monthlyUser.address = event.transaction.from;
    monthlyUser.save();
    monthlyMetrics.monthlyActiveUsers = monthlyMetrics.monthlyActiveUsers.plus(
      BIGINT_ONE
    );
  }
  monthlyMetrics.numberOfTransactions = monthlyMetrics.numberOfTransactions.plus(
    BIGINT_ONE
  );
  monthlyMetrics.volumeUSD = monthlyMetrics.volumeUSD.plus(usdValue);
  monthlyMetrics.save();
}
