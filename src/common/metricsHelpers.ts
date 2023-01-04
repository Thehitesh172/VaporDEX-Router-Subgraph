import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import { RouterSwap, Token, User } from "../../generated/schema";
import {
  BIGINT_ONE,
  BIGINT_TEN,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  DeployedBlockTimeStamp,
  USDC_ADDRESS,
  VAPORDEX_ROUTER_ADDRESS,
} from "./constants";
import {
  getDailyID,
  getOrCreateDailyMetrics,
  getOrCreateToken,
  getOrCreateUser,
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
import { getUsdPrice } from "./price";

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
  entity.usdValue = 0;
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
