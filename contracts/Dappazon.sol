// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    struct Item {
        uint256 id;
        string title;
        string category;
        string description;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint => Order)) public orders; 

    event List(string title,uint256 cost,uint256 quantity);//////////
    event Buy(address buyer, uint256 orderId, uint itemId);///////////


    modifier onlyowner(){
        require(msg.sender==owner,"You are not the owner");
        _; // this means before the fucntion body if you want to appy anything after the function body then apply this line above the require statement
    }

    constructor(){
        owner = msg.sender;
    }
    function list(
        uint256 _id,
        string memory _title,
        string memory _category,
        string memory _description,
        string  memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyowner {
        Item memory item = Item(
            _id,
            _title,
            _category,
            _description,
            _image,
            _cost,
            _rating,
            _stock
        );
        items[_id] = item;
        
        emit List(_title,_cost,_stock);//////////////
    }

    function buy(uint256 _id) public payable {
         Item memory item = items[_id];

         require(msg.value >= item.cost);
         require(item.stock > 0);

         Order memory order = Order(block.timestamp, item);  
         orderCount[msg.sender]++;
         orders[msg.sender][orderCount[msg.sender]] = order;

         items[_id].stock = item.stock -1;

         emit Buy(msg.sender, orderCount[msg.sender],item.id);/////////
    }
    
    //this function transfer the total earning to the owner
    function withdraw() public onlyowner{
        (bool success,) = owner.call{value : address(this).balance}("");
        require(success);
    }
}
