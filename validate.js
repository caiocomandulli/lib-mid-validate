var formatFunctions = {
	"validCnpj" : function(value, params) {
		var cnpj = /\/|\.|\-/g;
		return value.replace(cnpj, "");
	},
	"phone" : function(value, params) {
		var phone = / |\(|\)|\+|\-/g;
		return value.replace(phone, "");
	},
	"document" : function(value, params) {
		var document = /\/|\.|\-/g;
		return value.replace(document, "");
	},
	"validCpf" : function(value, params) {
		var cpf = /\.|\-/g;
		return value.replace(cpf, "");
	},
	"cep" : function(value, params) {
		var cep = /-/g;
		return value.replace(cep, "");
	}
};
var customFormatFunctions = {

};
var validationFunctions = {
	"required" : function(value, params) {
		return value !== undefined && value !== null && value !== "";
	},
	"numericOnly" : function(value, params) {
		var reg = /^[0-9]+$/;
		return reg.test(value);
	},
	"validCnpj" : function(value, params) {
		var cnpj = /\/|\.|\-/g;
		var numeric = /^[0-9]+$/;
		value = value.replace(cnpj, "");
		if (!numeric.test(value)) {
			return false;
		}
		if (value.length < 14) {
			return false;
		}
		var verifiers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		var firstSum = 0;
		var secondSum = 0;
		for (var i = 0; i < 12; i++) {
			firstSum += parseInt(value.charAt(i)) * verifiers[i + 1];
			secondSum += parseInt(value.charAt(i)) * verifiers[i];
		}
		secondSum += parseInt(value.charAt(12)) * verifiers[12];

		var firstMod = firstSum % 11;
		var firstDigit = 0;
		if (firstMod > 2) {
			firstDigit = 11 - firstMod;
		}

		var secondMod = secondSum % 11;
		var secondDigit = 0;
		if (secondMod > 2) {
			secondDigit = 11 - secondMod;
		}

		if (parseInt(value.charAt(12)) != firstDigit || parseInt(value.charAt(13)) != secondDigit) {
			return false;
		}
		return true;
	},
	"phone" : function(value, params) {
		var phone = / |\(|\)|\+|\-/g;
		var numeric = /^[0-9]+$/;
		value = value.replace(phone, "");
		return numeric.test(value);
	},
	"email" : function(value, params) {
		var email = /@/;
		return email.test(value);
	},
	"document" : function(value, params) {
		var document = /\/|\.|\-/g;
		var numeric = /^[0-9]+$/;
		value = value.replace(document, "");
		if (!numeric.test(value)) {
			return false;
		}
		return true;
	},
	"validCpf" : function(value, params) {
		var cpf = /\.|\-/g;
		var numeric = /^[0-9]+$/;
		value = value.replace(cpf, "");
		if (!numeric.test(value)) {
			return false;
		}

		if (value.length < 11) {
			return false;
		}

		var firstSum = 0;
		var secondSum = 0;
		for (var i = 0; i < 9; i++) {
			firstSum += parseInt(value.charAt(i)) * (10 - i);
			secondSum += parseInt(value.charAt(i)) * (11 - i);
		}
		secondSum += parseInt(value.charAt(9)) * 2;

		var firstMod = firstSum % 11;
		var firstDigit = 0;
		if (firstMod > 2) {
			firstDigit = 11 - firstMod;
		}

		var secondMod = secondSum % 11;
		var secondDigit = 0;
		if (secondMod > 2) {
			secondDigit = 11 - secondMod;
		}

		if (parseInt(value.charAt(9)) != firstDigit || parseInt(value.charAt(10)) != secondDigit) {
			return false;
		}

		return true;
	},
	"date" : function(value, params) {
		var normalizedDate = new Date(Date.parse(value));
		if (isNaN(normalizedDate)) {
			return false;
		}
		return true;
	},
	"arrayHasLength" : function(array, params) {
		var hasLength = false;
		for (var index in array) {
			hasLength = true;
			break;
		}
		return hasLength;
	},
	"cep" : function(value, params) {
		var cep = /-/g;
		var numeric = /^[0-9]+$/;
		value = value.replace(cep, "");
		return numeric.test(value);
	},
	"booleanOnly" : function(value, params) {
		return value == 'true' || value == 'false' || value === true || value === false;
	},
	"floatOnly" : function(value, params) {
		var floater = float = /^(?:[-+])?(?:[0-9]+)?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
		if (value === '' || value === '.') {
			return false;
		}
		return floater.test(value);
	},
	"intOnly" : function(value, params) {
		var integer = int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
		if (value === '' || value === '.') {
			return false;
		}
		return integer.test(value);
	},
	"greaterThan" : function(value, params) {
		return parseInt(value) > parseInt(params);
	},
	"lessThan" : function(value, params) {
		return parseInt(value) < parseInt(params);
	},
	"greaterThanAttribute" : function(value, params) {
		var attribute = fetchAttribute(value, params);
		return parseInt(value) > parseInt(currentNode);
	},
	"lessThanAttribute" : function(value, params) {
		var attribute = fetchAttribute(value, params);
		return parseInt(value) < parseInt(attribute);
	}
};
var customFunctions = {};

var fetchAttribute = function(value, params) {
	var splitCurr = currFullName.split('.');
	var splitParam = params.split('.');
	var currentNode = currBody;
	for (var splitIndex in splitParam) {
		var splitValue = splitParam[splitIndex];
		if (splitValue === "$") {
			if (splitCurr[splitIndex]) {
				splitValue = splitCurr[splitIndex];
			} else {
				console.log("Correct your validation rules!");
				return false;
			}
		}
		if (currentNode[splitValue]) {
			currentNode = currentNode[splitValue];
		} else {
			return false;
		}
	}
	return currentNode;
};

