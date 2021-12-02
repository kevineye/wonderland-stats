import { Contract } from "@ethersproject/contracts";
import { Signer } from "@ethersproject/abstract-signer";
import * as providers from "@ethersproject/providers";
import { LpReserveContract } from "../abi";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(_networkID: Networks, provider: Signer | providers.Provider): Promise<number> {
    const mimTimeAddress = '0x113f413371fc4cc4c9d6416cf1de9dfd7bf747df';
    const pairContract = new Contract(mimTimeAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
