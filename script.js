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
ColorClock.statuses = {
	weekend: 'What are you doing here? It\'s the weekend',
	dinnerTime: 'It\'s dinner time!!',
	homeTime: 'It\'s hometime, get yourself home!',
	goodMorning: 'Morning everyone!',
	goodWeekend: 'Morning everyone! Hope you\'ve had a good weekend',
	default: ''
};

// The rules for the status output
ColorClock.cases = [
	/*
		EXAMPLE 
		{ value: 'day', equals: [0, 6], status: statuses.weekend }

		value = What the rule is base on e.g day/hour
		equals(array) = if the day/hour is exactly equal to, can add multiple items
		lowerLimit = the lower limit eg start at 1pm = 13
		upperLimit = the higher limit eg to finish at 2pm = 14
		status = If something is true what status should be returned
	*/
	/*
		MULTIPLE EXAMPLE
		In this example we compare two cases, they both need to be true in order to return a status
		e.g At 9am-10am on Monday we want to output "hope you've had a good weekend"
		[
			{ value: 'secs', lowerLimit: 20, upperLimit: 30, status: statuses.homeTime },
			{ value: 'day', equals: [3, 5], status: statuses.homeTime }
		]
	*/
	{ value: 'day', equals: [0, 6], status: ColorClock.statuses.weekend },
	{ value: 'hour', lowerLimit: 12, upperLimit: 13, status: ColorClock.statuses.dinnerTime },
	{ value: 'hour', lowerLimit: 8, upperLimit: 10, status: ColorClock.statuses.goodMorning },
	{ value: 'hour', lowerLimit: 17, upperLimit: 23, status: ColorClock.statuses.homeTime },
	[ 
		{ value: 'hour', lowerLimit: 7, upperLimit: 12, status: ColorClock.statuses.goodWeekend },
		{ value: 'day', equals: [1], status: ColorClock.statuses.goodWeekend }
	]
];

// Function to handle the multicase
ColorClock.handleMultiCase = function(currentCases) {

	var status = this.statuses.default;

	// Run through the case array object 
	// e.g length == 2 and we count down until nothing left
	for (var i = currentCases.length - 1; i >= 0; i--) {

		// Run the normal single case function on the current object in the array
		var currentStatus = this.getStatus(currentCases[i]);

		console.log('currentStatus ' + currentStatus);

		// Check if it returns without a match
		// We drop out because we want the multiple case only to return if all of them match 
		// so we can return the default value
		if(currentStatus === this.statuses.default) return this.statuses.default;

		// If it's not the default we have a match and can run the next 
		// rule to ensure that's true
     	status = currentStatus;

	};
  	
  	// Return the required status
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
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
	var hasEquals = currentCase.hasOwnProperty('equals');
	var hasLower = currentCase.hasOwnProperty('lowerLimit');
	var hasUpper = currentCase.hasOwnProperty('upperLimit');

	// The following are the if statements for the various outcomes
	// This was a bit mind boggling at first galce

	// If hasEquals == true and hasLower && hasUpper == false
	if(hasEquals && !hasLower && !hasUpper) {

		/*
			get the equals array from the currentCase and check if the value exists in that 
			array (indexOf returns -1 for a non-match as arrays are 0 indexed so if it matched 
			the first element it would return 0) and if it matches, return the currentCase status property
		*/
		if(currentCase.equals.indexOf(value) !== -1) return currentCase.status;

	} 

	// If we've got a equals and a lower but no upper
	else if(hasEquals && hasLower && !hasUpper) {

		// If it's in the array and >= the value we defined above
		if(currentCase.equals.indexOf(value) !== -1 && value >= currentCase.lowerLimit) return currentCase.status;
	
	} 

	// If we've got an equals and an upper
	else if(hasEquals && !hasLower && hasUpper) {

		// If it's in the array and < the value we defined above
		if(currentCase.equals.indexOf(value) !== -1 && value < currentCase.upperLimit) return currentCase.status;
	
	} 

	// If we've got an equals and an upper and a lower
	else if(hasEquals && hasLower && hasUpper) {

		// Check if in the array and that it's >= and < the value
		if(currentCase.equals.indexOf(value) !== -1 && value >= currentCase.lowerLimit && value < currentCase.upperLimit) return currentCase.status;
	
	} 

	// Moving onto the those without equals values
	// If we only have a lower
	else if(!hasEquals && hasLower && !hasUpper) {

		// Same as the above but we don't need to check if it's in the array
		if(value >= currentCase.lowerLimit) return currentCase.status;

	} 

	// These are just repeats of the hasEquals but !hasEquals
	else if(!hasEquals && !hasLower && hasUpper) {

		if(value < currentCase.upperLimit) return currentCase.status;

	} 

	// These are just repeats of the hasEquals but !hasEquals
	else if(!hasEquals && hasLower && hasUpper) {

		if(value >= currentCase.lowerLimit && value < currentCase.upperLimit) return currentCase.status;

	}

	// If nothing matches then we just return the default
	return this.statuses.default;

};

ColorClock.checkText = function() {

	// Reset the status to the default one
	var status = this.statuses.default;

	// Loop through the cases.length
	for (var i = 0; i < this.cases.length; i++) {

		var currentCase = this.cases[i];

		// Check if current object is an array so we can handle multiple cases
		if(Object.prototype.toString.call(currentCase) === '[object Array]') {

			status = this.handleMultiCase(currentCase);

		} 

		// Else handle a single case
		else {

			status = this.getStatus(currentCase);

		}

		// Drop out of loop because we have a match
		if(status !== this.statuses.default) {
		
			break;

		}
	  
	}

	// Stick the status on the page
	document.getElementById('js-announcement').innerHTML = status

}

ColorClock.startClock = function() {

	// Make the clock tick each second
	var interval = setInterval(function() {

		// Call the function
		ColorClock.countClock()

	},1000);

	this.countClock = function() {

		this.getTheTime();

	}

}

// Start the clock!
ColorClock.startClock();