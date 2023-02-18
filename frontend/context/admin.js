export const isAdmin = async (contract) => {
  let isLotteryOperator = await contract.checkLotterOperator();
  console.log("IsLotteryOperator=", isLotteryOperator);
  return isLotteryOperator;
};
export const returnComissionEarned = async (contract) => {
  let comissionEarned = await contract.getCommissionsEarned();
  return comissionEarned;
};
