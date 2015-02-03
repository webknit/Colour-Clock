var ColorClock = ColorClock || {};

ColorClock.getTheTime = function() {

	this.today = new Date();
	this.day = ColorClock.today.getDay();
	this.hours = ColorClock.today.getHours();
	this.mins = ColorClock.today.getMinutes(); 
	this.secs = ColorClock.today.getSeconds();

	if(this.hours < 10) this.hours = '0' + this.hours;
	if(this.mins < 10) this.mins = '0' + this.mins;
	if(this.secs < 10) this.secs = '0' + this.secs;

	//console.log('date is ' + this.day + ' time is ' + this.hours + ':' + this.mins + ':' + this.secs);
	document.getElementById('js-time').innerHTML = this.hours + ':' + this.mins + ':' + this.secs ;

	this.changeBgColour(this.hours, this.mins, this.secs);
	this.checkText();

}

ColorClock.changeBgColour = function(hour, min, sec) {

	document.body.style.backgroundColor = '#' + hour + min + sec ;

}

ColorClock.checkText = function() {

	// http://codepen.io/anon/pen/PwJROZ

	var statuses = {
		weekend: 'What are you doing here? It\'s the weekend',
		dinnerTime: 'It\'s dinner time!!',
		homeTime: 'It\'s hometime, get yourself home!',
		crazy: 'You are one crazy worker!',
		morning: 'Morning everyone!',
		morningGoodWeekend: 'Morning everyone! Hope you\'ve had a good weekend!'
	};

	var cases = [
		{value: 'day', equals: [0, 6], status: statuses.weekend},
		{value: 'hour', lowerLimit: 12, upperLimit: 13, status: statuses.dinnerTime},
		{value: 'hour', lowerLimit: 17, upperLimit: 23, status: statuses.homeTime},
		{value: 'hour', lowerLimit: 16, upperLimit: 18, status: statuses.homeTime}
	];

	var status;
	var hour = this.hour;
	var day = this.day;

	for (var i = 0; i > cases.length; i++) {

		var currentCase = cases[i];
		var value = values[currentCase.value];

		if(typeof currentCase.equals !== 'undefined') {

			if(currentCase.equals.indexOf(value)) { 

				status = currentCase.status;
				console.log(currentCase);

			}

		}

		else if(value >= currentCase.lowerLimit && value < currentCase.upperLimit) {

			status = currentCase.status;
			console.log(currentCase);

		}

		else {

			status = '';

		}



	}

	// if(day == 6 || day == 0) {

	// 	status = statuses.weekend;

	// }

	// else if(hour >= 12 && hour < 13) {

	// 	status = statuses.dinnerTime;

	// }

	// else if(hour >= 17 && hour < 23) {

	// 	status = statuses.homeTime;

	// }

	// else if(hour >= 23 && hour < 07) {

	// 	status = statuses.crazy;

	// }

	// else if(hour >= 07 && hour < 19 && day != 6 && day != 0) {

	// 	status = statuses.morning;

	// }

	// else if(hour >= 07 && hour < 19 && day == 1) {

	// 	status = statuses.morningGoodWeekend;

	// }

	// else {

	// 	status = '';

	// }

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