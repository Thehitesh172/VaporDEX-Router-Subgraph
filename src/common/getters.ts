import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { RouterSwap as RouterSwapEvent } from "../../generated/Router/Router";
import { Token, User } from "../../generated/schema";
import { BIGINT_ONE, BIGINT_ZERO, DEFAULT_DECIMALS } from "./constants";
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

export function getOrCreateToken(event: RouterSwapEvent): Token {
  let token = Token.load(event.params.tokenIn);

  if (token === null) {
    token = new Token(event.params.tokenIn);
    token.id = event.params.tokenIn;
    token.numberOfSwaps = BIGINT_ZERO;
    token.totalTokensSwapped = BIGINT_ZERO;
    token.totalVolumeUSD = BIGINT_ZERO;

    let erc20 = ERC20.bind(event.params.tokenIn);
    token.totalSupply = erc20.totalSupply();
    let symbol = erc20.symbol();
    let name = erc20.name();
    token.name = name;
    token.symbol = symbol;
  }
  token.save();
  return token;
}
