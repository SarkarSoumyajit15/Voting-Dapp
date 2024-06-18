import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import "./Contract.css";
import contractobj from "./Voting.json";
import "./error_message.css";
import "./Admin.css";
import infuraApiKey from "./env";


import { getBigInt } from "ethers";
import { toNumber } from "ethers";
const { ethers } = require("ethers");
const { ethereum } = window;

function Admin() {
  const ob = contractobj.abi;
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);

  const [items, setItems] = useState([]);
  const [showList1, setShowList1] = useState(false);
  const [showList2, setShowList2] = useState(false);
  const [error, setError] = useState(null);
  const [number, setNumber] = useState(0);
  const contractAddress = "0x588E44d449eAb2ED3E2c1c2e9CFe5633e20FFb07";
  const infuraProvider = new ethers.JsonRpcProvider(
    infuraApiKey
  );


  const walletProvider = new ethers.BrowserProvider(ethereum);


  let contractInstance2;

  const signerGet = async () => {
    contractInstance2 = new ethers.Contract(
      contractAddress,
      ob,
      await walletProvider.getSigner()
    );
  };

  signerGet();

  const contractInstance1 = new ethers.Contract(
    contractAddress,
    ob,
    infuraProvider
  );



  const handleSubmit1 = async (event) => {
    try {
      setError(null);
      event.preventDefault();
      console.log("Input value:", inputRef1.current.value);
      const tx = await contractInstance2.addParty(inputRef1.current.value);
      await tx.wait();
      setError(null);
    } catch (err) {
      setError("Error :   " + err.message);
    }

    // Perform further actions with the input value
  };

  const handleSubmit2 = async (event) => {
    try {
      setError(null);
      event.preventDefault();
      console.log("Input value:", inputRef2.current.value);
      const tx = await contractInstance2.addVoter(inputRef2.current.value);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      setError("Error ! :    " + err.message);
    }

    // Perform further actions with the input value
  };

  //fetching no of votes to a registered party
  const handleSubmit3 = async (event) => {
    try {
      setError(null);
      event.preventDefault();
      const party = await contractInstance1.getParty(inputRef3.current.value);
      console.log(typeof party[1]);
      const n = toNumber(party[1]);
      setNumber(n);
    } catch (err) {
      setError(err.message);
    }
  };

  //fetching parties registered
  let parties;
  const getParty = async () => {
    try {
      parties = await contractInstance1.getParties();
      console.log(parties);

      setItems(parties);
      setShowList1(!showList1);
    } catch (err) {
      setError("Error ! :  " + err.message);
    }
    // toggleList();
  };

  //fetching voters registered
  let voters;
  const getVoter = async () => {
    voters = await contractInstance1.getVoters();
    setItems(voters);
    setShowList2(!showList2);
    // toggleList();
  };

  // const toggleList = ()=>{
  //   setShowList(!showList);
  // }

  return (
    <>
      <header> Admin Window </header>
      <div>
        <form onSubmit={handleSubmit1}>
          <label>
            Enter New Party Name
            <input type="text" ref={inputRef1} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <br></br>
        <form onSubmit={handleSubmit2}>
          <label>
            Enter New Voter's Address
            <input type="text" ref={inputRef2} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
      <br></br>
      <div>
        <button onClick={getParty}>Get Registered Parties</button>
        {showList1 && (
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <br></br>
        {/* <button onClick={getVoter}>Get Registered Voters</button>
      {showList2 && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )} */}
      </div>
      <div className="div2">
        <div >
          <form className="form3" onSubmit={handleSubmit3}>
            <label>
              Get number of votes
              <input placeholder="Party Name" type="text" ref={inputRef3} />
            </label>
            <button type="submit">Fetch</button>
          </form>
        </div>
        <div className="box">
          <span className="number">{number}</span>
        </div>
      </div>
      <br></br>
      <div>
        <a className="error-message">{error}</a>
      </div>
    </>
  );
}

export default Admin;
