// DataTables initialization
$(document).ready(function() {
    $('#apiLogsTable').DataTable();
    $('#errorLogsTable').DataTable();

    // Filter change event
    $('#logType').change(function() {
        var selectedType = $(this).val();
        updatePageContent(selectedType);
    });
});

// Function to update the page content based on selected log type
function updatePageContent(logType) {
    if (logType === 'api') {
        $('#chartTitle1').text('Response Codes');
        $('#chartTitle2').text('Error Logs');
        $('#apiLogsTable').show();
        $('#errorLogsTable').show();
        
        // Update chart data for API Logs
        responseCodesChart.data.labels = ['Success', 'Not Found', 'Server Error', 'Unauthorized', 'Forbidden'];
        responseCodesChart.data.datasets[0].data = [28, 17, 43, 7, 5]; // Example API data
        responseCodesChart.update();

        errorLogsChart.data.labels = ['Exception 1', 'Exception 2', 'Exception 3', 'Exception 4'];
        errorLogsChart.data.datasets[0].data = [3, 2, 4, 5]; // Example API error data
        errorLogsChart.update();
    } else {
        $('#chartTitle1').text('UI Response Codes');
        $('#chartTitle2').text('UI Error Logs');
        $('#apiLogsTable').hide(); // Hide API logs table
        $('#errorLogsTable').hide(); // Hide Error logs table
        
        // Update chart data for UI Logs
        responseCodesChart.data.labels = ['UI Success', 'UI Not Found', 'UI Server Error', 'UI Unauthorized', 'UI Forbidden'];
        responseCodesChart.data.datasets[0].data = [15, 5, 20, 1, 2]; // Example UI data
        responseCodesChart.update();

        errorLogsChart.data.labels = ['UI Exception 1', 'UI Exception 2', 'UI Exception 3', 'UI Exception 4'];
        errorLogsChart.data.datasets[0].data = [1, 3, 2, 4]; // Example UI error data
        errorLogsChart.update();
    }
}

// Chart.js: Response Codes Pie Chart
var ctx1 = document.getElementById('responseCodesChart').getContext('2d');
var responseCodesChart = new Chart(ctx1, {
    type: 'pie',
    data: {
        labels: ['Success', 'Not Found', 'Server Error', 'Unauthorized', 'Forbidden'],
        datasets: [{
            label: 'Response Codes',
            data: [28, 17, 43, 7, 5],
            backgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#2196f3', '#ff9800']
        }]
    }
});

// Chart.js: Error Logs Horizontal Bar Chart
var ctx2 = document.getElementById('errorLogsChart').getContext('2d');
var errorLogsChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Exception 1', 'Exception 2', 'Exception 3', 'Exception 4'],
        datasets: [{
            label: 'Error Logs',
            data: [3, 2, 4, 5],
            backgroundColor: '#42a5f5'
        }]
    },
    options: {
        indexAxis: 'y', // This changes the orientation to horizontal
        scales: {
            x: {
                beginAtZero: true // Ensure x-axis starts at zero
            }
        }
    }
});






$(document).ready(function() {
    // AJAX call to your API
    $.ajax({
        url: 'your-api-endpoint',  // Replace with your API endpoint
        method: 'GET',
        success: function(response) {
            // Assuming response is in format: { labels: ['Label1', 'Label2'], data: [30, 70] }
            var labels = response.labels;
            var data = response.data;

            // Create pie chart
            var ctx = document.getElementById('myPieChart').getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,  // Labels for the pie chart
                    datasets: [{
                        data: data,    // Data for the pie chart
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],  // Optional colors
                    }]
                },
                options: {
                    responsive: true
                }
            });
        },
        error: function(error) {
            console.log('Error fetching data', error);
        }
    });
});

