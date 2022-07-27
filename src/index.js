import React  from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { MoralisProvider } from "react-moralis";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MoralisProvider appId="Jp4M6lDssIQedwgnriGStK7GGiuNVvlDcNTcK7XP" serverUrl="https://przkhf4o2l5j.usemoralis.com:2053/server">
    <App />
  </MoralisProvider>
);

window.soccerContractAddress = '0x0a547Ad7E20b1CE93344C33D6b9bc0d92D82c675';
window.soccerContractAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_eventId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_bucketIdx",
        "type": "uint16"
      }
    ],
    "name": "payout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_voteSize",
        "type": "uint256"
      }
    ],
    "name": "setupEvent",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_eventId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_bucketIdx",
        "type": "uint16"
      }
    ],
    "name": "submitVote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_commissionAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_eventId",
        "type": "uint16"
      }
    ],
    "name": "getEventData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteSize",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "addresses",
            "type": "address[]"
          },
          {
            "internalType": "uint16[]",
            "name": "buckets",
            "type": "uint16[]"
          },
          {
            "internalType": "uint256",
            "name": "pot",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "payoutAddresses",
            "type": "address[]"
          }
        ],
        "internalType": "struct SoccerEventManager.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEventsCount",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
