// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract SoccerEventManager {
    struct Event {
        string title;
        uint256 voteSize;
        address[] addresses;
        uint16[] buckets;
        uint256 pot;
        address[] payoutAddresses;
    }
    mapping (uint16 => Event) events;
    uint16 lastEventId;
    address adminAddress;
    address commissionAddress;

    constructor(address _commissionAddress) {
        commissionAddress = _commissionAddress;
        adminAddress = msg.sender;
        lastEventId = 0;
    }

    function getEventsCount() external view returns (uint16) {
        return lastEventId;
    }

    function setupEvent(
        string memory _title,
        uint256 _voteSize
    ) external returns (uint16) {
        require(bytes(_title).length != 0, "Title was not provided");
        require(_voteSize > 0, "Vote size must be more then 0");
        lastEventId++;
        Event memory newEvent = Event(
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
        uint16 _eventId,
        uint16 _bucketIdx
    ) external payable {
        require(msg.value == events[_eventId].voteSize, "Wrong voteSize");
        events[_eventId].addresses.push(address(msg.sender));
        events[_eventId].buckets.push(_bucketIdx);
        events[_eventId].pot += msg.value;
    }

    function getEventData(
        uint16 _eventId
    ) external view returns (Event memory) {
        return events[_eventId];
    }

    function withdraw(address payable _receiverAddress, uint _receiverAmount) private {
        _receiverAddress.transfer(_receiverAmount);
    }

    function payout(
        uint16 _eventId,
        uint16 _bucketIdx
    ) public {
        require(msg.sender == adminAddress, "Only admin can do it");
        require(events[_eventId].addresses.length == events[_eventId].buckets.length, "Length of addresses not equals to length of votes");
        require(events[_eventId].payoutAddresses.length == 0, "payoutAddresses was already filled");

        uint commissionAmount = events[_eventId].pot / 100 * 7;
        uint payoutAmount = events[_eventId].pot - commissionAmount;

        withdraw(payable(commissionAddress), commissionAmount);

        for (uint16 bIdx = 0; bIdx < events[_eventId].buckets.length; bIdx++) {
            if (_bucketIdx == events[_eventId].buckets[bIdx]) {
                events[_eventId].payoutAddresses.push(events[_eventId].addresses[bIdx]);
            }
        }

        uint payoutPerAddress = payoutAmount / events[_eventId].payoutAddresses.length;

        for (uint16 pIdx = 0; pIdx < events[_eventId].payoutAddresses.length; pIdx++) {
            withdraw(payable(events[_eventId].payoutAddresses[pIdx]), payoutPerAddress);
        }
    }
}