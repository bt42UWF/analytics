$(document).ready(function() {
    let allApiLogs = [];
    let allUiLogs = [];
    let apiCallCount = 0;
    let uiCallCount = 0;
    let apiErrorRate = 0;
    let uiErrorRate = 0;

    // Initial AJAX call to fetch data
    $.ajax({
        url: '/YourEndpoint/AnalyticsLogs_GET',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            apiLogs = data.apiLogs
            exceptionLogs = data.exception
            apiCallCount = data.apiCallCount;
            apiErrorRate = data.apiErrorRate;
            uiErrorRate = data.uiErrorRate;
            totalErrorRate = data.totalErrorRate;
            totalCallCount = data.totalCallCount
            uiCallCount = data.uiCallCou

            // Initially display all logs
            updateDisplay('all');
        },
        error: function(err) {
            console.error('Error fetching data:', err);
        }
    });

    // Dropdown event listener to filter logs based on selection
    $('#logFilterDropdown').on('change', function() {
        updateDisplay($(this).val());
    });

    // Date picker event listeners
    $('#fromDate, #toDate').on('change', function() {
        updateDisplay($('#logFilterDropdown').val());
    });

    // Function to update display based on selected filter
    function updateDisplay(filter) {
        const fromDate = new Date($('#fromDate').val());
        const toDate = new Date($('#toDate').val());
        toDate.setHours(23, 59, 59, 999); // Set to end of the day

        let logsToDisplay;
        let exceptionsToDisplay;
        let callCount;
        let errorRate;
        let titleSuffix;

        switch (filter) {
            case 'api':
                logsToDisplay = filterLogsByDate(allApiLogs, fromDate, toDate);
                exceptionsToDisplay = filterLogsByDate(allApiLogs, fromDate, toDate);
                callCount = apiCallCount; // Adjust as necessary
                errorRate = apiErrorRate; // Adjust as necessary
                titleSuffix = "API Logs";
                break;
            case 'ui':
                logsToDisplay = filterLogsByDate(allUiLogs, fromDate, toDate);
                exceptionsToDisplay = filterLogsByDate(allUiLogs, fromDate, toDate);
                callCount = uiCallCount; // Adjust as necessary
                errorRate = uiErrorRate; // Adjust as necessary
                titleSuffix = "UI Logs";
                break;
            default:
                logsToDisplay = filterLogsByDate(allApiLogs.concat(allUiLogs), fromDate, toDate);
                exceptionsToDisplay = filterLogsByDate(allApiLogs.concat(allUiLogs), fromDate, toDate);
                callCount = apiCallCount + uiCallCount; // Adjust as necessary
                errorRate = ((apiErrorRate + uiErrorRate) / 2).toFixed(2); // Adjust as necessary
                titleSuffix = "All Logs";
        }

        // Update table and chart titles
        $('#apiLogsTableTitle').text(titleSuffix + " Table");
        $('#exceptionLogsTableTitle').text(titleSuffix + " Exceptions Table");
        $('#apiResponsePieChartTitle').text(titleSuffix + " Response Codes");
        $('#exceptionResponsePieChartTitle').text(titleSuffix + " Exceptions Response Codes");

        // Update tables, charts, and metrics
        populateDataTables(logsToDisplay, exceptionsToDisplay);
        populatePieCharts(logsToDisplay, exceptionsToDisplay);
        updateMetricBoxes(callCount, errorRate);
    }

    function filterLogsByDate(logs, fromDate, toDate) {
        return logs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= fromDate && logDate <= toDate;
        });
    }

    function populateDataTables(apiLogs, uiLogs) {
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

        $('#exceptionLogsTable').DataTable({
            data: uiLogs,
            columns: [
                { title: 'Date', data: 'date' },
                { title: 'Exception', data: 'exception' },
                { title: 'Status', data: 'status' },
                { title: 'Data Source', data: 'dataSource' }
            ],
            destroy: true
        });
    }

    function populatePieCharts(apiLogs, apiExceptions) {
        const apiResponseCodes = countResponseCodes(apiLogs);
        const exceptionResponseCodes = countResponseCodes(apiExceptions);

        new Chart(document.getElementById('apiResponsePieChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(apiResponseCodes),
                datasets: [{
                    data: Object.values(apiResponseCodes),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            }
        });

        new Chart(document.getElementById('exceptionResponsePieChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(exceptionResponseCodes),
                datasets: [{
                    data: Object.values(exceptionResponseCodes),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            }
        });
    }

    function countResponseCodes(logs) {
        const responseCodes = {};
        logs.forEach(log => {
            responseCodes[log.responseCode] = (responseCodes[log.responseCode] || 0) + 1;
        });
        return responseCodes;
    }

    function updateMetricBoxes(callCount, errorRate) {
        $('#apiCallCountMetric').text(callCount);
        $('#apiErrorRateMetric').text(errorRate + '%');
    }
});
