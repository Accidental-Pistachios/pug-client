angular.module('pug.map', [])
.controller('MapController', function($scope, $ionicLoading, $compile, $cordovaGeolocation, Auth, userEventsService) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  userEventsService.getAllEvents()
  .then(function(events) {

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var loc = Auth.get() || [position.coords.latitude, position.coords.longitude];
      var centerLatLng = new google.maps.LatLng(loc[0], loc[1]);
      
      var mapOptions = {
        center: centerLatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Create new map with mapOptions specified
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var infoWindow = new google.maps.InfoWindow();
      var marker;

      for (var i = 0; i < events.length; i++) {
        var latLng = new google.maps.LatLng(events[i].latitude, events[i].longitude);

        // Create marker
        marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        // Sets text that popups when marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infoWindow.setContent(events[i].type);
              infoWindow.open($scope.map, marker);
            };
        })(marker, i));
      }

    }, function(error){
      console.log("Could not get location");
    });

  });


  $scope.logout = function() {
    Auth.logout();
  };

});




