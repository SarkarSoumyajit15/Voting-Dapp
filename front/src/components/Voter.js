import { React, useState } from "react";
import { useRef } from "react";
// import "./Contract.css";
import contractobj from "./Voting.json";
import "./error_message.css";
import "./Voter.css";
import infuraApiKey from "./env";

const { ethers } = require("ethers");
const { ethereum } = window;

function Voter() {
  const [choice, setChoice] = useState("Party Sarkar");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const ob = contractobj.abi;
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

  const displayParties = async () => {
    try {
      setShow(!show);
      if (show) {
        return;
      }

      const parties = await contractInstance1.getParties();
      setItems(parties);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = async (event) => {
    setError(null);
    setChoice(event.target.value);
    console.log("Inside Handle Change "+choice);
  };


  const CastVote = async(event)=>{
      try {
        event.preventDefault();
        console.log("Inside cast vote "+choice);
        const tx = await contractInstance2.castVote(choice);
        await tx.wait();
        console.log(tx);
        
    } catch (err) {
        console.log(err);
        setError(err.message);
    }
  }

  return (
    <>
    <div>
        <header> Voter's Window </header>
    </div>
      <div>
        <a className="Class1" onClick={displayParties}>
          {!show ? "Show Party List" : "Hide Party List"}
        </a>
      </div>
      <div>
        {show && (
          <form onSubmit={CastVote}>
            <select value={choice} onChange={handleChange}>
              {items.map((item, index) => (
                <option value={item}>{item}</option>
              ))}
            </select>
            <button type="submit">Confirm</button>
          </form>
        )}
      </div>
      <div>
        <a className="error-message">{error}</a>
      </div>
    </>
  );
}

export default Voter;