var currFullName = "";
var currBody = {};
var handleAttribute = function(name, rules, content, parentContent, parentError) {
	var splitName = name.split(".");
	var currName = splitName[0];
	if (currName === "$") {
		var listValid = true;
		for (var childKey in content) {
			currFullName = currFullName + childKey;
			var child = content[childKey];
			parentContent[childKey] = parentContent[childKey] ? parentContent[childKey] : {};
			var stubError = parentError[childKey] ? parentError[childKey] : {};
			var valueValid = handleSingleValue(splitName, childKey, name.split(".")[1], rules, content, parentContent, stubError);
			if (!valueValid) {
				listValid = false;
				parentError[childKey] = stubError[childKey];
			}
		}
		return listValid;
	} else {
		currFullName = currFullName + currName;
		if (!parentContent[currName]) {
			parentContent[currName] = {};
		}
		return handleSingleValue(splitName, currName, name, rules, content, parentContent, parentError);
	}
};
var handleSingleValue = function(splitName, currName, name, rules, content, parentContent, parentError) {
	if(!content)
	{
		if(rules.optional !== undefined)
		{
			return true;
		} else {
			var errorMessage = "Invalid Field.";
			if (rules.required !== undefined && rules.required.message !== undefined) {
				errorMessage = rules.required.message;
			}
			parentError[currName] = errorMessage;
			return false;
		}
	}
	if (splitName.length > 1) {
		var stubError = parentError[currName] ? parentError[currName] : {};
		var firsDot = name.indexOf(".");
		currFullName = currFullName + ".";
		var valid = handleAttribute(name.substr(name.indexOf(".") + 1), rules, content[currName], parentContent[currName], stubError);
		if (!valid) {
			parentError[currName] = stubError;
		}
		return valid;
	} else {
		var contentValue = content[currName];
		//console.log("Analysing " + currName);
		//optional rule
		if (contentValue == undefined && rules.optional != undefined) {
			delete parentContent[currName];
			return true;
		}
		//process rules
		var attributeValid = true;
		for (var ruleName in rules) {
			var ruleParams = rules[ruleName];
			var functionParams = ruleParams;
			var errorMessage = "Invalid Field.";
			if (ruleParams.params !== undefined) {
				functionParams = ruleParams.params;
			}
			if (ruleParams.message !== undefined) {
				errorMessage = ruleParams.message;
			}
			// get rule fuction
			var ruleFunction = null;
			if (!validationFunctions[ruleName]) {
				if (!customFunctions[ruleName]) {
					// if not found ignore it
					continue;
				} else {
					ruleFunction = customFunctions[ruleName];
				}
			} else {
				ruleFunction = validationFunctions[ruleName];
			}
			// if valid
			var valid = ruleFunction(contentValue, functionParams);
			if (!valid) {
				//console.log("(" + currName + " invalid at rule '" + ruleName + "' with value [");
				//console.log(contentValue);
				//console.log("])");
				attributeValid = false;
				parentError[currName] = errorMessage;
				continue;
			}
			// format
			var formatFunction = null;
			if (!formatFunctions[ruleName]) {
				if (!customFormatFunctions[ruleName]) {
					// if not found ignore it
					continue;
				} else {
					formatFunction = customFormatFunctions[ruleName];
				}
			} else {
				formatFunction = formatFunctions[ruleName];
			}
			contentValue = formatFunction(contentValue, functionParams);
		}
		if (attributeValid) {
			//console.log("Validated " + currName);
			parentContent[currName] = contentValue;
		}
		return attributeValid;
	}
};

var validateFunction = function(rules, content) {
	//vars
	var results = {
		content : {},
	};
	var errors = {};
	//process attributes
	var fullyValid = true;
	for (var attributeName in rules) {
		//recursive logic
		currFullName = "";
		currBody = content;
		var valid = handleAttribute(attributeName, rules[attributeName], content, results.content, errors);
		if (!valid) {
			fullyValid = false;
		}
	}
	if (!fullyValid) {
		results.errors = errors;
	}
	// return
	return results;
};

var validateBody = function(rules) {
	return validateFunction(rules, this.body);
};

var validateQuery = function(rules) {
	return validateFunction(rules, this.query);
};

var validatePath = function(rules) {
	return validateFunction(rules, this.params);
};

var validate = function(rules) {
	var results = {};
	results.content = {};
	if (rules.body) {
		var bodyResults = validateFunction(rules.body, this.body);
		results.content.body = bodyResults.content;
		if (bodyResults.errors) {
			results.errors = {};
			results.errors.body = bodyResults.errors;
		}
	}
	if (rules.query) {
		var queryResults = validateFunction(rules.query, this.query);
		results.content.query = queryResults.content;
		if (queryResults.errors) {
			if (!results.errors) {
				results.errors = {};
			}
			results.errors.query = queryResults.errors;
		}
	}
	if (rules.path) {
		var pathResults = validateFunction(rules.path, this.params);
		results.content.path = pathResults.content;
		if (pathResults.errors) {
			if (!results.errors) {
				results.errors = {};
			}
			results.errors.path = pathResults.errors;
		}
	}
	return results;
};

var validateMiddleware = function(options) {
	if (options) {
		if (options.customValidationFunctions) {
			customFunctions = options.customValidationFunctions;
		}
		if (options.customFormatFunctions) {
			customFormatFunctions = options.customFormatFunctions;
		}
	}
	return function(request, response, next) {
		request.validate = validate;
		request.validatePath = validatePath;
		request.validateQuery = validateQuery;
		request.validateBody = validateBody;
		next();
	};
};
// exports
module.exports = validateMiddleware;
