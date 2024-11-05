$(document).ready(function() {
    let allData = {};

    // Initial AJAX call to fetch data
    $.ajax({
        url: '/Analytics/AnalyticsLogs_GET',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Store the full data set
            allData.apiLogs = data.apiLogs;
            allData.exceptionLogs = data.exceptionlogs;
            allData.apiCallCount = data.apiCallCount;
            allData.uiCallCount = data.uiCallCount;
            allData.totalCallCount = data.totalCallCount;
            allData.apiErrorRate = data.apiErrorRate;
            allData.uiErrorRate = data.uiErrorRate;
            allData.totalErrorRate = data.totalErrorRate;

            // Initialize components with "All" data
            updateMetrics("all");
            populateDataTables("all");
            updateCharts("all");
        },
        error: function(err) {
            console.error('Error fetching data:', err);
        }
    });

    // Event listener for dropdown changes
    $('#dataFilterDropdown').on('change', function() {
        const filter = $(this).val();
        updateMetrics(filter);
        populateDataTables(filter);
        updateCharts(filter);
    });

    // Function to update metrics
    function updateMetrics(filter) {
        let callCount, errorRate;

        if (filter === "api") {
            callCount = allData.apiCallCount;
            errorRate = allData.apiErrorRate;
        } else if (filter === "ui") {
            callCount = allData.uiCallCount;
            errorRate = allData.uiErrorRate;
        } else {
            callCount = allData.totalCallCount;
            errorRate = allData.totalErrorRate;
        }

        $('#apiCallCountMetric').text(callCount);
        $('#apiErrorRateMetric').text(errorRate + '%');
    }

    // Function to populate DataTables based on filter
    function populateDataTables(filter) {
        const filteredApiLogs = filterDataBySource(allData.apiLogs, filter);
        const filteredExceptionLogs = filterDataBySource(allData.exceptionLogs, filter);

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
    }

    // Function to filter data based on "dataSource" column
    function filterDataBySource(logs, filter) {
        if (filter === "all") return logs;
        if (filter === "api") return logs.filter(log => log.dataSource === "SW.API");
        if (filter === "ui") return logs.filter(log => log.dataSource === "SW.UI");
        return logs;
    }

    // Function to update charts based on filter
    function updateCharts(filter) {
        const filteredApiLogs = filterDataBySource(allData.apiLogs, filter);
        const filteredExceptionLogs = filterDataBySource(allData.exceptionLogs, filter);

        // Prepare data for the API logs response codes pie chart
        const apiResponseCodes = countResponseCodes(filteredApiLogs);
        const apiLabels = Object.keys(apiResponseCodes);
        const apiData = Object.values(apiResponseCodes);

        // API Logs Response Codes Pie Chart
        const apiCtx = document.getElementById('responseCodeChart').getContext('2d');
        new Chart(apiCtx, {
            type: 'pie',
            data: {
                labels: apiLabels,
                datasets: [{
                    label: 'API Response Codes',
                    data: apiData,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: { responsive: true }
        });

        // Prepare data for the Exception logs response codes pie chart
        const exceptionResponseCodes = countResponseCodes(filteredExceptionLogs);
        const exceptionLabels = Object.keys(exceptionResponseCodes);
        const exceptionData = Object.values(exceptionResponseCodes);

        // Exception Logs Response Codes Pie Chart
        const exceptionCtx = document.getElementById('exceptionCodeChart').getContext('2d');
        new Chart(exceptionCtx, {
            type: 'pie',
            data: {
                labels: exceptionLabels,
                datasets: [{
                    label: 'Exception Response Codes',
                    data: exceptionData,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: { responsive: true }
        });
    }

    // Helper function to count response codes
    function countResponseCodes(logs) {
        const responseCodes = {};
        logs.forEach(log => {
            const code = log.responseCode;
            responseCodes[code] = (responseCodes[code] || 0) + 1;
        });
        return responseCodes;
    }
});












$(document).ready(function() {
    let allData = {};

    // Initial AJAX call to fetch data
    $.ajax({
        url: '/Analytics/AnalyticsLogs_GET',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Store the full data set
            allData.apiLogs = data.apiLogs;
            allData.exceptionLogs = data.exceptionlogs;
            allData.apiCallCount = data.apiCallCount;
            allData.uiCallCount = data.uiCallCount;
            allData.totalCallCount = data.totalCallCount;
            allData.apiErrorRate = data.apiErrorRate;
            allData.uiErrorRate = data.uiErrorRate;
            allData.totalErrorRate = data.totalErrorRate;

            // Initialize components with "All" data
            updateMetrics("all");
            populateDataTables("all");
            updateCharts("all");
            updateTitles("all");
        },
        error: function(err) {
            console.error('Error fetching data:', err);
        }
    });

    // Event listener for dropdown changes
    $('#dataFilterDropdown').on('change', function() {
        const filter = $(this).val();
        applyFilters(filter);
    });

    // Event listener for date filtering
    $('#filterByDateButton').on('click', function() {
        const filter = $('#dataFilterDropdown').val(); // Current filter from dropdown
        applyFilters(filter);
    });

    // Function to apply filters
    function applyFilters(dataFilter) {
        const fromDate = $('#dateFrom').val();
        const toDate = $('#dateTo').val();

        // Filter metrics and tables based on selected filter and date range
        const filteredApiLogs = filterDataByDate(allData.apiLogs, dataFilter, fromDate, toDate);
        const filteredExceptionLogs = filterDataByDate(allData.exceptionLogs, dataFilter, fromDate, toDate);

        updateMetrics(dataFilter);
        populateDataTables(dataFilter);
        updateCharts(dataFilter);
        updateTitles(dataFilter);
    }

    // Function to update metrics
    function updateMetrics(filter) {
        let callCount, errorRate;

        if (filter === "api") {
            callCount = allData.apiCallCount;
            errorRate = allData.apiErrorRate;
        } else if (filter === "ui") {
            callCount = allData.uiCallCount;
            errorRate = allData.uiErrorRate;
        } else {
            callCount = allData.totalCallCount;
            errorRate = allData.totalErrorRate;
        }

        $('#apiCallCountMetric').text(callCount);
        $('#apiErrorRateMetric').text(errorRate + '%');
    }

    // Function to populate DataTables based on filter
    function populateDataTables(filter) {
        const filteredApiLogs = filterDataByDate(allData.apiLogs, filter, $('#dateFrom').val(), $('#dateTo').val());
        const filteredExceptionLogs = filterDataByDate(allData.exceptionLogs, filter, $('#dateFrom').val(), $('#dateTo').val());

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
    }

    // Function to filter data based on "dataSource" column
    function filterDataBySource(logs, filter) {
        if (filter === "all") return logs;
        if (filter === "api") return logs.filter(log => log.dataSource === "SpectreWeb.API");
        if (filter === "ui") return logs.filter(log => log.dataSource === "SpectreWeb.UI");
        return logs;
    }

    // Function to update charts based on filter
    function updateCharts(filter) {
        const filteredApiLogs = filterDataByDate(allData.apiLogs, filter, $('#dateFrom').val(), $('#dateTo').val());
        const filteredExceptionLogs = filterDataByDate(allData.exceptionLogs, filter, $('#dateFrom').val(), $('#dateTo').val());

        // Prepare data for the API logs response codes pie chart
        const apiResponseCodes = countResponseCodes(filteredApiLogs);
        const apiLabels = Object.keys(apiResponseCodes);
        const apiData = Object.values(apiResponseCodes);

        // API Logs Response Codes Pie Chart
        const apiCtx = document.getElementById('responseCodeChart').getContext('2d');
        new Chart(apiCtx, {
            type: 'pie',
            data: {
                labels: apiLabels,
                datasets: [{
                    label: 'API Response Codes',
                    data: apiData,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: { responsive: true }
        });

        // Prepare data for the Exception logs response codes pie chart
        const exceptionResponseCodes = countResponseCodes(filteredExceptionLogs);
        const exceptionLabels = Object.keys(exceptionResponseCodes);
        const exceptionData = Object.values(exceptionResponseCodes);

        // Exception Logs Response Codes Pie Chart
        const exceptionCtx = document.getElementById('exceptionCodeChart').getContext('2d');
        new Chart(exceptionCtx, {
            type: 'pie',
            data: {
                labels: exceptionLabels,
                datasets: [{
                    label: 'Exception Response Codes',
                    data: exceptionData,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: { responsive: true }
        });
    }

    // Helper function to count response codes
    function countResponseCodes(logs) {
        const responseCodes = {};
        logs.forEach(log => {
            const code = log.responseCode;
            responseCodes[code] = (responseCodes[code] || 0) + 1;
        });
        return responseCodes;
    }

    // Function to update titles based on filter
    function updateTitles(filter) {
        const titlePrefix = filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1);
        $('#apiLogsTitle').text(`${titlePrefix} API Logs`);
        $('#exceptionLogsTitle').text(`${titlePrefix} Exception Logs`);
    }
});

