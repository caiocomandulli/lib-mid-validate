# Validate Middleware for NodeJS

This middleware handles request validation.

## Usage

### Adding the middle ware

First step is to add the `validate.js` file as a middleware to your application.

```javascript
app.use(require('validate')());
```

### Validate Options

Your options will be the mirror of the data expected by you in your contents.
You must specify each field and a rules object for the validator.
Any fields not specified will be discarded, allowing you to immediate filter unwanted data, this is specially convenient when persisting JSON objects to a database.

For example let's consider this expected request:

```javascript
{
	"establishment" : "Pizzeria",
	"person" : {
		"name" : "Luigi",
		"age" : 30
	},
	"order" : [{
		"item" : "Pizza",
		"quantity" : 1
		},{
		"item" : "Wine",
		"quantity" : 1
	}]
}
```

We can tell the middleware to validate simple fields the way you would access then as a variable:

```javascript
request.validateBody({
	"establishment" : {
		"required" : true
	},
	"person.name" : {
		"required" : true
	},
	"person.age" : {
		"optional" : true,
		"intOnly" : true
	}
});
```
We specify that `establishment` and `person.name` are required, but `person.age` is optional, meaning it will not lead to a validation error if missing but it won't be filtered either if present.

Arrays can also be validated, so we could validate `order` as well. With the wildcard symbol `$` we can do more advanced validation, it means for each item contained, it will apply that rule.

```javascript
request.validateBody({
	"order" : {
		"required" : true,
		"arrayHasLength" : true
	},
	"order.$.item" : {
		"required" : true
	},
	"order.$.quantity" : {
		"required" : true,
		"intOnly" : true
	}
});
```

Here we are making sure that `order` is an array of at least length one and that each `item` and `quantity` in every item will be validated as well.

### Validate Functions

When using the main validate function you can specify the type of parameter you want validated by using the `body`, `path` and `query` attributes on your options object.

`body` will validate your json content body.
Such as: `{"email" : "email@email.com", "pass" : "yourpasshere"}`
`path` will validate your path parameters.
Such as in: `http://website.com/helloworld/1234`
`query` will validate your query parameters.
Such as: `http://website.com/helloworld?myqueryparam=true`

```javascript
{
	"body" : {
		"email" : {
			"email" : true,
			"required" : true
		},
		"pass" : {
			"required" : true
		}
	},
	"path" : {
		"mypathparam" : {
			"numericOnly" : true
		}
	},
	"query" : {
		"myqueryparam" : {
			"booleanOnly" : true
		}
	}
}
```

You can also use the specific functions `validateBody`, `validatePath`, `validateQuery` and omit the correspondent attributes in your options.
```javascript
{
	"myqueryparam" : {
		"booleanOnly" : true
	}
}
```

### The Results

All validate functions output a result. By checking the `errors` field you can check each item that failed validation and its error.
Finally `content` will have the output object, filtered of all fields that shouldn't be received by your request.

```javascript
// Do a validation
var validationResults = request.validateBody({
	"email" : {
		"required" : true
	},
	"pass" : {
		"required" : true
	}
});
// Check for validation errors.
if (validationResults.errors) {
	response.status(400).send(validationResults.errors);
	next();
	return;
}
// Now use your validated data
var content = validationResults.content;
content.email;
```

## Install Library

__Step 1.__ Add this code to your project

##  License

MIT License. See the file LICENSE.md with the full license text.

## Author

[![Caio Comandulli](https://avatars3.githubusercontent.com/u/3738961?v=3&s=150)](https://github.com/caiocomandulli "On Github")

Copyright (c) 2016 Caio Comandulli
