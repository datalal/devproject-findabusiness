// 3rd Party
const angular = require('angular')

var Clarifai = require('clarifai');

var app = new Clarifai.App(
'NO18sIhXk9nZDkAdVXNPSThzPXPI8wHn78vAncxe',
'c2vHENnTnNj6XdFkXCEWbG1g1oSdBmTqOTO44eP9'
);

// Create a template
const searchTemplate = `
<div ng-controller="searchController">
  <div class="alert alert-success">
    <form>
      <input type="text" placeholder="Business Name" ng-model="bName">  <input type="text" placeholder="Zip Code" ng-model="zip">
      <input type="submit" ng-click="submit()" />
    </form>
    <br/>
<p>{{placeRes.name}}</p>
<p>{{placeRes.formatted_phone_number}}</p>
<p>{{placeRes.formatted_address}}</p>
<p>{{placeRes.types[0]}}</p>
<p ng-repeat="photo in placePhotoArray | limitTo:5"><img class="imgArray" src="{{photo}}">{{photDescArray[$index]}}</p>
  </div>
</div>
`

// Create a module
const searchModule = angular.module('searchModule', [])

// Create and register a controller
const searchController = ($scope) => {


    var mapDiv = document.createElement('div');
    var map = new google.maps.Map(mapDiv);

    var service = new google.maps.places.PlacesService(map);


    $scope.submit = function() {
        $scope.queryString = $scope.bName + ' ' + $scope.zip;
        service.textSearch({
              query: $scope.queryString
            }, function(results) {
              $scope.placeId = results[0].place_id;

    service.getDetails({
        placeId: $scope.placeId
        }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          $scope.placePhotoArray = [];

          $scope.placeRes = place;
          for (var i = 0; i < $scope.placeRes.photos.length; i++) {
            $scope.placePhotoArray.push($scope.placeRes.photos[i].getUrl({
              maxWidth: 500,
              maxHeight: 500
            }))
          };
          console.log($scope.placePhotoArray)
          $scope.$apply();

$scope.photDescArray = [];
        }
      });


    });
for ( var j = 0; j < 5; j++){
    app.models.predict(Clarifai.GENERAL_MODEL, $scope.placePhotoArray[j]).then(
      function(response) {
        console.log(response);
        console.log(response.outputs[0].data.concepts[0].name);
    //  picDesc = response.outputs[0].data.concepts[0].name;
      $scope.photDescArray.push(response.outputs[0].data.concepts[0].name);
      console.log($scope.photDescArray);
      $scope.$apply();
      },
      function(err) {
        console.error(err);
      }
    )
}
}

}

searchModule.controller('searchController', searchController)

// Adding the controller to the DOM
// In your use, it's entirely suitable to have this directly in the index.html.
// It's only contained here for example purposes so a clean index.html is preserved.
const appContainerEl = document.createElement('div')
appContainerEl.innerHTML = searchTemplate
document.body.appendChild(appContainerEl)

// Bootstrapping the Angular app
angular.bootstrap(appContainerEl, ['searchModule'])
