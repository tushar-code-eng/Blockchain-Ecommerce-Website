import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, dappazon, togglePop }) => {

  const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)

  const fetchDetails = async () => {
    const events = await dappazon.queryFilter("Buy")
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    )

    if (orders.length === 0) return

    const order = await dappazon.orders(account, orders[0].args.orderId)
    setOrder(order)
  }


  const buyHandler = async () => {
    const signer = await provider.getSigner()
    let transaction = await dappazon.connect(signer).buy(item.id, { value: item.cost })
    await transaction.wait()

    setHasBought(true)
  }

  useEffect(() => {
    fetchDetails()
  }, [hasBought])

  return (
    <div className="">
      <div className="product__details">
        <div className="product__image">
          <img style={{height:"50vh"}} src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1 style={{fontSize:"1.5vw"}} >{item.title}</h1>

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>Overview</h2>

          <p style={{fontSize:"0.75vw"}}>
            {item.description}
          </p>
        </div>
        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </strong>
          </p>

          {item.stock > 0 ? (
            <p>In Stock.</p>
          ) : (
            <p>Out of Stock.</p>
          )}
          {account ? (
            <button className='product__buy' onClick={buyHandler} >
              Buy Now
            </button>

          ) : <button className='product__buy' >
            Wallet not connected
          </button>}

          <button onClick={togglePop} className="product__close">
            <img src={close} alt="Close" />
          </button>

          <p><small>Ships from</small> Amazon2.0</p>
          <p><small>Sold by</small> Amazon2.0</p>

          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;