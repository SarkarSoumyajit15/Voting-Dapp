// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Voting {
    struct Voter {
        bool exists;
        bool casted;
        string voted_party;
    }

    struct Party {
        bool exists;
        uint128 num_of_votes;
    }

    event VoteCasted(address indexed voter, uint256 time_of_vote);
    event check(uint start_time,uint time_now);

    string[] parties;
    address[] voters;
    address private EC;
    uint256 start_time;
    uint256 end_time;
    uint majority_count;

    mapping(string => Party) private p_parties;
    mapping(address => Voter) private p_voters;

    constructor(
        string[] memory _parties,
        uint256 _start_time,
        uint256 _durationInHours,
        address[] memory _voters
    ) {
        require(_start_time > block.timestamp , "Start time should be in the future");
        for (uint i = 0; i < _parties.length; ++i) {
            p_parties[_parties[i]].exists = true;
        }
        for (uint i = 0; i < _voters.length; ++i) {
            p_voters[_voters[i]].exists = true;
        }
        parties = _parties;
        voters = _voters;
        EC = msg.sender;
        start_time = _start_time;
        end_time = _start_time + _durationInHours * 1 hours;
    }

    modifier only_if_owner() {
        require(msg.sender == EC, "Only contract owner can execute this");
        _;
    }

    modifier before_voting_starts(){
        require(block.timestamp < start_time,"You are only allowed to modify it before voting starts");
        _;
    }

    modifier after_voting_ends(){
        require(block.timestamp > end_time,"Voting has not ended yet");
        _;
    }

    modifier only_if_eligible_to_vote() {
        require(
            p_voters[msg.sender].exists == true,
            "You are not in the voter list."
        );
        require(
            p_voters[msg.sender].casted == false,
            "Your vote has already been casted."
        );
        require(
            block.timestamp > start_time && block.timestamp < end_time,
            "Voting window is closed."
        );
        _;
    }

    function castVote(
        string memory party_name
    ) external only_if_eligible_to_vote {
        require(p_parties[party_name].exists,"Party does not exist");
        
        p_voters[msg.sender].casted = true;
        p_voters[msg.sender].voted_party = party_name;
        ++p_parties[party_name].num_of_votes;

        emit VoteCasted(msg.sender, block.timestamp);
    }

    function addParty(string memory party_name) external only_if_owner before_voting_starts {
        require(!p_parties[party_name].exists, "Party already exists");
        p_parties[party_name].exists = true;
        parties.push(party_name);
    }

    function addVoter(address  voter_address) external only_if_owner before_voting_starts{
        require(!p_voters[voter_address].exists, "Voter already exists");
        p_voters[voter_address].exists = true;
        voters.push(voter_address);
    }

    function getParties() external view  returns (string[] memory) {
        return parties;
    }

    function getVoters() external view  returns (address[] memory) {
        return voters;
    }

    function getParty(
        string memory party_name
    ) external view   after_voting_ends  returns (Party memory) {
        return p_parties[party_name];
    }
}



