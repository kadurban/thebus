const { expect } = require("chai");
// const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");

let eventManagerContract;
let admin1;
let admin2;
let commissionWallet;
let players = {};
let promoters = { promoter1: null, promoter2: null };

describe('TheBus EventManager contract testing...', function () {

  describe('Initialization', async () => {
    it('Prepare users', async function() {
      const signers = await ethers.getSigners();
      admin1 = signers.shift();
      admin2 = signers.shift();
      commissionWallet = signers.shift();
      promoters.promoter1 = signers.shift();
      promoters.promoter2 = signers.shift();
      signers.forEach((signer, idx) => players[`player${idx + 1}`] = signer);
    });

    it('Deploys SoccerEventManager contract', async function () {
      const EventManager = await ethers.getContractFactory('EventManager');
      eventManagerContract = await EventManager.deploy(commissionWallet.address);
    });
  });

  describe('Security checks', async () => {
    it('Checks that admin can not be added by not admin', async () => {
      await expect(
        eventManagerContract.connect(players.player15).addAdmin(players.player1.address)
      ).to.be.revertedWith("Only admin can do it.");
    });

    it('Adding admin2 by admin1 and removing', async () => {
      const isAdmin2Exists = await eventManagerContract.ensureAdminByAddress(admin2.address);
      await eventManagerContract.addAdmin(admin2.address);
      const isAdmin2ExistsAfterAdd = await eventManagerContract.ensureAdminByAddress(admin2.address);
      await eventManagerContract.removeAdmin(admin2.address);
      const isAdmin2ExistsAfterRemove = await eventManagerContract.ensureAdminByAddress(admin2.address);
      expect(isAdmin2Exists).to.equal(false);
      expect(isAdmin2ExistsAfterAdd).to.equal(true);
      expect(isAdmin2ExistsAfterRemove).to.equal(false);
    });

    it('Changing promoterPercent and commissionPercent', async () => {
      const promoterPercent = await eventManagerContract.promoterPercent();
      await eventManagerContract.setPromoterPercent(10);
      const promoterPercentAfter = await eventManagerContract.promoterPercent();
      await eventManagerContract.setPromoterPercent(5);
      const promoterPercentAfterAfter = await eventManagerContract.promoterPercent();

      const commissionPercent = await eventManagerContract.commissionPercent();
      await eventManagerContract.setCommissionPercent(10);
      const commissionPercentAfter = await eventManagerContract.commissionPercent();
      await eventManagerContract.setCommissionPercent(5);
      const commissionPercentAfterAfter = await eventManagerContract.commissionPercent();

      expect(promoterPercentAfter).to.not.equal(promoterPercent);
      expect(promoterPercentAfterAfter).to.equal(promoterPercent);
      expect(commissionPercentAfter).to.not.equal(commissionPercent);
      expect(commissionPercentAfterAfter).to.equal(commissionPercent);
    });
  });

  describe('First event testing', async () => {
    it ('Creates first event and checks that getEventsCount() equals to 1', async function() {
      await eventManagerContract.setupEvent('first event test title', ethers.utils.parseEther("1000"));
      const count = await eventManagerContract.lastEventId();
      expect(count).to.equal(1);
    });

    it ('Call getEventData(1) and checks the title, voteSize and pot', async function() {
      const eventData = await eventManagerContract.getEventData(1);
      expect(eventData.title).to.equal('first event test title');
      expect(eventData.voteSize).to.equal(ethers.utils.parseEther("1000"));
      expect(eventData.pot).to.equal(0);
    });

    it('Checks that no one can change event status', async () => {
      await expect(
        eventManagerContract.connect(players.player1).setEventStatusToVotingDisabled(1)
      ).to.be.revertedWith("Only admin can do it.");
    });

    it('Checks that it is not possible to send wrong voteSize', async function() {
      await expect(playerVoteSubmit({
        player: players.player15,
        eventId: 1,
        bucketIndex: 7,
        promoterAddress: promoters.promoter1.address,
        value: '100'
      })).to.be.revertedWith("Wrong voteSize");
      await expect(playerVoteSubmit({
        player: players.player15,
        eventId: 1,
        bucketIndex: 8,
        promoterAddress: promoters.promoter1.address,
        value: '2000'
      })).to.be.revertedWith("Wrong voteSize");
    });

    it('Placing a votes by players and checking that pot increased properly', async function() {
      await playerVoteSubmit({
        player: players.player1,
        eventId: 1,
        bucketIndex: 0,
        promoterAddress: promoters.promoter1.address,
        value: '1000'
      });
      await playerVoteSubmit({
        player: players.player2,
        eventId: 1,
        bucketIndex: 3,
        promoterAddress: promoters.promoter1.address,
        value: '1000'
      });
      await playerVoteSubmit({
        player: players.player3,
        eventId: 1,
        bucketIndex: 0,
        promoterAddress: promoters.promoter2.address,
        value: '1000'
      });
      await playerVoteSubmit({
        player: players.player4,
        eventId: 1,
        bucketIndex: 1,
        promoterAddress: promoters.promoter2.address,
        value: '1000'
      });
      const eventData = await eventManagerContract.getEventData(1);
      expect(eventData.pot).to.equal(ethers.utils.parseEther("4000"));
    });

    it('Gets player1 promoter, votes again and check that pot increased but promoter still the same', async () => {
      const promoter1Address = promoters.promoter1.address;
      const player1PromoterAddressFromContract = await eventManagerContract.userToPromoterMapping(players.player1.address);
      await playerVoteSubmit({
        player: players.player1,
        eventId: 1,
        bucketIndex: 1,
        promoterAddress: promoters.promoter2.address,
        value: '1000'
      });
      const player1PromoterAddressFromContractAfterVote = await eventManagerContract.userToPromoterMapping(players.player1.address);
      const eventData = await eventManagerContract.getEventData(1);
      expect(player1PromoterAddressFromContract).to.equal(promoter1Address);
      expect(player1PromoterAddressFromContractAfterVote).to.equal(promoter1Address);
      expect(eventData.pot).to.equal(ethers.utils.parseEther("5000"));
    });

    it('Checks that no one can call setEventStatusToVotingDisabled()', async () => {
      await expect(
        eventManagerContract.connect(players.player15).setEventStatusToVotingDisabled(1)
      ).to.be.revertedWith("Only admin can do it.");
    });

    it('Admin sets up event status to VOTING_DISABLED by calling setEventStatusToVotingDisabled(1)', async () => {
      const eventData = await eventManagerContract.getEventData(1);
      await eventManagerContract.connect(admin1).setEventStatusToVotingDisabled(1);
      const eventDataAfter = await eventManagerContract.getEventData(1);
      expect(eventData.status).to.equal(0);
      expect(eventDataAfter.status).to.equal(1);
    });

    it ('Checks that it is not possible to place a vote when status of event is VOTING_DISABLED', async () => {
      await expect(
        playerVoteSubmit({
          player: players.player1,
          eventId: 1,
          bucketIndex: 0,
          promoterAddress: promoters.promoter2.address,
          value: '1000'
        })
      ).to.be.revertedWith("Voting is closed.");
      const eventData = await eventManagerContract.getEventData(1);
      expect(eventData.pot).to.equal(ethers.utils.parseEther("5000"));
    });

    it('Checks that payout() can not be invoked by not admin', async () => {
      await expect(
        eventManagerContract.connect(players.player15).payout(1, 0)
      ).to.be.revertedWith("Only admin can do it.");
    });

    it('Calling payout() and checking balances of players, promoters and commissionWallet are looking good', async () => {
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player1.address)))).to.equal(7999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player2.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player3.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player4.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(eventManagerContract.address)))).to.equal(5000);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(commissionWallet.address)))).to.equal(10000);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter1.address)))).to.equal(10000);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter2.address)))).to.equal(10000);

      await eventManagerContract.connect(admin1).payout(1, 3);

      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player1.address)))).to.equal(7999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player2.address)))).to.equal(13499);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player3.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player4.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(eventManagerContract.address)))).to.equal(0);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(commissionWallet.address)))).to.equal(10250);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter1.address)))).to.equal(10150);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter2.address)))).to.equal(10100);
    });

    it('Checks that payout can not be done 2 times for single event', async () => {
      await expect(
        eventManagerContract.connect(admin1).payout(1, 3)
      ).to.be.revertedWith("Payouts was made already.");
    });
  });

  describe('Testing jackpot', async () => {
    it('Checks that no one can change jackPotFrequency', async () => {
      await expect(
        eventManagerContract.connect(players.player1).setJackPotFrequency(10)
      ).to.be.revertedWith("Only admin can do it.");
    });

    it('Changing jackPotFrequency to 7', async () => {
      const frequency =  await eventManagerContract.jackPotFrequency();
      expect(frequency).to.equal(3);
      await eventManagerContract.setJackPotFrequency(7);
      const frequencyAfter =  await eventManagerContract.jackPotFrequency();
      expect(frequencyAfter).to.equal(7);
    });

    it('Creates 6 new events to test jackpot and checks that lastEventId equals 7', async () => {
      await eventManagerContract.setupEvent('1st jackpot event', ethers.utils.parseEther("1000"));
      await eventManagerContract.setupEvent('2nd jackpot event', ethers.utils.parseEther("1000"));
      await eventManagerContract.setupEvent('3rd jackpot event', ethers.utils.parseEther("1000"));
      await eventManagerContract.setupEvent('4th jackpot event', ethers.utils.parseEther("1000"));
      await eventManagerContract.setupEvent('5th jackpot event', ethers.utils.parseEther("1000"));
      await eventManagerContract.setupEvent('6th jackpot event (7th if count with very first one)', ethers.utils.parseEther("1000"));
      const count = await eventManagerContract.lastEventId();
      expect(count).to.equal(7);
    });

    it('Submits votes for created events', async () => {
      await playerVoteSubmit({
        player: players.player6, eventId: 2, bucketIndex: 1, promoterAddress: promoters.promoter2.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player7, eventId: 2, bucketIndex: 2, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player8, eventId: 3, bucketIndex: 3, promoterAddress: promoters.promoter2.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player9, eventId: 3, bucketIndex: 4, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player10, eventId: 4, bucketIndex: 5, promoterAddress: promoters.promoter2.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player11, eventId: 4, bucketIndex: 4, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player12, eventId: 5, bucketIndex: 2, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player13, eventId: 5, bucketIndex: 5, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player14, eventId: 6, bucketIndex: 4, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player15, eventId: 6, bucketIndex: 2, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player14, eventId: 7, bucketIndex: 2, promoterAddress: promoters.promoter1.address, value: '1000'
      });
      await playerVoteSubmit({
        player: players.player15, eventId: 7, bucketIndex: 1, promoterAddress: promoters.promoter1.address, value: '1000'
      });
    });

    it('Check balances after votes made', async () => {
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player6.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player7.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player8.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player9.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player10.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player11.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player12.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player13.address)))).to.equal(8999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player14.address)))).to.equal(7999);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player15.address)))).to.equal(7999);
    });

    it('Calling payout function for each of the event (except last one) and checks that jackPot increasing after each because no one wins', async () => {
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(0);
      await eventManagerContract.connect(admin1).payout(2, 9);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(1800);
      await eventManagerContract.connect(admin1).payout(3, 9);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(3600);
      await eventManagerContract.connect(admin1).payout(4, 9);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(5400);
      await eventManagerContract.connect(admin1).payout(5, 9);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(7200);
      await eventManagerContract.connect(admin1).payout(6, 9);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(9000);
    });

    it('Calling payout function for last event (id of 7) and ensure that player14 and player15  balances are increased', async () => {
      await eventManagerContract.connect(admin1).payout(7, 9);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player14.address)))).to.equal(13399);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(players.player15.address)))).to.equal(13399);
    });

    it('Check that contract balance == 0 and jackPot == 0', async () => {
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(eventManagerContract.address)))).to.equal(0);
      expect(parseInt(ethers.utils.formatEther(await eventManagerContract.jackPot()))).to.equal(0);
    });

    it('Ensure that promoters get their money and commissionWallet balance increased as well', async () => {
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter1.address)))).to.equal(10600);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(promoters.promoter2.address)))).to.equal(10250);
      expect(parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(commissionWallet.address)))).to.equal(10850);
    });
  });

  // it('Ensure that promoterReferrals array filled properly', async function() {
  //
  // });
});

