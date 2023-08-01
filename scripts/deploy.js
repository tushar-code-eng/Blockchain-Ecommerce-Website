// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()

  const Dappazon = await hre.ethers.getContractFactory("Dappazon")
  const dappazon = await Dappazon.deploy()
  await dappazon.deployed()

  console.log(`Deployed Contract at: ${dappazon.address}\n`)
  
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  // console.log(data.length)
  // console.log( Math.ceil(data[0].rating.rate))
  for(let i=0; i< data.length;i++){
    var prices = new Array();
    prices[i] =data[i].price.toString()
    const transaction = await dappazon.connect(deployer).list(
      data[i].id,
      data[i].title,
      data[i].category,
      data[i].description,
      data[i].image,
      tokens(prices[i]),
      Math.ceil(data[i].rating.rate),
      data[i].rating.count
    )

    await transaction.wait()

    console.log(`listed items ${data[i].id} : ${data[i].title}`)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
