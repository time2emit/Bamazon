var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

function currentInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
			console.log("--------------------")
		};
		
		inquirer.prompt([
		{
			type: 'input',
			name: 'buy',
			message: 'Type the ID of the product you want to buy:'

		}

		]).then(function(itemId) {
			console.log("You want to buy item #" + itemId.buy);
			howManyOfId(itemId);
		})

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
	})
};


currentInventory();
