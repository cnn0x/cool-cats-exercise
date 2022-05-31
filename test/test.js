const { expect } = require("chai");

describe("contracts", () => {
  let user1;
  let user2;
  let milkContract;
  let itemFactoryContract;
  let amount =
    "0x0000000000000000000000000000000000000000000000056bc75e2d63100000"; //100 * 10 ** 18 in bytes
  let amountInStr = "100000000000000000000"; //100 * 10 ** 18 in string

  beforeEach(async function () {
    const Milk = await ethers.getContractFactory("Milk");
    milkContract = await Milk.deploy(
      "Milk Token",
      "MILK",
      "0x0000000000000000000000000000000000000000"
    );

    const ItemFactory = await ethers.getContractFactory("ItemFactory");
    itemFactoryContract = await ItemFactory.deploy(
      "some uri here",
      milkContract.address
    );

    [user1, user2] = await ethers.getSigners();
  });

  describe("Milk Roles", () => {
    it("should succesfuly grant CONTRACT_ROLE role", async () => {
      await milkContract.grantRoleByIndex(true, user1.address); //false means we point to CONTRACT_ROLE

      expect(
        await milkContract.hasRole(milkContract.CONTRACT_ROLE(), user1.address)
      ).to.equal(true);
    });

    it("should succesfuly grant MASTER_ROLE role", async () => {
      await milkContract.grantRoleByIndex(false, user1.address); //false means we point to MASTER_ROLE

      expect(
        await milkContract.hasRole(milkContract.MASTER_ROLE(), user1.address)
      ).to.equal(true);
    });
  });

  describe("Milk Functions", () => {
    it("should deposit", async () => {
      await milkContract.deposit(user1.address, amount);

      expect(await milkContract.balanceOf(user1.address)).to.equal(amountInStr);
    });

    it("should withdraw", async () => {
      await milkContract.deposit(user1.address, amount); //mint some tokens first

      await milkContract.withdraw(amountInStr);

      expect(await milkContract.balanceOf(user1.address)).to.equal("0"); //balance should reduce to 0 after withdraw
    });

    it("should gameWithdraw", async () => {
      await milkContract.grantRoleByIndex(true, user1.address); //give CONTRACT_ROLE first

      await milkContract.deposit(user1.address, amount); //mint some tokens

      await milkContract.gameWithdraw(user1.address, amountInStr);

      expect(await milkContract.balanceOf(user1.address)).to.equal("0"); //balance should reduce to 0 after withdraw
    });

    it("should gameTransferFrom", async () => {
      await milkContract.grantRoleByIndex(true, user1.address); //give CONTRACT_ROLE first

      await milkContract.deposit(user1.address, amount); //mint some tokens

      await milkContract.gameTransferFrom(
        user1.address,
        user2.address,
        amountInStr
      );

      expect(await milkContract.balanceOf(user1.address)).to.equal("0");
      expect(await milkContract.balanceOf(user2.address)).to.equal(amountInStr);
    });

    it("should gameBurn", async () => {
      await milkContract.grantRoleByIndex(true, user1.address); //give CONTRACT_ROLE first

      await milkContract.deposit(user1.address, amount); //mint some tokens

      await milkContract.gameBurn(user1.address, amountInStr);

      expect(await milkContract.balanceOf(milkContract.address)).to.equal("0");
    });

    it("should gameMint", async () => {
      await milkContract.grantRoleByIndex(true, user1.address); //give CONTRACT_ROLE first

      await milkContract.gameMint(user2.address, amountInStr);

      expect(await milkContract.balanceOf(user2.address)).to.equal(amountInStr);
    });

    it("should mint", async () => {
      await milkContract.grantRoleByIndex(false, user1.address); //give MASTER_ROLE first

      await milkContract.mint(user2.address, amountInStr);

      expect(await milkContract.balanceOf(user2.address)).to.equal(amountInStr);
    });
  });
});
