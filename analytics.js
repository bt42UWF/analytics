
$(document).ready(function() {
    // Initial AJAX call to fetch data from your API
    $.ajax({
        url: '/Analytics/AnalyticsLogs_GET',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Use data from the API response
            const apiData = {
                apiLogs: data.apiLogs,
                exceptionLogs: data.exceptionLogs,
                apiCallCount: data.apiCallCount,
                apiErrorRate: data.apiErrorRate,
                uiErrorRate: data.uiErrorRate,
                totalErrorRate: data.totalErrorRate,
                totalCallCount: data.totalCallCount,
                uiCallCount: data.uiCallCount
            };

            // Initialize DataTables, metrics, and charts with fetched data
            initializeWithData(apiData);

            // Create initial charts
            responseCodeChart = createPieChart(responseCodeChartCtx, getCounts(apiData.apiLogs, 'responseCode'));
            exceptionCodeChart = createBarChart(exceptionCodeChartCtx, getCounts(apiData.exceptionLogs, 'exception'));

            // Dropdown event listener
            $('.dropdown-item').on('click', function(event) {
                event.preventDefault();
                const selectedDataSource = $(this).data('source');
                $('#dataSourceDropdown').text($(this).text());

                // Update metrics, DataTables, and charts based on selection
                updateMetricBars(selectedDataSource, apiData);
                updateCharts(selectedDataSource, apiData);

                // Filter DataTable by selected data source
                $('#apiLogsTable').DataTable().column(3).search(selectedDataSource).draw();
                $('#exceptionLogsTable').DataTable().column(3).search(selectedDataSource).draw();
            });
        },

    });

    // Function to initialize DataTables and metrics
    function initializeWithData(apiData) {

        // Set default metric values
        $('#apiCallCountMetric').text(totalCallCount);
        $('#apiErrorRateMetric').text(totalErrorRate + '%');

        // Initialize API Logs DataTable
        $('#apiLogsTable').DataTable({
            data: apiLogs,
            columns: [
                { title: 'Date', data: 'date' },
                { title: 'Request', data: 'request' },
                { title: 'Response Code', data: 'responseCode' },
                { title: 'Data Source', data: 'dataSource' }
            ],
            destroy: true
        });

        // Initialize Exception Logs DataTable
        $('#exceptionLogsTable').DataTable({
            data: exceptionLogs,
            columns: [
                { title: 'Date', data: 'date' },
                { title: 'Exception', data: 'exception' },
                { title: 'Response Code', data: 'responseCode' },
                { title: 'Data Source', data: 'dataSource' }
            ],
            destroy: true
        });
    }

    // Initialize with mock data instead of AJAX call
    initializeWithData(apiData);

    // Chart initialization
    const responseCodeChartCtx = document.getElementById('responseCodeChart').getContext('2d');
    const exceptionCodeChartCtx = document.getElementById('exceptionCodeChart').getContext('2d');

    let responseCodeChart = createPieChart(responseCodeChartCtx, getCounts(apiData.apiLogs, 'responseCode'));
    let exceptionCodeChart = createBarChart(exceptionCodeChartCtx, getCounts(apiData.exceptionLogs, 'exception'));

    function createPieChart(ctx, data) {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: { responsive: true }
        });
    }

    function createBarChart(ctx, data) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: '#36a2eb'
                }]
            },
            options: { responsive: true }
        });
    }

    // Helper to count occurrences by key
    function getCounts(data, key) {
        return data.reduce((acc, item) => {
            acc[item[key]] = (acc[item[key]] || 0) + 1;
            return acc;
        }, {});
    }

    // Function to update charts
    function updateCharts(selectedSource) {
        const filteredApiLogs = selectedSource ? apiData.apiLogs.filter(log => log.dataSource === selectedSource) : apiData.apiLogs;
        const filteredExceptionLogs = selectedSource ? apiData.exceptionLogs.filter(log => log.dataSource === selectedSource) : apiData.exceptionLogs;

        // Update response code pie chart
        const apiResponseCounts = getCounts(filteredApiLogs, 'responseCode');
        responseCodeChart.data.labels = Object.keys(apiResponseCounts);
        responseCodeChart.data.datasets[0].data = Object.values(apiResponseCounts);
        responseCodeChart.update();

        // Update exception bar chart
        const exceptionCounts = getCounts(filteredExceptionLogs, 'exception');
        exceptionCodeChart.data.labels = Object.keys(exceptionCounts);
        exceptionCodeChart.data.datasets[0].data = Object.values(exceptionCounts);
        exceptionCodeChart.update();
    }

    // Update metric bars
    function updateMetricBars(selectedSource) {
        if (selectedSource === "") { // All logs
            $('#apiCallCountMetric').text(apiData.totalCallCount);
            $('#apiErrorRateMetric').text(apiData.totalErrorRate + '%');
        } else if (selectedSource === 'SpectreWeb.API') { // API logs
            $('#apiCallCountMetric').text(apiData.apiCallCount);
            $('#apiErrorRateMetric').text(apiData.apiErrorRate + '%');
        } else if (selectedSource === 'SpectreWeb.UI') { // UI logs
            $('#apiCallCountMetric').text(apiData.uiCallCount);
            $('#apiErrorRateMetric').text(apiData.uiErrorRate + '%');
        }
    }

  
});
