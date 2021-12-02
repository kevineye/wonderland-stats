#!/usr/bin/env node
import {loadTokenPrices, getTokenPrice} from "./helpers/token-price";

(async () => {
  await loadTokenPrices();
  const mimPrice = getTokenPrice("MIM");
  console.log("MIM: " + mimPrice);
})();
