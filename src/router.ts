import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Recovered as RecoveredEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  RouterSwap as RouterSwapEvent,
  UpdatedAdapters as UpdatedAdaptersEvent,
  UpdatedFeeClaimer as UpdatedFeeClaimerEvent,
  UpdatedMinFee as UpdatedMinFeeEvent,
  UpdatedTrustedTokens as UpdatedTrustedTokensEvent,
} from "../generated/Router/Router";
import {
  Recovered,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  RouterSwap,
  UpdatedAdapters,
  UpdatedFeeClaimer,
  UpdatedMinFee,
  UpdatedTrustedTokens,
  User,
} from "../generated/schema";
import { WAVAX_ADDRESS } from "./common/constants";
import { formatAmount, getOrCreateToken, getUsdPrice } from "./common/getters";
import {
  updateDailyMetrics,
  updateMonthlyMetrics,
  updateSwapMetrics,
  updateTokenMetrics,
  updateUserMetrics,
  updateWeeklyMetrics,
} from "./common/metricsHelpers";

export function handleRouterSwap(event: RouterSwapEvent): void {
  // NOTE: tokenIn = sold token
  let tokenSold = getOrCreateToken(event.params.tokenIn);
  let tokenBought = getOrCreateToken(event.params.tokenOut);
  let tokenBoughtUSD = getUsdPrice(tokenBought);
  let amountInINtokenBought = formatAmount(
    event.params.amountOut.toBigDecimal(),
    tokenBought.decimals
  ).div(formatAmount(event.params.amountIn.toBigDecimal(), tokenSold.decimals));

  // let tokenSoldUSD = getUsdPrice(tokenSold);
  let tokenSoldUSD = amountInINtokenBought.times(tokenBoughtUSD);
  updateUserMetrics(event, tokenBoughtUSD);
  updateTokenMetrics(
    event,
    tokenSold,
    tokenBought,
    tokenBoughtUSD,
    tokenSoldUSD
  );
  let usdValue = formatAmount(
    event.params.amountOut.toBigDecimal(),
    tokenBought.decimals
  ).times(tokenBoughtUSD);
  updateSwapMetrics(event, tokenSold, tokenSold, tokenBoughtUSD, tokenSoldUSD);
  updateDailyMetrics(event, usdValue);
  updateMonthlyMetrics(event, usdValue);
  updateWeeklyMetrics(event, usdValue);
}

export function handleRecovered(event: RecoveredEvent): void {
  let entity = new Recovered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.newAdminRole = event.params.newAdminRole;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdatedAdapters(event: UpdatedAdaptersEvent): void {
  let entity = new UpdatedAdapters(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._newAdapters = event.params._newAdapters.map<Bytes>(
    (adapter: Bytes) => adapter
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdatedFeeClaimer(event: UpdatedFeeClaimerEvent): void {
  let entity = new UpdatedFeeClaimer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.oldFeeClaimer = event.params.oldFeeClaimer;
  entity.newFeeClaimer = event.params.newFeeClaimer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdatedMinFee(event: UpdatedMinFeeEvent): void {
  let entity = new UpdatedMinFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.oldMinFee = event.params.oldMinFee;
  entity.newMinFee = event.params.newMinFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdatedTrustedTokens(
  event: UpdatedTrustedTokensEvent
): void {
  let entity = new UpdatedTrustedTokens(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newTrustedTokens = event.params.newTrustedTokens.map<Bytes>(
    (token: Bytes) => token
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
