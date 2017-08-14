var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

// inquirer.prompt([
// {
// 	type:''
// }
// ])

function currentInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		var inventoryList = [];
		for (var i = 0; i < res.length; i++) {
			inventoryList.push(res[i].product_name && res[i].item_id);
			console.log(inventoryList);
		}
	})
};

currentInventory();

