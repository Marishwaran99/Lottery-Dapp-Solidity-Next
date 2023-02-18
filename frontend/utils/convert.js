import { BigNumber, ethers } from "ethers";

export const convertToEth = (n) => ethers.utils.formatEther(BigNumber.from(n));
export const mulBig = (n) => ethers.utils.formatEther(n);
