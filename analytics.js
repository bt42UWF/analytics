
<div class="container mt-4">
    <div class="dropdown mb-4">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dataSourceDropdown" data-toggle="dropdown" aria-expanded="false">
            Select Data Source
        </button>
        <ul class="dropdown-menu" aria-labelledby="dataSourceDropdown">
            <li><a class="dropdown-item" href="#" data-source="all">All Logs</a></li>
            <li><a class="dropdown-item" href="#" data-source="SW.API">API Logs</a></li>
            <li><a class="dropdown-item" href="#" data-source="SW.UI">UI Logs</a></li>
        </ul>
    </div>

    <!-- Metric boxes -->
    <div>
        <p>API Call Count: <span id="apiCallCountMetric"></span></p>
        <p>API Error Rate: <span id="apiErrorRateMetric"></span></p>
    </div>

    <!-- Tables and Charts -->
    <table id="apiLogsTable" class="display" width="100%"></table>
    <table id="exceptionLogsTable" class="display" width="100%"></table>
    <canvas id="responseCodeChart" width="400" height="200"></canvas>
    <canvas id="exceptionCodeChart" width="400" height="200"></canvas>
</div>


$(document).ready(function() {
    let apiLogs = [];
    let exceptionLogs = [];
    let selectedDataSource = 'all';
    let apiCallCount = 0;
    let apiErrorRate = 0;
    let uiErrorRate = 0;
    let totalErrorRate = 0;
    let totalCallCount = 0;
    let uiCallCount = 0;

    // Function to initialize data
        function initializeWithData(data) {
            apiLogs = data.apiLogs;
            exceptionLogs = data.exceptionLogs;
            apiCallCount = data.apiCallCount;
            apiErrorRate = data.apiErrorRate;
            uiErrorRate = data.uiErrorRate;
            totalErrorRate = data.totalErrorRate;
            totalCallCount = data.totalCallCount;
            uiCallCount = data.uiCallCount;
    
            // Initialize metric bars with default values
            $('#apiCallCountMetric').text(totalCallCount);
            $('#apiErrorRateMetric').text(totalErrorRate + '%');
            updateTablesAndCharts();
        }
    
        // Function to count response codes
        function countResponseCodes(logs) {
            const responseCodes = {};
            logs.forEach(function(log) {
                const code = log.responseCode;
                responseCodes[code] = (responseCodes[code] || 0) + 1;
            });
            return responseCodes;
        }
    
        // Function to render pie chart
        function renderPieChart(ctx, labels, data, label) {
            if (ctx.chartInstance) ctx.chartInstance.destroy();
            ctx.chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }
    
        // Function to render bar chart
        function renderBarChart(ctx, labels, data, label) {
            if (ctx.chartInstance) ctx.chartInstance.destroy();
            ctx.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }
    
        // Function to update tables and charts based on selected data source
        function updateTablesAndCharts() {
            const filteredApiLogs = selectedDataSource === 'all' ? apiLogs : apiLogs.filter(log => log.dataSource === selectedDataSource);
            const filteredExceptionLogs = selectedDataSource === 'all' ? exceptionLogs : exceptionLogs.filter(log => log.dataSource === selectedDataSource);
    
            $('#apiLogsTable').DataTable({
                data: filteredApiLogs,
                columns: [
                    { title: 'Date', data: 'date' },
                    { title: 'Request', data: 'request' },
                    { title: 'Response Code', data: 'responseCode' },
                    { title: 'Data Source', data: 'dataSource' }
                ],
                destroy: true
            });
    
            $('#exceptionLogsTable').DataTable({
                data: filteredExceptionLogs,
                columns: [
                    { title: 'Date', data: 'date' },
                    { title: 'Exception', data: 'exception' },
                    { title: 'Status', data: 'status' },
                    { title: 'Data Source', data: 'dataSource' }
                ],
                destroy: true
            });
    
            const apiResponseCodes = countResponseCodes(filteredApiLogs);
            renderPieChart(
                document.getElementById('responseCodeChart').getContext('2d'),
                Object.keys(apiResponseCodes),
                Object.values(apiResponseCodes),
                'API Response Codes'
            );
    
            const exceptionResponseCodes = countResponseCodes(filteredExceptionLogs);
            renderBarChart(
                document.getElementById('exceptionCodeChart').getContext('2d'),
                Object.keys(exceptionResponseCodes),
                Object.values(exceptionResponseCodes),
                'Exception Response Codes'
            );
    
            // Update Metric Bars based on selected data source
            if (selectedDataSource === 'all') {
                $('#apiCallCountMetric').text(totalCallCount);
                $('#apiErrorRateMetric').text(totalErrorRate + '%');
            } else if (selectedDataSource === 'SpectreWeb.API') {
                $('#apiCallCountMetric').text(apiCallCount);
                $('#apiErrorRateMetric').text(apiErrorRate + '%');
            } else if (selectedDataSource === 'SpectreWeb.UI') {
                $('#apiCallCountMetric').text(uiCallCount);
                $('#apiErrorRateMetric').text(uiErrorRate + '%');
            }
        }
    
        // AJAX call to fetch data from API
        $.ajax({
            url: '/Analytics/AnalyticsLogs_GET',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                initializeWithData(data);
            },
            error: function(err) {
                console.error('Error fetching data:', err);
            }
        });
    
        // Event listener for dropdown item selection
        $('.dropdown-item').on('click', function(event) {
            event.preventDefault();
            selectedDataSource = $(this).data('source');
            $('#dataSourceDropdown').text($(this).text());
            updateTablesAndCharts();
        });
});