async function playerVoteSubmit({ player, eventId, bucketIndex, promoterAddress, value}) {
  await eventManagerContract.connect(player).submitVote(
    eventId, bucketIndex, promoterAddress,
    { value: ethers.utils.parseEther(value) }
  );
}

async function printBalances() {
  console.log('================== Balances ==================');
  const admin1Balance = await ethers.provider.getBalance(admin1.address);
  console.log('Admin1 balance:', ethers.utils.formatEther(admin1Balance.toString()));
  const admin2Balance = await ethers.provider.getBalance(admin2.address);
  console.log('Admin2 balance:', ethers.utils.formatEther(admin2Balance.toString()));
  const contractBalance = await ethers.provider.getBalance(eventManagerContract.address);
  console.log('Contract balance:', ethers.utils.formatEther(contractBalance.toString()));
  const commissionWalletBalance = await ethers.provider.getBalance(commissionWallet.address);
  console.log('Commission wallet balance:', ethers.utils.formatEther(commissionWalletBalance.toString()));
  console.log('==============================================');
  for (const playerNumber of Object.keys(players)) {
    const playerBalance = await ethers.provider.getBalance(players[playerNumber].address);
    console.log(`P${playerNumber.substr(1)} balance: `, ethers.utils.formatEther(playerBalance.toString()));
  }
  console.log('==============================================');
  for (const promoterNumber of Object.keys(promoters)) {
    const playerBalance = await ethers.provider.getBalance(promoters[promoterNumber].address);
    console.log(`P${promoterNumber.substr(1)} balance: `, ethers.utils.formatEther(playerBalance.toString()));
  }
}