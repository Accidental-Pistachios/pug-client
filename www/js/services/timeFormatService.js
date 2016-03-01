angular.module('pug.timeFormatService', [])

.factory('timeFormatService', function(){
  function createDate(val) {
    var today = new Date();
    var hour = parseInt(val/3600);
    var minute = (val - hour*3600) / 60;
    today.setHours(hour);
    today.setMinutes(minute);
    today.setSeconds(0);
    return today;
  }

  var formatTime = function(startTime){
    var start = new Date(startTime);
    var date = start.toString().split(' ').slice(0,3);
    var time = start.toString().split(' ')[4];
    var formattedTime = time.split(':');
    var hours = Number(formattedTime[0]);
    var minutes = formattedTime[1];
    var append;

    if(hours > 12){
      hours-=12;
      append = 'PM';
    } else if (hours === 0) { 
      hours = 12;
      append = 'AM';
    } else if (hours===12) {
      append = 'PM';
    } else {
      append = 'AM';
    }

    formattedTime = [hours, minutes].join(':') + ' ' + append;
    date.push(formattedTime);

    return date.join(' ');
  };

  return {
    createDate: createDate,
    formatTime : formatTime
  };
});