import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Recovered,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  RouterSwap,
  UpdatedAdapters,
  UpdatedFeeClaimer,
  UpdatedMinFee,
  UpdatedTrustedTokens
} from "../generated/Router/Router"

export function createRecoveredEvent(
  asset: Address,
  amount: BigInt
): Recovered {
  let recoveredEvent = changetype<Recovered>(newMockEvent())

  recoveredEvent.parameters = new Array()

  recoveredEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  recoveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return recoveredEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createRouterSwapEvent(
  tokenIn: Address,
  tokenOut: Address,
  amountIn: BigInt,
  amountOut: BigInt
): RouterSwap {
  let routerSwapEvent = changetype<RouterSwap>(newMockEvent())

  routerSwapEvent.parameters = new Array()

  routerSwapEvent.parameters.push(
    new ethereum.EventParam("tokenIn", ethereum.Value.fromAddress(tokenIn))
  )
  routerSwapEvent.parameters.push(
    new ethereum.EventParam("tokenOut", ethereum.Value.fromAddress(tokenOut))
  )
  routerSwapEvent.parameters.push(
    new ethereum.EventParam(
      "amountIn",
      ethereum.Value.fromUnsignedBigInt(amountIn)
    )
  )
  routerSwapEvent.parameters.push(
    new ethereum.EventParam(
      "amountOut",
      ethereum.Value.fromUnsignedBigInt(amountOut)
    )
  )

  return routerSwapEvent
}

export function createUpdatedAdaptersEvent(
  _newAdapters: Array<Address>
): UpdatedAdapters {
  let updatedAdaptersEvent = changetype<UpdatedAdapters>(newMockEvent())

  updatedAdaptersEvent.parameters = new Array()

  updatedAdaptersEvent.parameters.push(
    new ethereum.EventParam(
      "_newAdapters",
      ethereum.Value.fromAddressArray(_newAdapters)
    )
  )

  return updatedAdaptersEvent
}

export function createUpdatedFeeClaimerEvent(
  oldFeeClaimer: Address,
  newFeeClaimer: Address
): UpdatedFeeClaimer {
  let updatedFeeClaimerEvent = changetype<UpdatedFeeClaimer>(newMockEvent())

  updatedFeeClaimerEvent.parameters = new Array()

  updatedFeeClaimerEvent.parameters.push(
    new ethereum.EventParam(
      "oldFeeClaimer",
      ethereum.Value.fromAddress(oldFeeClaimer)
    )
  )
  updatedFeeClaimerEvent.parameters.push(
    new ethereum.EventParam(
      "newFeeClaimer",
      ethereum.Value.fromAddress(newFeeClaimer)
    )
  )

  return updatedFeeClaimerEvent
}

export function createUpdatedMinFeeEvent(
  oldMinFee: BigInt,
  newMinFee: BigInt
): UpdatedMinFee {
  let updatedMinFeeEvent = changetype<UpdatedMinFee>(newMockEvent())

  updatedMinFeeEvent.parameters = new Array()

  updatedMinFeeEvent.parameters.push(
    new ethereum.EventParam(
      "oldMinFee",
      ethereum.Value.fromUnsignedBigInt(oldMinFee)
    )
  )
  updatedMinFeeEvent.parameters.push(
    new ethereum.EventParam(
      "newMinFee",
      ethereum.Value.fromUnsignedBigInt(newMinFee)
    )
  )

  return updatedMinFeeEvent
}

export function createUpdatedTrustedTokensEvent(
  newTrustedTokens: Array<Address>
): UpdatedTrustedTokens {
  let updatedTrustedTokensEvent = changetype<UpdatedTrustedTokens>(
    newMockEvent()
  )

  updatedTrustedTokensEvent.parameters = new Array()

  updatedTrustedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "newTrustedTokens",
      ethereum.Value.fromAddressArray(newTrustedTokens)
    )
  )

  return updatedTrustedTokensEvent
}
