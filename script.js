var ColorClock = ColorClock || {};

ColorClock.getTheTime = function() {

	// Get the date/time information
	this.today = new Date();
	this.day = ColorClock.today.getDay();
	this.hours = ColorClock.today.getHours();
	this.mins = ColorClock.today.getMinutes(); 
	this.secs = ColorClock.today.getSeconds();

	// Store the date and time in an object for use later
	this.values = {
		day: this.day,
		hour: this.hours,
		secs: this.secs
	};

	// Add zeros onto the time digits to help us change colour
	if(this.hours < 10) this.hours = '0' + this.hours;
	if(this.mins < 10) this.mins = '0' + this.mins;
	if(this.secs < 10) this.secs = '0' + this.secs;

	// Output the time
	document.getElementById('js-time').innerHTML = this.hours + ':' + this.mins + ':' + this.secs ;

	// Change the bg colour based on the time
	this.changeBgColour(this.hours, this.mins, this.secs);

	// Call the check/change text function
	this.checkText();

};

ColorClock.changeBgColour = function(hour, min, sec) {

	// Changed the # of the body colur based on the time
	document.body.style.backgroundColor = '#' + hour + min + sec ;

}

// An object with the statuses
var statuses = {
	weekend: 'What are you doing here? It\'s the weekend',
	dinnerTime: 'It\'s dinner time!!',
	homeTime: 'It\'s hometime, get yourself home!',
	goodWeekend: 'Morning everyone! Hope you\'ve had a good weekend',
	default: ''
};

// The rules for the status output
var cases = [
	/*
		EXAMPLE 
		{ value: 'day', equals: [0, 6], status: statuses.weekend }

		value = What the rule is base on e.g day/hour
		equals(array) = if the day/hour is exactly equal to, can add multiple items
		lowerLimit = the lower limit eg start at 1pm = 13
		upperLimit = the higher limit eg to finish at 2pm = 14
		status = If soemthing is true what status should be returned
	*/
	/*
		MULTIPLE EXAMPLE
		In this example we two things, they both need to be true in order to return a status
		e.g At 9am-10am on Monday we want to output "hope you've had a good weekend"
		[
			{ value: 'secs', lowerLimit: 20, upperLimit: 30, status: statuses.homeTime },
			{ value: 'day', equals: [3, 5], status: statuses.homeTime }
		]
	*/
	{ value: 'day', equals: [0, 6], status: statuses.weekend },
	{ value: 'hour', lowerLimit: 12, upperLimit: 13, status: statuses.dinnerTime },
	{ value: 'hour', lowerLimit: 10, upperLimit: 12, status: statuses.goodWeekend },
	{ value: 'hour', lowerLimit: 17, upperLimit: 23, status: statuses.homeTime },
	[ 
		{ value: 'hour', lowerLimit: 7, upperLimit: 12, status: statuses.goodWeekend },
		{ value: 'day', equals: [1], status: statuses.goodWeekend }
	]
];

ColorClock.handleMultiCase = function(currentCases) {

	var status = statuses.default;

	for (var i = currentCases.length - 1; i >= 0; i--) {

		// Run the normal single case function
		var currentStatus = this.getStatus(currentCases[i]);
		// Check if it returns without a match
		if(currentStatus === statuses.default) return statuses.default;
     	status = currentStatus;

	};
  	
  	return currentStatus;

};

ColorClock.getStatus = function(currentCase) {

	// this.values refers to the object we created at the top
	// e.g this.values['day'] would select this.day
	var value = this.values[currentCase.value];

	console.log('value ' + value)

	/*
		The above code could also be wrote like the following but this isn't as 
		flexible/maintainable as the code we have used and shoudl be faster with less code bloat

		if(currentCase.value === 'day') {
			value = this.day;
		} else if(currentCase.value === 'hour') {
			value = this.hours;
		}
	*/

	// The hasOwnProperty() method returns a boolean indicating whether the object has the specified property.
	var hasEquals = currentCase.hasOwnProperty('equals');
	var hasLower = currentCase.hasOwnProperty('lowerLimit');
	var hasUpper = currentCase.hasOwnProperty('upperLimit');

	if(hasEquals && !hasLower && !hasUpper) {

		if(currentCase.equals.indexOf(value) !== -1) return currentCase.status;

	} 

	else if(hasEquals && hasLower && !hasUpper) {

		if(currentCase.equals.indexOf(value) !== -1 && value >= currentCase.lowerLimit) return currentCase.status;
	} else if(hasEquals && !hasLower && hasUpper) {
		if(currentCase.equals.indexOf(value) !== -1 && value < currentCase.upperLimit) return currentCase.status;
	} else if(hasEquals && hasLower && hasUpper) {
		if(currentCase.equals.indexOf(value) !== -1 && value >= currentCase.lowerLimit && value < currentCase.upperLimit) return currentCase.status;
	} else if(!hasEquals && hasLower && !hasUpper) {
		if(value >= currentCase.lowerLimit) return currentCase.status;
	} else if(!hasEquals && !hasLower && hasUpper) {
		if(value < currentCase.upperLimit) return currentCase.status;
	} else if(!hasEquals && hasLower && hasUpper) {
		if(value >= currentCase.lowerLimit && value < currentCase.upperLimit) return currentCase.status;
	}

	return statuses.default;

};

ColorClock.checkText = function() {

	// Reset the status to the default one
	var status = statuses.default;

	// Loop through the cases.length
	for (var i = 0; i < cases.length; i++) {

		var currentCase = cases[i];

		// Check if current object is an array so we can handle multiple cases
		if(Object.prototype.toString.call(currentCase) === '[object Array]') {

			status = this.handleMultiCase(currentCase);

		} 

		// Else handle a single case
		else {

			status = this.getStatus(currentCase);

		}

		// Drop out of loop because we have a match
		if(status !== statuses.default) {
		
			break;

		}
	  
	}

	// Stick the status on the page
	document.getElementById('js-announcement').innerHTML = status

}

ColorClock.startClock = function() {

	var interval = setInterval(function() {

		ColorClock.countClock()

	},1000);

	this.countClock = function() {

		this.getTheTime();

	}

}

ColorClock.startClock();