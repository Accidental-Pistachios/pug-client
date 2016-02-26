angular.module('pug.userEventsController', ['pug.userEventsService'])
.controller('userEventsController', function($scope, userEventsService, $ionicPopup){
  $scope.userEvents = [];

  userEventsService.getUserEvents()
  .then(function(resp){
  	$scope.userEvents = resp;
  });


 $scope.showConfirm = function(eventId) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Checkout of Event',
     template: 'Are you sure you want to checkout of this event?'
   });


   confirmPopup.then(function(yes) {
     if(yes) {
       userEventsService.removeUserEvent(eventId);
       
      for(var i = 0; i < $scope.userEvents.length; i++){
        if($scope.userEvents[i].data._id === eventId){
       	  $scope.userEvents.splice(i,1);
        }
      }
     }
   });
 };

  $scope.format = function (startTime){
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
    } else {
      append = 'AM';
    }

    formattedTime = [hours, minutes].join(':') + ' ' + append;
    date.push(formattedTime);

    return date.join(' ');  
  };
});


