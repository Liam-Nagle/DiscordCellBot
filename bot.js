var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var valueThor = 0;
var valueWeiner = 0;
var valueVapor = 0;
var valueSiamese = 0;

const prefix = "!" //set bot prefix

let clockedInTimeH;
let clockedInTimeM;
let clockedInTimeS;
let clockedOutTimeH;
let clockedOutTimeM;
let clockedOutTimeS;
let ClockedInTotal;
let objToday;
let today;
let time;
let timeHour;
let timeMin;
let timeSeconds;


let value;
let currentvalue;
var data = fs.readFileSync('users.json')
var users = JSON.parse(data);

function updateTime(){
	
	objToday = new Date(),
		weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
		dayOfWeek = weekday[objToday.getDay()],
		domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
		dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
		months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
		curMonth = months[objToday.getMonth()],
		curYear = objToday.getFullYear(),
		curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
		curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
		curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
		curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
	today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear + "\n__**LOCAL TIME**__";
}
setInterval(updateTime, 1000);

function updateTime2(){
	
	objToday = new Date(),
		curHour = objToday.getHours()
		curMinute = objToday.getMinutes()
		curSeconds = objToday.getSeconds()
		timeHour = curHour;
		timeMin = curMinute;
		timeSeconds = curSeconds;
}
setInterval(updateTime2, 1000);



function addUser(username) {
	var data = JSON.stringify(users, null, 2);
	var exists = "USER ALREADY EXISTS";
	
	if(data.includes(username)) {
		exists = "__**User already exists**__";
		return exists;
	} else {
		users.push({"Name": username, 
					"Value": 0, 
					"ClockInHour": 0, 
					"ClockInMin": 0, 
					"ClockInSec": 0, 
					"ClockedIn": "No",
					"BreakTime": 0,
					"Break": "No"
					,});
		fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
		exists = "__**User has been created**__";
		return exists;
	}
}

function delUser(username) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].Name === username) {
		var deletedItem = users.splice(i, 1);
		fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
		return;
    }
  }
}

function setValue(name) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].Name === name) {
      users[i].Value += value;
	  fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
      return;
    }
  }
}

function delValue(name) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].Name === name) {
      users[i].Value -= value;
	  fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
      return;
    }
  }
}

function getValue(name, value) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].Name === name) {
      var value = users[i].Value
      return value;
    }
  }
}

function setClockIn(name, hour, min, sec) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].Name === name) {
		users[i].ClockInHour = hour;
		users[i].ClockInMin = min;
		users[i].ClockInSec = sec;
		users[i].ClockedIn = "Yes";
		fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
      return;
    }
  }
}

function setClockOut(name) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].Name === name) {
		var clockedInHour = timeHour - users[i].ClockInHour;
		var clockedInMin = timeMin - users[i].ClockInMin;
		var clockedInSeconds = timeSeconds - users[i].ClockInSec;
		
		if (clockedInHour < 0 || clockedInMin < 0 || clockedInSeconds < 0) {
			var reply = "**User took a break and clocked out before doing any work**"
			return reply;
		} else {
			finalClockedInHour = clockedInHour > 12 ? clockedInHour - 12 : (clockedInHour < 10 ? "0" + clockedInHour : clockedInHour);
			finalClockedInMin = clockedInMin < 10 ? "0" + clockedInMin : clockedInMin;
			finalClockedInSeconds = clockedInSeconds < 10 ? "0" + clockedInSeconds : clockedInSeconds;
			finalClockedInTime = finalClockedInHour + ":" + finalClockedInMin + ":" +  finalClockedInSeconds;
			users[i].ClockedIn = "No";
			fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
			return finalClockedInTime;
		}
    }
  }
}

function breakTime(user, breaktime) { 
	var breakHour = 0;
	var breakMin = 0;
	for (var i = 0; i < users.length; i++) {
		if (users[i].Name === user && users[i].ClockedIn == "No") {
				var reply = "No need to take a break, you're not clocked in! **Slacker!**";
				return reply;
		} else if (users[i].Name === user && users[i].ClockedIn == "Yes") {
			users[i].BreakTime = breaktime;
			if(breaktime > 60) {
				breakHour = Math.round(breaktime / 60);
				breakMin = breaktime - (breakHour * 60);
				users[i].ClockInHour = users[i].ClockInHour + breakHour;
				users[i].ClockInMin = users[i].ClockInMin + breakMin;
			} else if (breaktime < 60) {
				breakMin = breaktime;
				users[i].ClockInMin = users[i].ClockInMin + breakMin;
			}
			users[i].Break = "Yes";
			fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
			var reply = user + " is going on a break for " + breakHour + " Hours " + breakMin + " Mins";
			return reply;
		}
	}
}

function back(user, backtime) {
	var breakHour = 0;
	var breakMin = 0;
	var backHour = 0;
	var backMin = 0;
	for (var i = 0; i < users.length; i++) {
		if (users[i].Name === user && users[i].Break == "No") {
				var reply = "You are not on a break. Make sure to !break (time) before taking a break";
				return reply;
		} else if (users[i].Name === user && users[i].Break == "Yes") {			
			if(users[i].BreakTime > 60) {
				breakHour = Math.round(users[i].BreakTime / 60);
				breakMin = users[i].BreakTime - (breakHour * 60);
				users[i].ClockInHour = users[i].ClockInHour - breakHour;
				users[i].ClockInMin = users[i].ClockInMin - breakMin;
			} else if (users[i].BreakTime < 60) {
				breakMin = users[i].BreakTime;
				users[i].ClockInMin = users[i].ClockInMin - breakMin;
			}
			if(backtime > 60) {
				backHour = Math.round(backtime / 60);
				backMin = backtime - (backHour * 60);
				users[i].ClockInHour = users[i].ClockInHour + backHour;
				users[i].ClockInMin = users[i].ClockInMin + backMin;
			} else if (backtime < 60) {
				backMin = backtime;
				users[i].ClockInMin = users[i].ClockInMin + backMin;
			}		
			users[i].Break = "No";
			fs.writeFile('users.json', JSON.stringify(users, null, 2), err => { if (err) console.log(err) });
			var reply = user + " is now back after a " + backHour + " Hours " + backMin + " Mins break";
			return reply;
		}
	}
}



