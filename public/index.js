var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    
    $scope.clockifyApiKey = "";

    $scope.testConnectionResult = ""

    $scope.testConnection = async function() {
        $scope.testConnectionResult = ""

        let url = 'https://api.clockify.me/api/v1/workspaces';
        
        let response = await fetch(url, {
            headers: {
            'X-Api-Key': $scope.clockifyApiKey
            }
        });

        if(response.ok) {
            let commits = await response.json(); // read response body and parse as JSON
        
            console.log(commits);
            $scope.testConnectionResult = "🟢 OK"
        }
        else {
            $scope.testConnectionResult = "🔴 ERROR: " + response.status
            console.error(response)
        }

        $scope.$apply()
    }

    $scope.process = async function() {

    }

});