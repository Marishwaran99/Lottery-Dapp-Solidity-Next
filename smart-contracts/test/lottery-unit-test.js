const { expect, assert } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("Lottery", () => {
  let lottery, account, account1;
  let ticketPrice = ethers.utils.parseEther("0.025");
  beforeEach(async () => {
    account = (await ethers.getSigners())[0];
    account1 = (await ethers.getSigners())[1];
    await deployments.fixture();
    lottery = await ethers.getContract("Lottery");
  });

  describe("Initial States", () => {
    it("Check lottery operator, ticket price and no of tickets.", async () => {
      assert.equal(await lottery.getLotteryOperator(), account.address);
      assert.equal(
        ethers.BigNumber.from(
          (await lottery.getTicketPrice()).toString()
        ).toString(),
        ticketPrice.toString()
      );
      assert((await lottery.remainingTickets()).toString() == "100");
      assert.equal((await lottery.getCommissionsEarned()).toString(), "0");
    });

    it("Withdraw commission, draw winner fails if no commission available", async () => {
      await expect(lottery.withdrawCommission()).to.be.revertedWith(
        "No commission available"
      );
      await expect(lottery.drawWinner()).to.be.revertedWith(
        "No tickets purchased"
      );
      await expect(
        lottery.enterDraw({ value: ethers.utils.parseEther("1.1") })
      ).to.be.revertedWith("Lottery expired");
      let tx = await lottery.startDraw();
      await tx.wait();

      await expect(
        lottery.enterDraw({ value: ethers.utils.parseEther("0.045") })
      ).to.be.revertedWith("Invalid number of tickets");
      await expect(lottery.enterDraw()).to.be.revertedWith(
        "Not enough ticket price"
      );
    });
  });

  describe("Start Draw", () => {
    beforeEach(async () => {
      let tx = await lottery.startDraw();
      await tx.wait();

      let tx1 = await lottery.enterDraw({ value: ticketPrice });
      await tx1.wait();
    });

    it("Expiration increased & Cannot restart draw if tickets has been purchased", async () => {
      console.log((await lottery.getExpiration()).toNumber());
      assert(
        new Date().getTime() / 1000 < (await lottery.getExpiration()).toNumber()
      );
      await expect(lottery.startDraw()).to.be.revertedWith("Draw is active");
    });
    it("Cannot start draw if not lottey operator", async () => {
      let lottery1 = lottery.connect(account1);
      await expect(lottery1.startDraw()).to.be.revertedWith(
        "You are not a lottery operator"
      );
    });
  });

  describe("Draw winner", () => {
    beforeEach(async () => {
      let tx = await lottery.startDraw();
      await tx.wait();
    });

    it("Fails if No tickets purchased or draw still active", async () => {
      await expect(lottery.drawWinner()).to.be.revertedWith(
        "No tickets purchased"
      );
      // await expect(lottery.drawWinner()).to.be.revertedWith(
      //   "Draw is still active"
      // );
    });

    it("Draw winner after draw expires ", async () => {
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await lottery.enterDraw({ value: ticketPrice });
      await tx.wait();
      let lottery1 = await lottery.connect(account1);
      let tx1 = await lottery1.enterDraw({ value: ticketPrice });
      await tx1.wait();
      await network.provider.send("evm_increaseTime", [
        (await lottery.getExpiration()).toNumber() + 1,
      ]);
      let tx2 = await lottery.drawWinner();
      await tx2.wait();

      assert.equal(
        (await lottery.getCommissionsEarned()).toString(),
        ethers.utils.parseEther("0.01").toString()
      );
      console.log((await lottery.getWinnerAmount(account.address)).toString());
      assert((await lottery.getWinnerAmount(account.address)).toString());
    });
  });

  // describe("increase timestamp", () => {
  //   beforeEach(async () => {
  //     await lottery.buyTickets(5, {
  //       value: (await lottery.getTicketPrice())
  //         .mul(5)
  //         .add(await lottery.getServiceFee()),
  //     });
  //   });
  //   it("cannot buy tickets after time expires", async () => {
  //     await network.provider.send("evm_increaseTime", [
  //       expiration.toNumber() + 1800,
  //     ]);
  //     await network.provider.request({ method: "evm_mine", params: [] });
  //     await expect(lottery.buyTickets(1)).to.be.revertedWith("Draw expired");
  //   });
  //   it("can refund after time expires", async () => {
  //     await network.provider.send("evm_increaseTime", [
  //       expiration.toNumber() - 100,
  //     ]);
  //     await network.provider.request({ method: "evm_mine", params: [] });
  //     await lottery.refundAll();
  //     await lottery.restartDraw();

  //     console.log(
  //       new Date().getTime(),
  //       (await lottery.getExpiration()).toNumber()
  //     );
  //   });
  //   it("can refund after time expires", async () => {
  //     await network.provider.send("evm_increaseTime", [
  //       expiration.toNumber() + 1800,
  //     ]);
  //     await network.provider.request({ method: "evm_mine", params: [] });
  //     console.log(await lottery.getBalance());
  //     // await lottery.withdrawCommission();
  //     // console.log(await lottery.getBalance());
  //     let tx = await lottery.refundAll();
  //     let txReceipt = await tx.wait(1);
  //     const { effectiveGasPrice, gasUsed } = txReceipt;
  //     const gasCost = effectiveGasPrice.mul(gasUsed);
  //     console.log(
  //       await lottery.getBalance(),
  //       await lottery.getTotalCommision(),
  //       gasCost
  //     );
  //     assert((await lottery.getTickets()).length == 0);
  //     // assert(
  //     //   (await lottery.getBalance()).mul(gasCost).toString() ==
  //     //     (await lottery.getTotalCommision()).toString()
  //     // );
  //   });
  //   it("cannot refund if not expired", async () => {
  //     await expect(lottery.refundAll()).to.be.revertedWith(
  //       "Lottery not expired yet."
  //     );
  //   });
  // });
  // describe("Buy Tickets", () => {
  //   it("Buy tickets fails if ticket not available", async () => {});

  //   describe("test after buying tickets ", () => {
  //     beforeEach(async () => {
  //       await lottery.buyTickets(5, {
  //         value: (await lottery.TICKET_PRICE()).mul(5),
  //       });
  //     });

  //     it("Cannot restart if lottery has ticket holders", async () => {
  //       await expect(lottery.restartDraw()).to.be.revertedWith(
  //         "Refund All to restart draw."
  //       );
  //     });
  //     it("Check total lottery counts is equal to ticket purchased(5)", async () => {
  //       assert.equal((await lottery.getTickets()).length, 5);
  //     });
  //     it("Check total commission earned is equal to (5 * 0.005)", async () => {
  //       assert.equal(
  //         await lottery.getTotalCommision(),
  //         5 * (await lottery.getServiceFee())
  //       );
  //     });
  //     it("Draw winner and check equal to account", async () => {
  //       await lottery.drawWinner();
  //       const [winner, amount] = await lottery.getRecentWinner();
  //       console.log(winner);
  //       assert(winner == account.address);

  //       assert(
  //         amount ==
  //           (await lottery.getTickets()).length *
  //             (await lottery.getTicketPrice())
  //       );
  //       assert(
  //         (await lottery.getWinnerAmount(account.address)).toString() == amount
  //       );
  //     });
  //     describe("Draw winner", () => {
  //       beforeEach(async () => {
  //         await lottery.drawWinner();
  //       });

  //       it("Withdraw fails if someone else calls withdrawwinner", async () => {
  //         let accounts = await ethers.getSigners();
  //         let lotter1 = lottery.connect(accounts[2]);
  //         await expect(lotter1.withdrawWinnerBalance()).to.be.revertedWith(
  //           "Caller is not a winner"
  //         );
  //       });
  //       it("Withdraw commission success", async () => {
  //         let tx = await lottery.withdrawCommission();
  //         assert((await lottery.getTotalCommision()).toString() == "0");
  //       });
  //       it("Withdraw success if sender equals to winner", async () => {
  //         await lottery.withdrawWinnerBalance();
  //         assert(
  //           (await lottery.getWinnerAmount(account.address)).toString() == "0"
  //         );
  //       });
  //     });
  //   });
  // });

  // describe("Non operator functions", () => {
  //   let lottery1;
  //   beforeEach(async () => {
  //     let account1 = (await ethers.getSigners())[1];

  //     lottery1 = await lottery.connect(account1);
  //   });

  //   it("Draw winner fails if not operator", async () => {
  //     await expect(lottery1.drawWinner()).to.be.revertedWith(
  //       "You are not a lottery operator"
  //     );
  //     await expect(lottery1.restartDraw()).to.be.revertedWith(
  //       "You are not a lottery operator"
  //     );
  //     await expect(lottery1.withdrawCommission()).to.be.revertedWith(
  //       "You are not a lottery operator"
  //     );
  //     await expect(lottery1.refundAll()).to.be.revertedWith(
  //       "You are not a lottery operator"
  //     );
  //   });
  // });
});
