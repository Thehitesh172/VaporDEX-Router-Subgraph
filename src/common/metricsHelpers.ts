import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import {
  CumulativeMetric,
  RouterSwap,
  Token,
  User,
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
  getOrCreateDailyMetrics,
  getOrCreateToken,
  getOrCreateUser,
  getVPNDPriceInUSD,
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

export function updateUserMetrics(event: RouterSwapEvent): void {
  let user = getOrCreateUser(event);
  user.numberOfSwaps = user.numberOfSwaps.plus(BIGINT_ONE);
  user.totalUSDSwapped = BIGINT_ZERO;
  let dailyID = getDailyID(event);

  user.dailyID = user.id
    .toHexString()
    .concat("-")
    .concat(dailyID.toString());
  user.save();
}

export function updateSwapMetrics(event: RouterSwapEvent): void {
  let entity = new RouterSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.tokenIn = event.params.tokenIn;
  entity.tokenOut = event.params.tokenOut;
  entity.amountIn = event.params.amountIn;
  entity.amountOut = event.params.amountOut;

  let usdValue = BIGINT_ZERO.toBigDecimal();
  let avaxPrice = getAVAXPriceInUSD();
  let vpndPrice = getVPNDPriceInUSD();

  if (event.params.tokenIn.equals(WAVAX_ADDRESS)) {
    usdValue = formatAmount(
      event.params.amountIn.toBigDecimal(),
      AVAX_DECIMALS
    ).times(avaxPrice);
  } else if (event.params.tokenIn.equals(VPND_ADDRESS)) {
    usdValue = vpndPrice.times(
      formatAmount(event.params.amountIn.toBigDecimal(), AVAX_DECIMALS)
    );
  } else if (event.params.tokenIn.equals(USDC_ADDRESS)) {
    usdValue = BIGINT_ONE.toBigDecimal().times(
      formatAmount(event.params.amountIn.toBigDecimal(), USDC_DECIMALS)
    );
  } else {
    usdValue = BIGINT_ZERO.toBigDecimal();
  }

  entity.usdValue = usdValue;
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
    usdValue
  );
  cumulativeMetrics.save();
  entity.usdValue = BIGINT_ZERO.toBigDecimal();
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function updateTokenMetrics(event: RouterSwapEvent): void {
  // NOTE: tokenIn = sold token
  let tokenSold = getOrCreateToken(event.params.tokenIn);
  let tokenBought = getOrCreateToken(event.params.tokenOut);

  tokenSold.numberOfSells = tokenSold.numberOfSells.plus(BIGINT_ONE);
  tokenSold.totalTokensSold = tokenSold.totalTokensSold.plus(
    event.params.amountIn
  );

  tokenBought.numberOfBuys = tokenBought.numberOfBuys.plus(BIGINT_ONE);
  tokenBought.totalTokensBought = tokenBought.totalTokensBought.plus(
    event.params.amountOut
  );

  tokenBought.currentPriceInUSD = getUsdPrice(
    Address.fromBytes(tokenBought.id)
  );
  tokenSold.currentPriceInUSD = getUsdPrice(Address.fromBytes(tokenSold.id));
  tokenSold.save();
  tokenBought.save();
}

export function updateDailyMetrics(event: RouterSwapEvent): void {
  let dailyMetrics = getOrCreateDailyMetrics(event);
  let user = User.load(event.transaction.from);

  if (user !== null) {
    dailyMetrics.dailyActiveUsers = dailyMetrics.dailyActiveUsers.plus(
      BIGINT_ONE
    );
  }
  dailyMetrics.numberOfTransactions = dailyMetrics.numberOfTransactions.plus(
    BIGINT_ONE
  );
  dailyMetrics.save();
}
