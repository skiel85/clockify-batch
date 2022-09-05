var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    
    $scope.clockifyApiKey = "";

    $scope.testConnectionResult = ""

    $scope.ranges = []

    $scope.startHour = "10"
    $scope.startMinute = "00"
    $scope.endHour = "18"
    $scope.endMinute = "00"

    $scope.workspaces = []

    $scope.step = 0
    $scope.procesando = false

    $scope.testConnection = async function() {
        if(!$scope.clockifyApiKey) { return }
        $scope.testConnectionResult = ""

        let url = 'https://api.clockify.me/api/v1/user'
        
        let response = await fetch(url, {
            headers: {
                'X-Api-Key': $scope.clockifyApiKey
            }
        });

        if(response.ok) {
            let parsedResult = await response.json()
            console.log(parsedResult)
            $scope.testConnectionResult = "🟢 Hola " + parsedResult.name + "."
        }
        else {
            $scope.testConnectionResult = "🔴 ERROR: " + response.status
            console.error(response)
        }

        $scope.$apply()
    }

    $scope.loadWorkspaces = async function() {
        $scope.workspaces = []
        $scope.projects = []
        $scope.tasks = []

        let url = 'https://api.clockify.me/api/v1/workspaces'
        
        let response = await fetch(url, {
            headers: {
                'X-Api-Key': $scope.clockifyApiKey
            }
        });

        if(response.ok) {
            let parsedResult = await response.json()
            console.log(parsedResult)
            $scope.workspaces = parsedResult
        }
        else {
            console.error(response)
        }

        $scope.$apply()
    }

    $scope.loadProjects = async function() {
        $scope.projects = []
        $scope.tasks = []

        let url = 'https://api.clockify.me/api/v1/workspaces/' + $scope.workspaceId + "/projects"
        
        let response = await fetch(url, {
            headers: {
                'X-Api-Key': $scope.clockifyApiKey
            }
        });

        if(response.ok) {
            let parsedResult = await response.json()
            console.log(parsedResult)
            $scope.projects = parsedResult.filter(x => !x.archived)
        }
        else {
            console.error(response)
        }

        $scope.$apply()
    }

    $scope.loadTasks = async function() {
        $scope.tasks = []

        let url = 'https://api.clockify.me/api/v1/workspaces/' + $scope.workspaceId + "/projects/" + $scope.projectId + "/tasks"
        
        let response = await fetch(url, {
            headers: {
                'X-Api-Key': $scope.clockifyApiKey
            }
        });

        if(response.ok) {
            let parsedResult = await response.json()
            console.log(parsedResult)
            $scope.tasks = parsedResult.filter(x => !x.archived)
        }
        else {
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
        
        $scope.step = 1
    }
    
    $scope.process = async function() {
        $scope.procesando = true

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

        let url = 'https://api.clockify.me/api/v1/workspaces/'+$scope.workspaceId+'/time-entries'

        for(let i = 0; i < $scope.ranges.length; i++) {
            let range = $scope.ranges[i]

            if(range.selected) {
                console.log("Registrando: " + range.start + " - " + range.end + "...")

                await delay(1000)
    
                let response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Key': $scope.clockifyApiKey
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        "start": range.start,
                        "billable": "true",
                        "description": "",
                        "projectId": $scope.projectId,
                        "taskId": $scope.taskId,
                        "end": range.end
                    })
                });
    
                if(response.ok) {
                    let parsedResult = await response.json()
                    console.log(parsedResult)
                    range.result = "🟢 OK"
                }
                else {
                    range.result = "🔴 ERROR: " + response.status
                    console.error(response)
                }
                $scope.$apply()
            }
        }

        $scope.procesando = false
        $scope.$apply()
    }

});