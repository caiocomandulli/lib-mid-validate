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

We can use parameters in our validations as well.

```javascript
"start" : {
	"greaterThan" : Date.now()
},
"end" : {
	"greaterThanAttribute" : "start"
}
```

In `greaterThan` we use our current date to validate that the start date of an event is later than now.
And in `greaterThanAttribute` we use the name of another attribute to compare if the end date is after the start date.

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

### Existing Validators

The currently existing validator are

`required` fails if the field is missing
`optional` mark this field as optional, which won't fail validation if missing, but won't be ignored either
`numericOnly` fails if not a numeric value
`validCnpj` checks if value is a CNPJ number*
`phone` fails if not a numeric value*
`email` checks if it is a valid email
`document` fails if not a numeric value*
`validCpf` checks if value is a CPF number*
`date` checks if it is a valid date
`arrayHasLength` checks if it is an array of at least length one
`cep` fails if not a numeric value*
`booleanOnly` checks if either true or false
`floatOnly` checks if it is a valid float
`intOnly` checks if it is a valid int
`greaterThan` checks if it is greater than parameter
`lessThan` checks if it is less than parameter
`greaterThanAttribute` checks if it is greater than another field
`lessThanAttribute` checks if it is less than another field

`*` these validators have pre-validation formatting, meaning that the string passes through a special filter before being tested, such as in the `phone`, `cep` and `document`, what it does is it removes special characters such as `-/()` and afterwards test if is is a valid number.

### Custom Validators and Formatting

You can pass validators through an options object when adding your middleware.

```javascript
var options = {
	customValidationFunctions : [myCustomValidation],
	customFormatFunctions : [myCustomFormat]
};
app.use(require('validate')(options));
```

Validators and formatters always follow a function signature of `function(value, params)`, `value` will be the field value at time of validation, `params` will be the parameter specified at your validation options as in `"greaterThan" : 1`.

By taking a look at the `phone` validator, we first specify a formatter:

```javascript
"phone" : function(value, params) {
		var phone = / |\(|\)|\+|\-/g;
		return value.replace(phone, "");
}
```

This will guarantee that the field won't have special characters common to a phone number that would fail our validation.

```javascript
"phone" : function(value, params) {
		var numeric = /^[0-9]+$/;
		return numeric.test(value);
}
```

Finally we test if the field is a number.

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
