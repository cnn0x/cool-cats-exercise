async function main() {
  const ItemFactory = await ethers.getContractFactory("ItemFactory");
  const itemFactory = await ItemFactory.deploy(
    "ipfs://some-CID-here",
    "0x0000000000000000000000000000000000000000" //bypass the constructor
  );
  await itemFactory.deployed();
  console.log("itemFactory deployed to:", itemFactory.address);

  const Milk = await ethers.getContractFactory("Milk");
  const milk = await Milk.deploy(
    "Milk Token",
    "MILK",
    "0x0000000000000000000000000000000000000000" //bypass the constructor
  );
  await milk.deployed();
  console.log("milk token deployed to:", milk.address);
}

main();
