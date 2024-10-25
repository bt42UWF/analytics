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






let params = {
    dateFrom: '10-10-2024',
    dateTo: '10-18-2024'
};

$.ajax({
    url: '/Analytics/OrganizationBreakdown_GET',  // Ensure proper endpoint URL
    type: 'GET',
    data: params,
    success: function(result) {
        console.log('OrganizationBreakdown_GET');
        console.log(result); 

        const labels = result.map(item => item.organization);
        const data = result.map(item => item.userCount);
        
        populatePieChart(labels, data);
    },
    error: function(xhr, status, error) {
        console.error('AJAX Error: ', error);
    }
});
function populatePieChart(labels, data) {
    const ctx = document.getElementById('myPieChart').getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,  // The organization names
            datasets: [{
                data: data,   // The user count data
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' users';
                        }
                    }
                }
            }
        }
    });
}




$(document).ready(function() {
    let params = {
        dateFrom: '10-10-2024',
        dateTo: '10-18-2024'
    };

    $.ajax({
        url: '/Analytics/Logging_GET',  // Replace with your endpoint URL
        type: 'GET',
        data: params,
        success: function(result) {
            console.log('Logging_GET');
            console.log(result); 
            
            // Assuming result.data is an array of objects
            $('#myTable').DataTable({
                data: result.data,  // Adjust this to match your API response structure
                columns: [
                    { "data": "column1" },  // Replace with actual field names from your API response
                    { "data": "column2" },
                    { "data": "column3" }
                ]
            });
        },
        error: function(error) {
            console.log('Error fetching data:', error);
        }
    });
});


$(document).ready(function() {
    let params = {
        dateFrom: '10-10-2024',
        dateTo: '10-18-2024'
    };

    $.ajax({
        url: '/Analytics/Logging_GET',  // Replace with your actual endpoint
        type: 'GET',
        data: params,
        success: function(result) {
            console.log('Logging_GET');
            console.log(result);

            // Assuming your API returns data in the format of an array of actions with their counts
            let labels = [];
            let data = [];

            result.data.forEach(function(item) {
                labels.push(item.action);  // Replace 'action' with the field that contains the label (e.g., action name)
                data.push(item.count);     // Replace 'count' with the field that contains the numeric data
            });

            // Creating the Pie Chart
            var ctx = document.getElementById('myPieChart').getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,  // Labels for the pie chart
                    datasets: [{
                        label: 'Logging Actions', // You can customize the label
                        data: data,  // Data values for each action
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        },
        error: function(error) {
            console.log('Error fetching data:', error);
        }
    });
});


$(document).ready(function() {
    let pieChart;  // Declare the pie chart variable globally
    
    // Function to update the pie chart
    function updateChart(labels, data) {
        var ctx = document.getElementById('myPieChart').getContext('2d');
        
        if (pieChart) {
            pieChart.destroy();  // Destroy the previous chart instance if it exists
        }

        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,  // Labels for the pie chart
                datasets: [{
                    label: 'Logging Actions',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Event listener for dropdown change
    $('#filterDropdown').on('change', function() {
        let filterValue = $(this).val();

        // Update the AJAX call with the filter parameter
        $.ajax({
            url: '/Analytics/Logging_GET',  // Replace with your actual endpoint
            type: 'GET',
            data: {
                dateFrom: '10-10-2024',
                dateTo: '10-18-2024',
                actionType: filterValue  // Send the filter value to the server
            },
            success: function(result) {
                let labels = [];
                let data = [];

                // Process the filtered result
                result.data.forEach(function(item) {
                    labels.push(item.action);  // 'action' from API response
                    data.push(item.count);     // 'count' from API response
                });

                // Update the chart with filtered data
                updateChart(labels, data);
            },
            error: function(error) {
                console.log('Error fetching filtered data:', error);
            }
        });
    });
});


$(document).ready(function() {
    let pieChart, barChart;

    // Function to update Pie Chart
    function updatePieChart(labels, data) {
        var ctx = document.getElementById('myPieChart').getContext('2d');

        // Destroy previous chart instance if it exists
        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Logging Actions',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Function to update Bar Chart
    function updateBarChart(labels, data) {
        var ctx = document.getElementById('myBarChart').getContext('2d');

        // Destroy previous chart instance if it exists
        if (barChart) {
            barChart.destroy();
        }

        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,  // X-axis labels
                datasets: [{
                    label: 'Logging Actions',
                    data: data,     // Data for the bar chart
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true  // Ensures that Y-axis starts at 0
                    }
                }
            }
        });
    }

    // Event listener for the Filter button
    $('#filterButton').on('click', function() {
        let dateFrom = $('#dateFrom').val();
        let dateTo = $('#dateTo').val();

        // Check if both dates are selected
        if (dateFrom && dateTo) {
            // AJAX call to fetch filtered data
            $.ajax({
                url: '/Analytics/Logging_GET',  // Replace with your actual endpoint
                type: 'GET',
                data: {
                    dateFrom: dateFrom,
                    dateTo: dateTo
                },
                success: function(result) {
                    console.log('Filtered Data:', result);

                    let labels = [];
                    let data = [];

                    // Process the filtered result
                    result.data.forEach(function(item) {
                        labels.push(item.action);  // Update labels (like 'Login', 'Logout')
                        data.push(item.count);     // Update data (counts for each action)
                    });

                    // Update both the Pie and Bar Charts
                    updatePieChart(labels, data);
                    updateBarChart(labels, data);
                },
                error: function(error) {
                    console.log('Error fetching data:', error);
                }
            });
        } else {
            alert('Please select both From and To dates.');
        }
    });
});
