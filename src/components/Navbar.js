import React from 'react'
import { ethers } from 'ethers';


const Navbar = ({account,setAccount}) => {

        const connectHandler = async ()=>{
            const accounts =await window.ethereum.request({method: 'eth_requestAccounts'});
            const account = await ethers.utils.getAddress(accounts[0]);
            setAccount(account)
            
        }

        setInterval(()=>{
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload()
              })      
        },10000)
        

        

    return (
        <nav>
            <div className='nav__brand'>
              <a href="/" style={{textDecoration:"none"}} ><h1>Amazon2.0</h1></a>  
            </div>

            <input
                type="text"
                className="nav__search"
               
            />
            

            {account ? (
                <button
                className='nav__connect'
                type='button' >
                    {account.slice(0,6) + "..." + account.slice(36,42)}
            </button>
            ) : (
                <button
                className='nav__connect'
                type='button'
                onClick={connectHandler}>
                Connect
                </button>
            )
        }

            <ul className='nav__links'>
                <li><a href="/electronics">Electronics</a></li>
                <li><a href="/jewelery"> Jewelery</a></li>
                <li><a href="/men">Men's Fashion</a></li>
                <li><a href="/women">Women's Fashion</a></li>
            </ul>
        </nav>
    )
}

export default Navbar;