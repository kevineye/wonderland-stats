import { getTokenPrice, loadTokenPrices } from "./helpers/token-price";
import { getMarketPrice } from "./helpers/get-market-price";
import { getAddresses } from "./constants/addresses";
import { Networks } from "./constants/blockchain";
import { Contract } from "@ethersproject/contracts";
import { MemoTokenContract, StakingContract, TimeTokenContract } from "./abi";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";

export const getWonderlandStats = async (networkID = Networks.AVAX, provider = new StaticJsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")) => {
  await loadTokenPrices();
  const mimPrice = getTokenPrice("MIM");
  const addresses = getAddresses(networkID);
  const stakingContract = new Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
  const currentBlock = await provider.getBlockNumber();
  const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
  const memoContract = new Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
  const timeContract = new Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);

  const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * mimPrice;

  const totalSupply = (await timeContract.totalSupply()) / Math.pow(10, 9);
  const circSupply = (await memoContract.circulatingSupply()) / Math.pow(10, 9);

  const stakingTVL = circSupply * marketPrice;
  const marketCap = totalSupply * marketPrice;

  const epoch = await stakingContract.epoch();
  const stakingReward = epoch.distribute;
  const circ = await memoContract.circulatingSupply();
  const stakingRebase = stakingReward / circ;
  const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

  const currentIndex = await stakingContract.index();
  const nextRebase = epoch.endTime;

  return {
    currentIndex: Number(formatUnits(currentIndex, "gwei")) / 4.5,
    totalSupply,
    marketCap,
    currentBlock,
    circSupply,
    fiveDayRate,
    //treasuryBalance,
    stakingAPY,
    stakingTVL,
    stakingRebase,
    marketPrice,
    currentBlockTime,
    nextRebase,
    //rfv,
    //runway,
  };

};
