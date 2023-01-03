import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { RouterSwap } from "../../generated/schema";
import {
  BIGINT_ONE,
  BIGINT_TEN,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  USDC_ADDRESS,
  VAPORDEX_ROUTER_ADDRESS,
} from "./constants";
import { getOrCreateToken, getOrCreateUser } from "./getters";
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

export function updateUserMetrics(event: RouterSwapEvent): void {
  let user = getOrCreateUser(event);
  user.numberOfSwaps = user.numberOfSwaps.plus(BIGINT_ONE);
  user.totalUSDSwapped = BIGINT_ZERO;

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
  entity.usdValue = new BigDecimal(BIGINT_ZERO);
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function updateTokenMetrics(event: RouterSwapEvent): void {
  let tokenSold = getOrCreateToken(event.params.tokenIn);
  let tokenBought = getOrCreateToken(event.params.tokenOut);

  tokenSold.numberOfSells = tokenSold.numberOfSells.plus(BIGINT_ONE);
  tokenBought.numberOfBuys = tokenBought.numberOfBuys.plus(BIGINT_ONE);
  tokenSold.save();
  tokenBought.save();
}
