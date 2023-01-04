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
import { DailyMetric, Token, User } from "../../generated/schema";
import {
  BIGINT_HUNDRED,
  BIGINT_ONE,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  DEFAULT_DECIMALS,
  DeployedBlockTimeStamp,
  SECONDS_PER_DAY,
  USDC_ADDRESS,
  VAPORDEX_ROUTER_ADDRESS,
} from "./constants";
import { ERC20 } from "../../generated/Router/ERC20";

export function getOrCreateUser(event: RouterSwapEvent): User {
  let user = User.load(event.transaction.from);
  if (user === null) {
    user = new User(event.transaction.from);
    user.numberOfSwaps = BIGINT_ZERO;
    user.totalUSDSwapped = BIGINT_ZERO;

    let dailyID = getDailyID(event);

    user.dailyID = event.transaction.from
      .toHexString()
      .concat("-")
      .concat(dailyID.toString());
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
  token.usdPrice = new BigDecimal(BIGINT_ZERO);
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

  return dailyID;
}
