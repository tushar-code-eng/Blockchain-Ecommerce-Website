const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ID = 1
const TITLE = "Shoes"
const CATEGORY = "Clothings"
const DESCRIPTION = ""
const IMAGE = ""
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Dappazon",()=>{
  let dappazon
  let deployer,buyer

  beforeEach(async ()=>{
    [deployer,buyer] = await ethers.getSigners() //getSigners will give 20 fake acc so that we can do testing and in this line we are assigning address to deployer and buyer
    //console.log(deployer.address,buyer.address)
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
  })
  
  describe("Deployment", () => {
    it('sets the owner', async ()=>{
      const owner = await dappazon.owner()
      expect(owner).to.equal(deployer.address)
    })
  })
  describe("Listing", () => {
   let transaction

    beforeEach(async () =>{
      transaction = await dappazon.connect(deployer).list(
        ID,
        TITLE,
        CATEGORY,
        DESCRIPTION,
        IMAGE,
        COST,
        RATING,
        STOCK
      )

      await transaction.wait();
    }) 

    it('Returns item attributes', async ()=>{
      const item = await dappazon.items(1)
      expect(item.id).to.equal(ID)
      expect(item.title).to.equal(TITLE)
      expect(item.category).to.equal(CATEGORY)
      expect(item.description).to.equal(DESCRIPTION)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })

    it('Emits List event', async ()=>{
      expect (transaction).to.emit(dappazon,"List")////////////////
    })
  })

  describe("Buying", () => {
    let transaction
 
     beforeEach(async () =>{
       transaction = await dappazon.connect(deployer).list(
         ID,
         TITLE,
         CATEGORY,
         DESCRIPTION,
         IMAGE,
         COST,
         RATING,
         STOCK
       )
 
       await transaction.wait();

       transaction = await dappazon.connect(buyer).buy(ID,{value:COST})
     }) 
    
     it("update buyer's order count", async () =>{
       const result = await dappazon.orderCount(buyer.address)
       expect(result).to.equal(1)
      })
      it("Adds the order", async () =>{
        const order = await dappazon.orders(buyer.address,1)
        expect(order.time).to.be.greaterThan(0)
        expect(order.item.title).to.equal(TITLE)
      })
      it("updates the contract balance", async () =>{
       const result = await dappazon.provider.getBalance(dappazon.address)
       expect(result).to.equal(COST)
      })
      it("emits buy event", ()=>{
        expect(transaction).to.emit(dappazon,"Buy")///////////////
      })

  })

  describe("Withdrawing", () => {
    let beforeBalnce
 
     beforeEach(async () =>{
       transaction = await dappazon.connect(deployer).list(
         ID,
         TITLE,
         CATEGORY,
         DESCRIPTION,
         IMAGE,
         COST,
         RATING,
         STOCK
       )
      await transaction.wait();

      transaction = await dappazon.connect(buyer).buy(ID,{value:COST})
      beforeBalnce = await ethers.provider.getBalance(deployer.address)

      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
     }) 

    it("update's the owner balance", async () =>{
      const afterBalance = await ethers.provider.getBalance(deployer.address)
      expect(afterBalance).to.be.greaterThan(beforeBalnce)
    })
    it("update's the contract balance", async () =>{
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(0)
    })

  })

  
})