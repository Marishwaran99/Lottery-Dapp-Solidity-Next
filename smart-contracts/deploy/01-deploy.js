module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const { deploy, log } = deployments;
  const lottery = await deploy("Lottery", {
    args: [],
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });

  log("Lottery deployed at ", lottery.address);
};
