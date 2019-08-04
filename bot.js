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
let timeH;
let timeM;
let timeS;
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
	timeH = curHour;
	timeM = curMinute;
	timeS = curSeconds;
}
setInterval(updateTime, 1000);



function addUser(username, value) {
	
}

function addValue(username, value) {
	
}


const exampleEmbed = {
	color: 0x0099ff,
	title: 'Cell Bot',
	author: {
		name: 'Thorgrim102',
		icon_url: 'https://www.facebook.com/photo.php?fbid=1362990170382088&set=a.165632133451237&type=3&theater',
	},
	description: 'Cell Bot designed for the Solution Cell',
	fields: [
		{
			name: '!clockin',
			value: 'Clock yourself in. Displays clock in time and date.',
		},
		{
			name: '!clockout',
			value: 'Clock yourself out. Displays clock out time and date. Aswell as total time clocked in.',
		},
		{
			name: '!addvalue [n]',
			value: 'Adds and counts value added by yourself. Will display amount added and total amount added.',
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
                bot.sendMessage({
                    to: channelID,
                    message: user + " has clocked in at \n" + today
                });
				
				clockedInTimeH = timeH;
				clockedInTimeM = timeM;
				clockedInTimeS = timeS;
            break;
			// !clockout
			case 'clockout':
				clockedOutTimeH = timeH;
				clockedOutTimeM = timeM;
				clockedOutTimeS = timeS;
				
				clockedInTotal = ((clockedOutTimeH - clockedInTimeH) < 10 ? "0" + (clockedOutTimeH - clockedInTimeH) : (clockedOutTimeH - clockedInTimeH)) + ":" + ((clockedOutTimeM - clockedInTimeM) < 10 ? "0" + (clockedOutTimeM - clockedInTimeM) : (clockedOutTimeM - clockedInTimeM)) + ":" + ((clockedOutTimeS - clockedInTimeS) < 10 ? "0" + (clockedOutTimeS - clockedInTimeS) : (clockedOutTimeS - clockedInTimeS));
				bot.sendMessage({
					to: channelID,
					message: user + " has clocked out at \n" + today + "\nClocked in for: " + clockedInTotal
				});
			break;
			// !addvalue
			case 'addvalue':
				value = parseInt(command[1]);
				//addUser(user, value);
				
				//WOULD BE NICE THIS WAY BUT JUST CHECK IF USER = NAME AND THEN MAKE SURE ITS ONLY THE 4 PEOPLE THAT ARE IN THE CELL. SIAMESE ME WEINER ND VAPOR.
				
				if(user == "Thorgrim102") {
					valueThor += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueThor
					});
				} else if (user == "weinerdog102") {
					valueWeiner += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueWeiner
					});
				} else if (user == "Vaporizr243") {
					valueVapor += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueVapor
					});
				} else if (user == "MySiameseTwin") {
					valueSiamese += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueSiamese
					});
				}
				
			break;
            // Just add any case commands if you want to..
         }
     }
});