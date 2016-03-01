angular.module('creatingEvent', [])
.controller('creatingEventController', function (EventService, $scope, $state, timeFormatService) {
  $scope.createdEvent = {};
  $scope.showStartTime = false;
  $scope.showEndTime = false;

  $scope.addEvent = function () {
    EventService.addEvent($scope.createdEvent)
    .then(function () {
      return EventService.set($scope.createdEvent);
    })
    .then(function (){
      // Reset scope variables and redirect to map after submitting form
      $scope.createdEvent = {};
      $scope.showStartTime = false;
      $scope.showEndTime = false;
      $state.go('tabs.map');
    });
  };

  $scope.searchAddress = function () {
    var addressInput = $scope.createdEvent.location;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: addressInput}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.createdEvent.latitude=results[0].geometry.location.lat();
        $scope.createdEvent.longitude=results[0].geometry.location.lng();
        $scope.addEvent();
      }
    });
  };

  function startTimePickerCallback(val) {

    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var startDate = timeFormatService.createDate(val);
      $scope.showStartTime = true;
      $scope.createdEvent.startTime = startDate;
      var displayTime = timeFormatService.formatTime(startDate);
      $scope.displayStartTime = ' is ' + displayTime;
    }
  }

  function endTimePickerCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var endDate = timeFormatService.createDate(val);
      $scope.showEndTime = true;
      $scope.createdEvent.endTime = endDate;
      var displayTime = timeFormatService.formatTime(endDate);
      $scope.displayEndTime = ' is ' + displayTime;
    }
  }

  $scope.startTime = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    format: 12,
    callback: function (val) {
      startTimePickerCallback(val);
    }
  };

  $scope.timePickerObject = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    format: 12,
    callback: function (val) {
      endTimePickerCallback(val);
    }
  };
});

