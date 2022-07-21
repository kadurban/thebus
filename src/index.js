import React  from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MoralisProvider appId="Jp4M6lDssIQedwgnriGStK7GGiuNVvlDcNTcK7XP" serverUrl="https://przkhf4o2l5j.usemoralis.com:2053/server">
      <App />
    </MoralisProvider>
  </React.StrictMode>
);

window.soccerContractAddress = '0x4df5aB3376fdBA0861dabc251Dd1ac4A5B900e2A';
window.soccerContractAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_voteSize",
        "type": "uint8"
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
        "internalType": "uint8",
        "name": "_bucketIdx",
        "type": "uint8"
      }
    ],
    "name": "submitVote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_eventIdx",
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
            "internalType": "uint8",
            "name": "voteSize",
            "type": "uint8"
          },
          {
            "internalType": "address[]",
            "name": "addresses",
            "type": "address[]"
          },
          {
            "internalType": "uint8[]",
            "name": "buckets",
            "type": "uint8[]"
          }
        ],
        "internalType": "struct SoccerEventManagerWith8bitBuckets.Event",
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
