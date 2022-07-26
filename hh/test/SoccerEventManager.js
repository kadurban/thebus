const { expect } = require("chai");
// const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");

let soccerEventManagerContract;
let adminAccount;
let adminAddress;
let commissionWalletAccount;
let commissionWalletAddress;
let users;

describe('TheBus SoccerEventManager testing...', function () {

  it('Prepare users', async function() {
    const signers = await ethers.getSigners();
    const admin = signers.slice(0, 1);
    const commissionWallet = signers.slice(1, 2);
    users = signers.slice(2, 9);
    adminAccount = admin[0];
    adminAddress = adminAccount.address;
    commissionWalletAccount = commissionWallet[0];
    commissionWalletAddress = commissionWalletAccount.address;
    expect(admin.length).to.equal(1);
    expect(commissionWallet.length).to.equal(1);
    expect(users.length).to.equal(7);
  });

  it('Deploys SoccerEventManager contract', async function () {
    const SoccerEventManager = await ethers.getContractFactory('SoccerEventManager');
    soccerEventManagerContract = await SoccerEventManager.deploy(commissionWalletAddress);
  });

  // it('Checks that getEventsCount() returns 0 after deployment', async function() {
  //   const count = await soccerEventManagerContract.getEventsCount();
  //   expect(count).to.equal(0);
  // });

  it ('Creates first event and checks that getEventsCount() equals to 1', async function() {
    await soccerEventManagerContract.setupEvent('first event test title', ethers.utils.parseEther("10"));
    const count = await soccerEventManagerContract.getEventsCount();
    expect(count).to.equal(1);
  })

  it ('Call getEventData(1) and checks the title, voteSize and pot', async function() {
    const eventData = await soccerEventManagerContract.getEventData(1);
    expect(eventData.title).to.equal('first event test title');
    expect(eventData.voteSize).to.equal(ethers.utils.parseEther("10"));
    expect(eventData.pot).to.equal(0);
  })

  it('Placing a votes by users and checking that pot increased properly', async function() {
    await soccerEventManagerContract.connect(users[0]).submitVote(1, 1, {
      value: ethers.utils.parseEther("10")
    });
    await soccerEventManagerContract.connect(users[1]).submitVote(1, 0, {
      value: ethers.utils.parseEther("10")
    });
    await soccerEventManagerContract.connect(users[2]).submitVote(1, 0, {
      value: ethers.utils.parseEther("10")
    });
    await soccerEventManagerContract.connect(users[3]).submitVote(1, 4, {
      value: ethers.utils.parseEther("10")
    });
    await soccerEventManagerContract.connect(users[4]).submitVote(1, 5, {
      value: ethers.utils.parseEther("10")
    });
    await soccerEventManagerContract.connect(users[0]).submitVote(1, 4, {
      value: ethers.utils.parseEther("10")
    });
    const eventData = await soccerEventManagerContract.getEventData(1);
    expect(eventData.pot).to.equal(ethers.utils.parseEther("60"));
  });

  it('Checks that it is not possible to send wrong voteSize', async function() {
    await expect(
      soccerEventManagerContract.connect(users[1]).submitVote(1, 4, {
        value: ethers.utils.parseEther("4")
      })
    ).to.be.revertedWith("Wrong voteSize");
    await expect(
      soccerEventManagerContract.connect(users[1]).submitVote(1, 4, {
        value: ethers.utils.parseEther("2")
      })
    ).to.be.revertedWith("Wrong voteSize");
  });

  it('Checks that contract balance was increased to 60', async function() {
    const contractBalance = await ethers.provider.getBalance(soccerEventManagerContract.address);
    expect(ethers.utils.formatEther(contractBalance.toString())).to.equal('60.0');
  });

  it('Makes payout by invoking payout() method', async function() {
    await soccerEventManagerContract.connect(adminAccount).payout(1, 4);
  });

  it('Print users balances', async function() {
    await printBalances();
  });
})

async function printBalances() {
  console.log('=== Balances ===');
  const adminBalance = await ethers.provider.getBalance(adminAddress);
  console.log('Admin balance:', ethers.utils.formatEther(adminBalance.toString()));
  const commissionWalletBalance = await ethers.provider.getBalance(commissionWalletAddress);
  console.log('Commission wallet balance:', ethers.utils.formatEther(commissionWalletBalance.toString()));
  const contractBalance = await ethers.provider.getBalance(soccerEventManagerContract.address);
  console.log('Contract balance:', ethers.utils.formatEther(contractBalance.toString()));

  let userBalance;
  userBalance = await ethers.provider.getBalance(users[0].address);
  console.log(`users[0] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[1].address);
  console.log(`users[1] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[2].address);
  console.log(`users[2] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[3].address);
  console.log(`users[3] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[4].address);
  console.log(`users[4] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[5].address);
  console.log(`users[5] balance:`, ethers.utils.formatEther(userBalance.toString()));
  userBalance = await ethers.provider.getBalance(users[6].address);
  console.log(`users[6] balance:`, ethers.utils.formatEther(userBalance.toString()));
}