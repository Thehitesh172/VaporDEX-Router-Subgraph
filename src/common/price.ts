import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Router } from "../../generated/Router/Router";
import { TraderJoeV2 } from "../../generated/Router/TraderJoeV2";
import { Token } from "../../generated/schema";
import {
  BIGINT_ONE,
  BIGINT_THOUSAND,
  BIGINT_THREE,
  TJRouter_V2_ADDRESS,
  USDC_ADDRESS,
  VAPORDEX_ROUTER_ADDRESS,
} from "./constants";

export function getUsdPrice(token: Token): i32 {
  //   let router = Router.bind(VAPORDEX_ROUTER_ADDRESS);
  //   let amountsOut = 0;
  //   let path = router.try_findBestPath(
  //     BigInt.fromI32(1000 * 10 ** token.decimals),
  //     token.id as Address,
  //     USDC_ADDRESS,
  //     BIGINT_THREE
  //   );
  //   if (!path.reverted) {
  //     amountsOut =
  //       path.value.amounts[path.value.amounts.length - 1].toI32() /
  //       (1000 * 10 ** token.decimals);
  //   }
  return 0;
}
