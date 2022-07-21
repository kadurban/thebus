// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract SoccerEventManager {
    struct Event {
        string title;
        uint256 voteSize;
        address[] addresses;
        uint8[] buckets;
        uint256 pot;
    }
    mapping (uint16 => Event) events;
    uint16 lastEventId;

    constructor() {
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
            new uint8[](0),
            0
        );
        events[lastEventId] = newEvent;
        return lastEventId;
    }

    function submitVote(
        uint16 _eventId,
        uint8 _bucketIdx
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

//    function payoutByEventId(
//        uint16 _eventId
//    ) {
//
//    }
}