const exampleEmbed = {
	color: 0x0099ff,
	title: 'Cell Bot',
	author: {
		name: 'Thorgrim102',
		icon_url: 'https://imgur.com/a/I4zYxIa',
	},
	description: 'Cell Bot designed for the Solution Cell',
	fields: [
		{
			name: '!help',
			value: 'Displays this message',
		},
		{
			name: '!clockin',
			value: 'Clock yourself in. Displays clock in time and date.',
		},
		{
			name: '!clockout',
			value: 'Clock yourself out. Displays clock out time and date. Aswell as total time clocked in.',
		},
		{
			name: '!addvalue n',
			value: 'Adds and counts value added by yourself. Will display amount added and total amount added. n = Amount of value added.',
		},
		{
			name: '!delvalue n',
			value: 'Deletes value from your total. Do this is value was incorrectly added n = Amount of value added.',
		},
		{
			name: '!break n',
			value: 'Put yourself on a break. n = Length of time in mins for break.(60 = 1 hour 150 = 1 hour 30 mins etc)',
		},
		{
			name: '!back n',
			value: 'Use this if you came back from your break early. n = Length of time ACTUALLY on break. Example: You !break 60 but came back after 15 mins? type !back 15. This will auto update your clockin time so the break is taken into account when you clockout!',
		},
	],
	timestamp: new Date(),
	footer: {
		text: 'Created and Coded by Thorgrim102 (Liam Nagle)',
	},
};

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.startsWith(prefix)) { // Message starts with prefix
        let command = message.slice(prefix.length).split(" "); // Split message into words
        switch (command[0]) { // Execute code depending on first word
            // !help
			case 'help':
			
               bot.sendMessage({
                   to: channelID,
				   embed: exampleEmbed
			   });
            break;
			
			// !clockin
            case 'clockin':
				var data = JSON.stringify(users, null, 2);
				
				if(data.includes(user)) {
					setClockIn(user, timeHour, timeMin, timeSeconds);
					bot.sendMessage({
						to: channelID,
						message: user + " has clocked in at \n" + today
					});
				} else {
					addedUser = addUser(user);
					
					bot.sendMessage({
						to: channelID,
						message: addedUser
					});
					
					setClockIn(user, timeHour, timeMin, timeSeconds)
					bot.sendMessage({
						to: channelID,
						message: user + " has clocked in at \n" + today
					});
				}
				
            break;
			
			// !clockout
			case 'clockout':
				var data = JSON.stringify(users, null, 2);
				for (var i = 0; i < users.length; i++) {
					if (users[i].Name === user && users[i].ClockedIn == "No") {
						bot.sendMessage({
							to: channelID,
							message: user + " is not clocked in. Please !clockin"
						});
					} else if (users[i].Name === user && users[i].ClockedIn == "Yes") {
						clockedInTotal = setClockOut(user);
						bot.sendMessage({
							to: channelID,
							message: user + " has clocked out at \n" + today + "\nClocked in for: " + clockedInTotal
						});
				  }}
			break;
			// !addvalue
			case 'addvalue':
				value = parseInt(command[1]);
				var data = JSON.stringify(users, null, 2);
			
				if(data.includes(user)) {
					setValue(user, value);
					
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n__**Total Value:**__ " + getValue(user)
					});
				
				} else {
					addedUser = addUser(user);
					
					bot.sendMessage({
						to: channelID,
						message: addedUser
					});
					
					setValue(user, value);
					
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n__**Total Value:**__ " + getValue(user)
					});
				}
			break;
			// !delvalue
			case 'delvalue':
				value = parseInt(command[1]);
				var data = JSON.stringify(users, null, 2);
			
				if(data.includes(user)) {
					delValue(user, value);
					
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n__**Total Value:**__ " + getValue(user)
					});
				
					console.log("It worked!");
				} else {
					addedUser = addUser(user);
					
					bot.sendMessage({
						to: channelID,
						message: addedUser
					});
					
					delValue(user, value);
					
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n__**Total Value:**__ " + getValue(user)
					});
				}
			break;
			//!break
			case 'break':
				breaktime = parseInt(command[1]);
				var reply = breakTime(user, breaktime);
				
				bot.sendMessage({
					to: channelID,
					message: reply
				})
            break;
			//!back
			case 'back':
				backtime = parseInt(command[1]);
				var reply = back(user, backtime);
				
				bot.sendMessage({
					to: channelID,
					message: reply
				})
            break;	
			
			//!adduser
			case 'adduser':
				username = command[1];
				
				if(username == user || user == "Thorgrim102") { //Only allows users to add themselves as a user. Unless you own the bot then you can add whoever.
					addedUser = addUser(username);
				
					bot.sendMessage({
						to: channelID,
						message: addedUser
					});		
				}		
            break;
			//!deluser
			case 'deluser':
				username = command[1];
				
				if(username == user || user == "Thorgrim102") { //Only allows user to delete themselves. Unless you own the bot then you can delete whoever.
					delUser(username);
				
					bot.sendMessage({
						to: channelID,
						message: "Deleted " + username
					});	
				}			
            break;
            // Just add any case commands if you want to..
         }
     }
});