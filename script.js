var ColorClock = ColorClock || {};

ColorClock.getTheTime = function() {

	this.today = new Date(); 
	this.hours = ColorClock.today.getHours();
	this.mins = ColorClock.today.getMinutes(); 
	this.secs = ColorClock.today.getSeconds();

	if(this.hours < 10) this.hours = '0' + this.hours;
	if(this.mins < 10) this.mins = '0' + this.mins;
	if(this.secs < 10) this.secs = '0' + this.secs;

	console.log('time is ' + this.hours + ':' + this.mins + ':' + this.secs);
	document.getElementById('time').innerHTML = this.hours + ':' + this.mins + ':' + this.secs ;

	this.changeBgColour(this.hours, this.mins, this.secs )

}

ColorClock.changeBgColour = function(hour, min, sec) {

	document.body.style.backgroundColor = '#' + hour + min + sec ;

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