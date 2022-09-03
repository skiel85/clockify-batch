var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    
    $scope.clockifyApiKey = "";

    $scope.process = async function() {
        let url = 'https://api.clockify.me/api/v1/workspaces';
        let response = await fetch(url, {
            headers: {
            'X-Api-Key': $scope.clockifyApiKey
            }
        });
    
        let commits = await response.json(); // read response body and parse as JSON
    
        console.log(commits);
    }

});