import React from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { infuraProvider } from "ethers";
import "./Home.css";
import "./error_message.css";


const { ethers } = require("ethers");

const Home = () => {
  const { ethereum } = window;
  const [connect, setConnect] = useState("Connect");
  const [address, setAddress] = useState(null);
  const [Next, setNext] = useState(null);
  const [to, setTo] = useState(null);
  const [error, setError] = useState(null);
  const [changeAccount, change] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const admin = "0x2D09866ac8564F0BA200f4E331b3dDA541eD7a2D";

  const setConnection = async () => {
    await ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(async (arg) => {
        console.log(arg);
        const acc = await ethereum.request({ method: "eth_requestAccounts" });
        setAddress(acc[0]);
        setConnect("Connected");
        change("Change Account");

        if (acc[0] == admin.toLowerCase()) {
          setNext("Admin Window");
          setTo("/admin");
        } else {
          setNext("Voter Window");
          setTo("/voter");
        }
      })
      .catch(async (err) => {
        setError(err.message);
      });
  };


  return (
    <div className="innerdiv">
      <h2>Home Page</h2>
      <p>Welcome to the Home page!</p>
      <br></br>
      <button className="Class-A" onClick={setConnection}>
        {connect}
      </button>
      <br></br>
      <a className="Class-B" onClick={setConnection}>
        {changeAccount}
      </a>
      <br></br>
      <a className="Class-A">{address}</a>
      <br></br>
      <br></br>
      <br></br>
      <nav>
        <ul className="nav__item">
          <NavLink to={to} className="nav__link">
            {Next}
          </NavLink>
        </ul>
      </nav>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <a className="error-message">{error}</a>
    </div>
  );
};
export default Home;
