if ('serviceWorker' in navigator) {
  console.log("Will the service worker register?");
  navigator.serviceWorker.register('../sw.js')
    .then(function (reg) {
      console.log("Yes, it did.");
    }).catch(function (err) {
      console.log("No it didn't. This happened: ", err)
    });
}
let localTimeClock = function () {
  $("#clocks").empty();
  $("#clocks").append("<div class=\"clockBlock\"><p>local time</p><canvas id=\"localTimeClock\" width=\"200\" height=\"200\" style=\"background-color:white\"></canvas></div>");
  let canvas = document.getElementById("localTimeClock");
  let ctx = canvas.getContext("2d");
  let radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90
  let timeZone = moment.tz.guess();
  drawClock(ctx, radius,timeZone);
  let zones;
  localforage.getItem('zones').then(function(value){
    zones = value;
    if (zones != null){
      zones.forEach(function(obj){
        $("#clocks").append("<div class=\"clockBlock\"><p>"+obj.name +"</p><canvas id=\""+obj.name +"\" width=\"200\" height=\"200\" style=\"background-color:white\"></canvas></div>");
        let canvas2 = document.getElementById(obj.name);
        let ctx2 = canvas2.getContext("2d");
        let radius2 = canvas2.height / 2;
        ctx2.translate(radius2, radius2);
        radius2 = radius2 * 0.90
        let timeZone2 = obj.zone;
        drawClock(ctx2, radius2,timeZone2);
      })
    }
    });
}
let changeTab = function () {
  $('.tabHead').removeClass('active');
  $('.tabHead').addClass('clickable');
  $(this).removeClass('clickable').addClass('active');
}
let showClocks = function () {
  $('#clocks').removeClass('hidden');
  $('#addClock').addClass('hidden');
}
let showAddClock = function () {
  $('#addClock').removeClass('hidden');
  $('#clocks').addClass('hidden');
}
function drawClock(ctx, radius, timeZone) {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius, timeZone);
}

function drawFace(ctx, radius) {
  var grad;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (num = 1; num < 13; num++) {
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius, timeZone) {
  var now = new Date();
  let time = now.toLocaleString('en-GB', {timeZone: timeZone})
  var date = new Date(time);
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  //hour
  hour = hour % 12;
  hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
  drawHand(ctx, hour, radius * 0.5, radius * 0.07);
  //minute
  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minute, radius * 0.8, radius * 0.07);
  // second
  second = (second * Math.PI / 30);
  drawHand(ctx, second, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}


let addTimeZones = function () {
  let list = moment.tz.names();
  list.forEach(timeZone => {
    $("#timeZones").append("<option value=\"" + timeZone + "\">");
  });
}
let submitForm = function (e) {
  e.preventDefault();
  var zonesArray;
  localforage.getItem('zones').then(function (value) {
    zonesArray = value;
    if (zonesArray == null) {
      zonesArray = [{
        name: $("#name").val(),
        zone: $("#timeZone").val()
      }];
    } else {
      zonesArray.push({
        name: $("#name").val(),
        zone: $("#timeZone").val()
      });
    }
    localforage.setItem('zones', zonesArray).then(function (value) {
      $("#yourClocksTab").addClass("active").removeClass("clickable");
      $("#addClockTab").addClass("clickable").removeClass("active");
      showClocks();
    }).catch(function (err) {
    });
  }).catch(function (err) {
  });
}

let removeClocks = function(){
  localforage.clear().then(function() {
}).catch(function(err) {
});
}

$(document).ready(function () {
  
  addTimeZones();
 
  setInterval(localTimeClock, 1000);
  $('.tabHead').on('click', changeTab);
  $('#yourClocksTab').on('click', showClocks);
  $('#addClockTab').on('click', showAddClock);
  $('.remove').on('click', removeClocks);
  $('form').on('submit', submitForm);
});