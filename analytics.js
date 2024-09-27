// userAnalytics.js

// DataTables initialization
$(document).ready(function() {
    $('#apiLogsTable').DataTable();
    $('#errorLogsTable').DataTable();
});

// Chart.js: Response Codes Pie Chart
var ctx1 = document.getElementById('responseCodesChart').getContext('2d');
var responseCodesChart = new Chart(ctx1, {
    type: 'pie',
    data: {
        labels: ['Success', 'Not Found', 'Server Error', 'Unauthorized', 'Forbidden'],
        datasets: [{
            label: 'Response Codes',
            data: [28, 17, 43, 7, 5],  // Sample data, replace with actual data if available
            backgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#2196f3', '#ff9800']
        }]
    }
});

// Chart.js: Error Logs Bar Chart
var ctx2 = document.getElementById('errorLogsChart').getContext('2d');
var errorLogsChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Exception 1', 'Exception 2', 'Exception 3', 'Exception 4'], // Sample labels
        datasets: [{
            label: 'Error Logs',
            data: [3, 2, 4, 5],  // Sample data, replace with actual data if available
            backgroundColor: '#42a5f5'
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
});
