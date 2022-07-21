const { expect, assert } = require("chai");
// const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");

let soccerEventManagerContract;
let contractDeployer;
let users;

describe('TheBus SoccerEventManager testing...', function () {

  it('Prepare users', async function() {
    const signers = await ethers.getSigners();
    contractDeployer = signers.slice(0, 1);
    users = signers.slice(1, 9);
    expect(contractDeployer.length).to.equal(1);
    expect(users.length).to.equal(8);
  });

  it('Deploys SoccerEventManager contract', async function () {
    const SoccerEventManager = await ethers.getContractFactory('SoccerEventManager');
    soccerEventManagerContract = await SoccerEventManager.deploy();
  });

  it('Checks that getEventsCount() returns 0 after deployment', async function() {
    const count = await soccerEventManagerContract.getEventsCount();
    expect(count).to.equal(0);
  });

  it ('Creates first event and checks that getEventsCount() equals to 1', async function() {
    await soccerEventManagerContract.setupEvent('first event test title', ethers.utils.parseEther("3"));
    const count = await soccerEventManagerContract.getEventsCount();
    expect(count).to.equal(1);
  })

  it ('Call getEventData(1) and checks the title, voteSize and pot', async function() {
    const eventData = await soccerEventManagerContract.getEventData(1);
    expect(eventData.title).to.equal('first event test title');
    expect(eventData.voteSize).to.equal(ethers.utils.parseEther("3"));
    expect(eventData.pot).to.equal(0);
  })

  it('Placing a votes by users and checking that pot increased properly', async function() {
    await soccerEventManagerContract.connect(users[1]).submitVote(1, 1, {
      value: ethers.utils.parseEther("3")
    });
    await soccerEventManagerContract.connect(users[2]).submitVote(1, 0, {
      value: ethers.utils.parseEther("3")
    });
    await soccerEventManagerContract.connect(users[3]).submitVote(1, 0, {
      value: ethers.utils.parseEther("3")
    });
    await soccerEventManagerContract.connect(users[4]).submitVote(1, 4, {
      value: ethers.utils.parseEther("3")
    });
    await soccerEventManagerContract.connect(users[5]).submitVote(1, 5, {
      value: ethers.utils.parseEther("3")
    });
    await soccerEventManagerContract.connect(users[1]).submitVote(1, 4, {
      value: ethers.utils.parseEther("3")
    });
    const eventData = await soccerEventManagerContract.getEventData(1);
    expect(eventData.pot).to.equal(ethers.utils.parseEther("18"));
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

  it('Checks that contract balance was increased to 18', async function() {
    const contractBalance = await ethers.provider.getBalance(soccerEventManagerContract.address);
    expect(ethers.utils.formatEther(contractBalance.toString())).to.equal('18.0');
  });

  it('Print users balances', async function() {
    printBalances(users);
  });

  // describe('', () => {
  //
  // });
})

function printBalances(users) {
  users.map(async (user, i) => {
    const userBalance = await ethers.provider.getBalance(user.address);
    console.log(`users[${i}] balance:`, ethers.utils.formatEther(userBalance.toString()));
  });
}