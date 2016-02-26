angular.module('pug.map', [])
.controller('MapController', function($scope, $ionicLoading, $compile, $cordovaGeolocation, Auth, userEventsService, $ionicPopup) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  var markers = [];
  $scope.events;

  userEventsService.getAllEvents()
  .then(function (events) {
    $scope.events = events;

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var loc = Auth.get() || [position.coords.latitude, position.coords.longitude];
      var centerLatLng = new google.maps.LatLng(loc[0], loc[1]);

      var mapOptions = {
        center: centerLatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false
      };

      // Create new map with mapOptions specified
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker;

      for (var i = 0; i < $scope.events.length; i++) {
        var latLng = new google.maps.LatLng($scope.events[i].latitude, $scope.events[i].longitude);
        addMarker(latLng, $scope.events[i]);
      }
    }, function(error){
      console.log("Could not get location");
    });
  });

  // Adds a marker to the map and push to the array.
  function addMarker(latLng, event) {
    var infoWindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    marker.eventType = event.type;

    // Sets text that popups when marker is clicked
    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
  
          var formattedDateTime = format(event.startTime);
          var plural = (event.playerCount > 1) ? "players" : "player";
          
          var eventTypeArr = ["<div class='important'>", event.type ,"</div>"].join('');
          var playerCountArr = ["<div class='important'>", event.playerCount, " " , plural, "</div>"].join('');
          var eventStartTimeArr = ["<div class='notImportant'>", formattedDateTime ,"</div>"].join('');
          var locationArr = ["<div class='notImportant'>", event.location ,"</div>"].join('');
          var skillLevelArr = ["<div class='notImportant'>", event.skillLevel ,"</div>"].join('');

          var allInfoArr = [eventTypeArr, playerCountArr, eventStartTimeArr, locationArr, skillLevelArr].join('');
          infoWindow.setContent("<div class='container'>" + allInfoArr + "</div>");
          infoWindow.open($scope.map, marker);
          var contentBox = document.getElementById(event._id);
          contentBox.addEventListener("click", function() {
            userEventsService.checkInUser(event._id)
            .then(function() {
              $ionicPopup.alert({
                title: 'Event added!'
              });
            });
          }, false);
        };
    })(marker));

    markers.push(marker);
  }

  $scope.filterEvents = function () {
    for (var i = 0; i < markers.length; i++) {
      if(!markers[i].eventType.includes($scope.filter)) {
        markers[i].setMap(null);
      } else if (markers[i].eventType.includes($scope.filter) || $scope.filter === '') {
        if (markers[i].map === null) {
          markers[i].setMap($scope.map);
        }
      }
    }
  };

  $scope.logout = function() {
    Auth.logout();
  };
});


function format(startTime){
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










