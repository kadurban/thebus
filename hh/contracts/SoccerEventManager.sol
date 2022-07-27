// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract SoccerEventManager {
    enum EventStatus{VOTING_ENABLED, VOTING_DISABLED, PAYOUT_WAS_DONE}
    struct Event {
        EventStatus status;
        string title;
        uint256 voteSize;
        address[] addresses;
        uint16[] buckets;
        uint256 pot;
        address[] payoutAddresses;
    }

    mapping(uint32 => Event) events;
    mapping(address => address) userToPromotersMapping;
    mapping(address => address[]) promoterReferrals;
    uint32 public lastEventId;
    address ownerAddress;
    address commissionAddress;
    uint8 public promoterPercent;
    uint8 public commissionPercent;
    uint256 public jackPot;

    constructor(
        address _commissionAddress
    ) {
        commissionAddress = _commissionAddress;
        ownerAddress = msg.sender;
        lastEventId = 0;
        promoterPercent = 5;
        commissionPercent = 5;
        jackPot = 0;
    }

    event JackPotIncreased(uint256);
    event JackPotSuccess(uint256);
    event PayoutMade(uint256);

    modifier onlyOwner {
        require(msg.sender == ownerAddress, "Only owner can do it.");
        _;
    }

    function setPromoterPercent(
        uint8 _percent
    ) external onlyOwner {
        promoterPercent = _percent;
    }

    function setCommissionPercent(
        uint8 _percent
    ) external onlyOwner {
        commissionPercent = _percent;
    }

    function setupEvent(
        string memory _title,
        uint256 _voteSize
    ) external onlyOwner returns (uint32) {
        require(bytes(_title).length != 0, "Title was not provided");
        require(_voteSize > 0, "Vote size must be more then 0");
        lastEventId++;
        Event memory newEvent = Event(
            EventStatus.VOTING_ENABLED,
            _title,
            _voteSize,
            new address[](0),
            new uint16[](0),
            0,
            new address[](0)
        );
        events[lastEventId] = newEvent;
        return lastEventId;
    }

    function submitVote(
        uint32 _eventId,
        uint16 _bucketIdx,
        address _promoter
    ) external payable {
        require(events[_eventId].status == EventStatus.VOTING_ENABLED, "Unable to place a vote");
        require(msg.value == events[_eventId].voteSize, "Wrong voteSize");

        if (userToPromotersMapping[msg.sender] == address(0x0)) {
            userToPromotersMapping[msg.sender] = _promoter;
            promoterReferrals[_promoter].push(msg.sender);
        }

        events[_eventId].addresses.push(address(msg.sender));
        events[_eventId].buckets.push(_bucketIdx);
        events[_eventId].pot += msg.value;
    }

    function getPromotedByAddress(
        address _address
    ) external view returns (address[] memory) {
        return promoterReferrals[_address];
    }

    function setEventStatusToVotingDisabled(
        uint32 _eventId
    ) external onlyOwner {
        events[_eventId].status = EventStatus.VOTING_DISABLED;
    }

    function getEventData(
        uint32 _eventId
    ) external view returns (Event memory) {
        return events[_eventId];
    }

    function withdraw(
        address payable _receiverAddress,
        uint _receiverAmount
    ) private {
        _receiverAddress.transfer(_receiverAmount);
    }

    function payout(
        uint32 _eventId,
        uint16 _bucketIdx
    ) public onlyOwner {
        require(events[_eventId].addresses.length == events[_eventId].buckets.length, "Length of addresses not equals to length of votes");
        require(events[_eventId].status != EventStatus.PAYOUT_WAS_DONE, "payoutAddresses was already filled");

        uint commissionAmount = events[_eventId].pot / 100 * commissionPercent;
        uint promoterAmount = events[_eventId].pot / 100 * promoterPercent;
        uint payoutAmount = events[_eventId].pot - commissionAmount - promoterAmount;

        withdraw(payable(commissionAddress), commissionAmount);

        // payout to promoters
        uint singlePromoterPayout = promoterAmount / events[_eventId].addresses.length;
        for (uint16 plrIdx = 0; plrIdx < events[_eventId].addresses.length; plrIdx++) {
            address playerAddress = events[_eventId].addresses[plrIdx];
            withdraw(payable(userToPromotersMapping[playerAddress]), singlePromoterPayout);
        }

        // Filling in payoutAddresses array with winners addresses for further payout
        for (uint16 bIdx = 0; bIdx < events[_eventId].buckets.length; bIdx++) {
            if (_bucketIdx == events[_eventId].buckets[bIdx]) {
                events[_eventId].payoutAddresses.push(events[_eventId].addresses[bIdx]);
            }
        }

        uint payoutPerWinner = payoutAmount / events[_eventId].payoutAddresses.length;
        // make payout if anyone win
        if (events[_eventId].payoutAddresses.length > 0) {
            for (uint16 pIdx = 0; pIdx < events[_eventId].payoutAddresses.length; pIdx++) {
                withdraw(payable(events[_eventId].payoutAddresses[pIdx]), payoutPerWinner);
            }
            emit PayoutMade(payoutAmount);
            // increase jackPot and try to play it
        } else {
            jackPot += payoutAmount;
            emit JackPotIncreased(jackPot);
            jackPotChallenge(jackPot, _eventId);
        }

        events[_eventId].status = EventStatus.PAYOUT_WAS_DONE;
    }

    function jackPotChallenge(
        uint256 _jackPot,
        uint32 _eventId
    ) private onlyOwner {
        bool isJackPotSuccess = _eventId % 5 == 0;

        if (isJackPotSuccess) {
            uint jackPotPayoutPerAddress = _jackPot / events[_eventId].addresses.length;
            for (uint16 addrIdx = 0; addrIdx < events[_eventId].addresses.length; addrIdx++) {
                withdraw(payable(events[_eventId].addresses[addrIdx]), jackPotPayoutPerAddress);
            }
            emit JackPotSuccess(_jackPot);
        }
    }
}