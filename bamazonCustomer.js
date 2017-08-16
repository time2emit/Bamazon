//Necessary NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Configuration for connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

//Global variables
var itemId;
var quantity;


//Initial connection
connection.connect(function(err) {
	if (err) throw err;
	currentInventory();
})

//Display Invetory in SQL database
function currentInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("item #" + res[i].item_id + " | " + "product name: " + res[i].product_name + " | " + "product price ($): " + res[i].price);
			console.log("--------------------")
		}
		userPrompt();
	})
};
		
//Ask user for item number if they want to buy any items shown
function userPrompt() {
		inquirer.prompt([
		{
			type: 'input',
			name: 'buy',
			message: 'Type the item # of the product you want to buy:'

		}

		]).then(function(itemId) {
			console.log("You want to buy item #" + itemId.buy);
			howManyOfId(itemId);
		})

};

function howManyOfId(itemId) {
	inquirer.prompt([ 
	{
		type: 'input',
		name: 'quantity',
		message: 'How many of item #' + itemId.buy + ' do you want to buy?'

	}
	
	]).then(function(quantity) {
		console.log("You want to buy " + quantity.quantity + " of item #" + itemId.buy);
		confirmOrder(itemId.buy, quantity.quantity);

	})
};

function confirmOrder(itemId, quantity){
	itemId = itemId;
	quantity = quantity;

	inquirer.prompt([
	{
		type: 'rawlist',
		name: 'confirmation',
		message: 'Please confirm whether you want to buy ' + quantity + ' of item #' + itemId,
		choices: [
			'Buy listed item and quantity if available',
			'Do not buy and start over'
		]
	}
	]).then(function(confirmation) {
		if (confirmation.confirmation === 'Buy listed item and quantity if available') {
			displayInventoryAndExecuteOrder(itemId,quantity);
		} else {
			currentInventory();
		}
	})
};

function displayInventoryAndExecuteOrder(itemId, quantity) {
	connection.query("SELECT * FROM products WHERE item_id =?", [itemId], function(err, results){
		if (err) throw err;
		console.log("Checking inventory......");
		if (results[0].stock_quantity >= quantity) {
			executeOrder(quantity, itemId, results[0].stock_quantity, function(error){
				if (error) {
					return console.log('There was an error:' + error)
				}
				console.log('Thank you for your purchase of ' + quantity + ' ' + results[0].product_name + "(s)");
			});
		} else {
			console.log('We do not have enough left of item: ' + results[0].product_name);
			console.log("We only have " + results[0].stock_quantity + " left in stock");
			console.log("Returning you to the purchase page");
			currentInventory();
		}

	});
}

function executeOrder(quantity, itemId, stockQuantity, callback) {
	var updatedQuantity = parseInt(stockQuantity) - parseInt(quantity);
	// updatedQuantity = toString(updatedQuantity);
	var itemToUpdate = itemId;
	// itemToUpdate = toString(itemId);
	connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[updatedQuantity, itemToUpdate], function(error, results, fields) {
		callback(error);
	});
	// UPDATE products SET stock_quantity = 16 WHERE item_id = 9;
};
