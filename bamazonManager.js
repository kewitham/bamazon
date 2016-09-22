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
    runSearch();
})

var runSearch = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View Products for Sale':
                viewProducts();
            break;
            
            case 'View Low Inventory':
                viewlowInventory();
            break;
            
            case 'Add to Inventory':
                addInventory();
            break;
            
            case 'Add New Product':
                addProduct();
            break;
        }
    })
};

var viewProducts = function(){
	connection.query("SELECT * FROM products", function(err, res) {
	//inquirer.prompt({
		//name: "id" + "productName" + "departmentName" + "price" + "stockQuantity",
		//type: "rawlist",
		//choices: function(value){
			//var choiceArray = [];
			for (var i=0; i<res.length; i++){
				console.log("id: " + res[i].id + " product name: " + res[i].productName + " department name: " + res[i].departmentName + " price: " + res[i].price + " quantity: " + res[i].stockQuantity);
			}
			//return choiceArray;
			//console.log(choiceArray);
			//runSearch();
		})
	//})
	//})
};

var viewlowInventory = function(){
	connection.query("SELECT * FROM products", function(err, res) {
	//inquirer.prompt({
	//	name: "stockQuantity",
	//	type: "rawlist"
	//}).then (function(res){
		for (var i = 0; i < res.length; i++) {
                if (res[i].stockQuantity < 5) {
                	console.log(res[i].productName)
                	runSearch();
                } else {
                	console.log("Stock quantities are high!")
                	//runSearch();
                }
	}
	})
	//})
};

var addInventory = function(){
	connection.query('SELECT * FROM products', function(err, res) {
		inquirer.prompt({
            name: "productName",
            type: "rawlist",
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].productName);
                }
                return choiceArray;
            },
            message: "What product would you like to add inventory to?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].productName == answer.productName) {
                    var chosenProduct = res[i];
                    inquirer.prompt({
                        name: "stockQuantity",
                        type: "input",
                        message: "How much inventory would you like to add?"
                    }).then(function(answer) {
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stockQuantity: (stockQuantity + answer.stockQuantity)
                            }, {
                                id: chosenProduct.id
                            }], function(err, res){
                                console.log("Quantity is now " + answer.stockQuantity)
                                
                          	})
								//runSearch();
 						})

                    	//start();
                    }
                }
                })
    })
}

	var addProduct = function(){
		inquirer.prompt([{
        name: "productName",
        type: "input",
        message: "What is the product you would like to add?"
    }, {
        name: "departmentName",
        type: "input",
        message: "What department would you like to add the new product to?"
    }, {
        name: "stockQuantity",
        type: "input",
        message: "How much of the new product would you like to add?",
        // validate: function(value) {
        //     if (isNaN(value) == false) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        //}
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            productName: answer.productName,
            departmentName: answer.departmentName,
            stockQuantity: answer.stockQuantity,
        }, function(err, res) {
            console.log("Your new product was added successfully!");
            //runSearch();
        });
    })
}
