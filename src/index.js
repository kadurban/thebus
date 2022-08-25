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

window.eventManagerContractAddress = '0xed5e415b29daB129CD8A8bd2835b826a0d32fc8b';
window.eventManagerContractAbi = [
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "JackPotIncreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "JackPotSuccess",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "PayoutMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "VoteSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "commissionPercent",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "ensureAdminByAddress",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_eventId",
        "type": "uint32"
      }
    ],
    "name": "getEventData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "eventType",
            "type": "uint8"
          },
          {
            "internalType": "enum EventManager.EventStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imageUrl",
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
        "internalType": "struct EventManager.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getPromotedByAddress",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "jackPot",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "jackPotFrequency",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastEventId",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_eventId",
        "type": "uint32"
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
    "inputs": [],
    "name": "promoterPercent",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_percent",
        "type": "uint8"
      }
    ],
    "name": "setCommissionPercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_eventId",
        "type": "uint32"
      }
    ],
    "name": "setEventStatusToVotingDisabled",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_frequency",
        "type": "uint8"
      }
    ],
    "name": "setJackPotFrequency",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_percent",
        "type": "uint8"
      }
    ],
    "name": "setPromoterPercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_eventType",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_imageUrl",
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
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_eventId",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "_bucketIdx",
        "type": "uint16"
      },
      {
        "internalType": "address",
        "name": "_promoter",
        "type": "address"
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "userToPromoterMapping",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
