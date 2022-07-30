// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract EventManager {
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
    mapping(address => address) public userToPromoterMapping;
    mapping(address => address[]) promoterReferrals;
    mapping(address => uint8) admins;
    uint32 public lastEventId;
    address commissionAddress;
    uint8 public promoterPercent;
    uint8 public commissionPercent;
    uint256 public jackPot;
    uint8 public jackPotFrequency;

    constructor(
        address _commissionAddress
    ) {
        admins[msg.sender] = 1;
        commissionAddress = _commissionAddress;
        lastEventId = 0;
        promoterPercent = 5;
        commissionPercent = 5;
        jackPot = 0;
        jackPotFrequency = 3;
    }

    event JackPotIncreased(uint256);
    event JackPotSuccess(uint256);
    event PayoutMade(uint256);
    event VoteSubmitted(address, uint256);

    modifier onlyAdmin {
        require(admins[msg.sender] == 1, "Only admin can do it.");
        _;
    }

    function addAdmin(
        address _adminAddress
    ) external onlyAdmin {
        admins[_adminAddress] = 1;
    }

    function removeAdmin(
        address _adminAddress
    ) external onlyAdmin {
        admins[_adminAddress] = 0;
    }

    function ensureAdminByAddress(
        address _adminAddress
    ) external onlyAdmin view returns (bool) {
        return admins[_adminAddress] == 1;
    }

    function setPromoterPercent(
        uint8 _percent
    ) external onlyAdmin {
        promoterPercent = _percent;
    }

    function setCommissionPercent(
        uint8 _percent
    ) external onlyAdmin {
        commissionPercent = _percent;
    }

    function setJackPotFrequency(
        uint8 _frequency
    ) external onlyAdmin {
        jackPotFrequency = _frequency;
    }

    function getPromotedByAddress(
        address _address
    ) external view returns (address[] memory) {
        return promoterReferrals[_address];
    }

    function setEventStatusToVotingDisabled(
        uint32 _eventId
    ) external onlyAdmin {
        events[_eventId].status = EventStatus.VOTING_DISABLED;
    }

    function setupEvent(
        string memory _title,
        uint256 _voteSize
    ) external onlyAdmin returns (uint32) {
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
        require(events[_eventId].status == EventStatus.VOTING_ENABLED, "Voting is closed.");
        require(msg.value == events[_eventId].voteSize, "Wrong voteSize");

        if (userToPromoterMapping[msg.sender] == address(0x0)) {
            userToPromoterMapping[msg.sender] = _promoter;
            promoterReferrals[_promoter].push(msg.sender);
        }

        events[_eventId].addresses.push(address(msg.sender));
        events[_eventId].buckets.push(_bucketIdx);
        events[_eventId].pot += msg.value;
        emit VoteSubmitted(msg.sender, msg.value);
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
    ) public onlyAdmin {
        require(events[_eventId].addresses.length == events[_eventId].buckets.length, "Length of addresses not equals to length of votes");
        require(events[_eventId].status != EventStatus.PAYOUT_WAS_DONE, "Payouts was made already.");

        uint commissionAmount = events[_eventId].pot / 100 * commissionPercent;
        uint promoterAmount = events[_eventId].pot / 100 * promoterPercent;
        uint payoutAmount = events[_eventId].pot - commissionAmount - promoterAmount;

        withdraw(payable(commissionAddress), commissionAmount);

        // payout to promoters
        uint singlePromoterPayout = promoterAmount / events[_eventId].addresses.length;
        for (uint16 plrIdx = 0; plrIdx < events[_eventId].addresses.length; plrIdx++) {
            address playerAddress = events[_eventId].addresses[plrIdx];
            withdraw(payable(userToPromoterMapping[playerAddress]), singlePromoterPayout);
        }

        // Filling in payoutAddresses array with winners addresses for further payout
        for (uint16 bIdx = 0; bIdx < events[_eventId].buckets.length; bIdx++) {
            if (_bucketIdx == events[_eventId].buckets[bIdx]) {
                events[_eventId].payoutAddresses.push(events[_eventId].addresses[bIdx]);
            }
        }

        if (events[_eventId].payoutAddresses.length > 0) {
            // make payout
            uint payoutPerWinner = payoutAmount / events[_eventId].payoutAddresses.length;
            for (uint16 pIdx = 0; pIdx < events[_eventId].payoutAddresses.length; pIdx++) {
                withdraw(payable(events[_eventId].payoutAddresses[pIdx]), payoutPerWinner);
            }
            emit PayoutMade(payoutAmount);
        } else {
            // increase jackPot and try to play it
            jackPot += payoutAmount;
            emit JackPotIncreased(jackPot);
            jackPotChallenge(jackPot, _eventId);
        }

        events[_eventId].status = EventStatus.PAYOUT_WAS_DONE;
    }

    function jackPotChallenge(
        uint256 _jackPot,
        uint32 _eventId
    ) private onlyAdmin {
        bool isJackPotSuccess = _eventId % jackPotFrequency == 0;
        if (isJackPotSuccess) {
            uint jackPotPayoutPerAddress = _jackPot / events[_eventId].addresses.length;
            for (uint16 addrIdx = 0; addrIdx < events[_eventId].addresses.length; addrIdx++) {
                withdraw(payable(events[_eventId].addresses[addrIdx]), jackPotPayoutPerAddress);
            }
            jackPot = 0;
            emit JackPotSuccess(_jackPot);
        }
    }
}