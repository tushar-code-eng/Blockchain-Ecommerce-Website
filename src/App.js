import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'

// Components

import Navbar from './components/Navbar'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'


const App = () => {

  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [account, setAccount] = useState(null)

  const [everything, setEverything] = useState(null)
  const [electronics, setElectronics] = useState(null)
  const [jewelery, setJewelery] = useState(null)
  const [men, setMen] = useState(null)
  const [women, setWomen] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const [progress, setProgress] = useState(0) // This is for loading Bar

 

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const LoadBlockchain = async () => {
    setProgress(30)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProgress(80)
    setProvider(provider)
    setProgress(100)

    const network = await provider.getNetwork()

    //Conect to smart Contract -- Creating JS versions
    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
    setDappazon(dappazon)

    const items = [];

    for (let i = 0; i < 20; i++) {
      const item = await dappazon.items(i + 1)
      items.push(item)
    }

    const everything = items
    const electronics = items.filter((item) => item.category === "electronics")
    const jewelery = items.filter((item) => item.category === "jewelery")
    const men = items.filter((item) => item.category === "men's clothing")
    const women = items.filter((item) => item.category === "women's clothing")
    console.log(men)

    setEverything(everything)
    setElectronics(electronics)
    setJewelery(jewelery)
    setMen(men)
    setWomen(women)
    
    
  }

  useEffect(() => {
    LoadBlockchain()
  }, [])



  return (
    <BrowserRouter>
      <div>
        <Navbar account={account} setAccount={setAccount} />

        {electronics && jewelery && men && women && (

          <Routes>
            <Route exact path="/" element={<Section Title={"All Products"} items={everything} togglePop={togglePop} />} />
            <Route exact path="/electronics" element={<Section Title={"Electronics"} items={electronics} togglePop={togglePop} />} />
            <Route exact path="/jewelery" element={<Section Title={"Jewelery"} items={jewelery} togglePop={togglePop} />} />
            <Route exact path="/men" element={<Section Title={"Men's Fashion"} items={men} togglePop={togglePop} />} />
            <Route exact path="/women" element={<Section Title={"Women's Fashion"} items={women} togglePop={togglePop} />} />
          </Routes>

        )}
        <LoadingBar
          color='red'
          height={3}
          progress={progress} />


        {toggle && (
          <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
        )}

      </div>
    </BrowserRouter>

  );
}

export default App;
