var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    
    $scope.clockifyApiKey = "";

    $scope.testConnectionResult = ""

    $scope.ranges = []

    $scope.startHour = "10"
    $scope.startMinute = "00"
    $scope.endHour = "18"
    $scope.endMinute = "00"

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

    $scope.generateRanges = async function() {
        let exceptDays = []

        let startDate = new Date()
        startDate.setUTCHours(0)
        startDate.setUTCMinutes(0)
        startDate.setDate(1)
        startDate.setMonth(startDate.getMonth() - 1)
        
        let daysInMonth = new Date(startDate.getYear() + 1900, startDate.getMonth(), 0).getDate();
        
        $scope.ranges = []
        for(let i = 1; i <= daysInMonth; i++) {
            let date = new Date(startDate.getYear() + 1900, startDate.getMonth(), i)
            let start = new Date(date); start.setHours($scope.startHour); start.setMinutes($scope.startMinute)
            let end = new Date(date); end.setHours($scope.endHour); end.setMinutes($scope.endMinute)
            let range = { selected: true, start: start.toISOString(), end: end.toISOString() }
            if(date.getDay() == 6 || date.getDay() == 0) { range.selected = false }
            if(exceptDays.indexOf(date.getDate()) !== -1) { range.selected = false }
            $scope.ranges.push(range)
        }
        
        $scope.ranges.forEach(range => console.log(range.start + " - " + range.end))   
    }
    
    $scope.process = async function() {


    }

});