var inquirer = require('inquirer');
var mysql = require ('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    //password: "password", //Your password
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

var chooseProduct = function(){
	connection.query("SELECT * FROM products", function(err, res) {
	inquirer.prompt({
		name: "productName",
		type: "rawlist",
		choices: function(value){
			var choiceArray = [];
			for (var i=0; i<res.length; i++){
				choiceArray.push(res[i].productName);
			}
			return choiceArray;
			//console.log(choiceArray);
		},
		message: "What would you like to purchase?"
	}).then(function(answer){
		for (var i = 0; i < res.length; i++) {
                if (res[i].productName == answer.productName) {
                    var chosenProduct = res[i];
                    inquirer.prompt({
                        name: "stockQuantity",
                        type: "input",
                        message: "How many would you like to purchase?"
                    }).then(function(answer) {
                        if (chosenProduct.stockQuantity >= answer.stockQuantity) {
                             connection.query("UPDATE products SET ? WHERE ?", [{
                             	stockQuantity: chosenProduct.stockQuantity - answer.stockQuantity
                                 },{
                                 	id: chosenProduct.id
                             }], function(err, res) {
                             	console.log("Price: " + (chosenProduct.price * answer.stockQuantity) + " dollars")
                                 console.log("Order fulfilled!");
                                 chooseProduct();
                             });
                         } else {
                             console.log("Insufficient quantity!");
                             chooseProduct();
                         }
	 				})
  				}
		}
	})
})
}
  chooseProduct();