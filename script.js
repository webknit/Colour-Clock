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
	this.checkText(this.hours, this.day);

}

ColorClock.changeBgColour = function(hour, min, sec) {

	document.body.style.backgroundColor = '#' + hour + min + sec ;

}

ColorClock.checkText = function(hour, day) {

	var status;

	console.log(day);

	if(day == 6 || day == 0) {

		status = "What are you doing here? It's the weekend!"

	}

	else if(hour >= 12 && hour < 13) {

		status = "It's dinner time!!"

	}

	else if(hour >= 17 && hour < 23) {

		status = "It's hometime, get yourself home!"

	}

	else if(hour >= 23 && hour < 07) {

		status = "You are one crazy worker!"

	}

	else if(hour >= 07 && hour < 19 && day != 6 && day != 0) {

		status = "Morning everyone!"

	}

	else if(hour >= 07 && hour < 19 && day == 1) {

		status = "Morning everyone! Hope you've had a good weekend!"

	}

	else {

		status = ""

	}

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