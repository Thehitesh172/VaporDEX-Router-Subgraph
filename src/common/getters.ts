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
import { Token, User } from "../../generated/schema";
import {
  BIGINT_HUNDRED,
  BIGINT_ONE,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  BIGINT_ZERO,
  DEFAULT_DECIMALS,
  USDC_ADDRESS,
  VAPORDEX_ROUTER_ADDRESS,
} from "./constants";
import { ERC20 } from "../../generated/Router/ERC20";

export function getOrCreateUser(event: ethereum.Event): User {
  let user = User.load(event.transaction.from);
  if (user === null) {
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
    token.totalTokensSwapped = BIGINT_ZERO;
    token.totalVolumeUSD = BIGINT_ZERO;

    let erc20 = ERC20.bind(address);
    token.totalSupply = erc20.totalSupply();
    let symbol = erc20.symbol();
    let name = erc20.name();
    token.name = name;
    token.symbol = symbol;
    token.numberOfBuys = BIGINT_ZERO;
    token.numberOfSells = BIGINT_ZERO;
  }
  token.usdPrice = new BigDecimal(BIGINT_ZERO);
  token.save();

  return token;
}
