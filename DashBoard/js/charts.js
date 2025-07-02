const colorPalette = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', 
    '#9b59b6', '#1abc9c', '#d35400', '#34495e'
];

function updateDashboard() {
    const filteredData = filterData();
    updateSummaryStats(filteredData);
    updatePrimaryVisualization(filteredData);
    updateObesityDistributionChart(filteredData);
    updateCorrelationMatrix(filteredData);
    updateDetailedStats(filteredData);
}

function updateSummaryStats(data) {
    document.getElementById('total-records').textContent = data.length;
    
    if (data.length > 0) {
        const avgAge = data.reduce((sum, item) => sum + item.Age, 0) / data.length;
        document.getElementById('avg-age').textContent = avgAge.toFixed(1);
        
        const avgBMI = data.reduce((sum, item) => sum + item.BMI, 0) / data.length;
        document.getElementById('avg-bmi').textContent = avgBMI.toFixed(1);
        
        const femaleCount = data.filter(item => item.Gender === 'Female').length;
        const femalePct = (femaleCount / data.length * 100).toFixed(1);
        document.getElementById('female-pct').textContent = `${femalePct}%`;
        
        const familyHistoryCount = data.filter(item => item.family_history_with_overweight === 'yes').length;
        const familyHistoryPct = (familyHistoryCount / data.length * 100).toFixed(1);
        document.getElementById('family-history-pct').textContent = `${familyHistoryPct}%`;
        
        const highCaloricCount = data.filter(item => item.high_caloric_food === 'yes').length;
        const highCaloricPct = (highCaloricCount / data.length * 100).toFixed(1);
        document.getElementById('high-caloric-pct').textContent = `${highCaloricPct}%`;
    } else {
        document.getElementById('avg-age').textContent = '0';
        document.getElementById('avg-bmi').textContent = '0';
        document.getElementById('female-pct').textContent = '0%';
        document.getElementById('family-history-pct').textContent = '0%';
        document.getElementById('high-caloric-pct').textContent = '0%';
    }
}

function updatePrimaryVisualization(data) {
    if (data.length === 0) {
        document.getElementById('primary-visualization').innerHTML = 
            '<p>No data available with current filters.</p>';
        return;
    }
    
    const chartType = document.getElementById('primary-chart').value;
    const xVar = document.getElementById('x-axis').value;
    const yVar = document.getElementById('y-axis').value;
    const colorVar = document.getElementById('color-by').value;
    
    document.getElementById('primary-chart-title').textContent = 
        `${xVar} vs. ${yVar} by ${colorVar.replace(/_/g, ' ')}`;
    
    switch(chartType) {
        case 'scatter-plot':
            createScatterPlot(data, xVar, yVar, colorVar);
            break;
        case 'bar-chart':
            createBarChart(data, xVar, yVar, colorVar);
            break;
        case 'pie-chart':
            createPieChart(data, xVar);
            break;
        case 'box-plot':
            createBoxPlot(data, xVar, yVar, colorVar);
            break;
        case 'histogram':
            createHistogram(data, xVar, colorVar);
            break;
        default:
            createBMIDistribution(data);
    }
}

function createScatterPlot(data, xVar, yVar, colorVar) {
    const uniqueValues = [...new Set(data.map(item => item[colorVar]))];
    
    const traces = uniqueValues.map(value => {
        const filteredData = data.filter(item => item[colorVar] === value);
        return {
            x: filteredData.map(item => item[xVar]),
            y: filteredData.map(item => item[yVar]),
            mode: 'markers',
            type: 'scatter',
            name: value,
            marker: {
                color: colorPalette[uniqueValues.indexOf(value) % colorPalette.length],
                size: 10,
                opacity: 0.7
            }
        };
    });
    
    const layout = {
        title: `${xVar} vs. ${yVar} by ${colorVar.replace(/_/g, ' ')}`,
        xaxis: { title: xVar },
        yaxis: { title: yVar },
        legend: { orientation: 'h', y: -0.2 }
    };
    
    Plotly.newPlot('primary-visualization', traces, layout);
}

function createBarChart(data, xVar, yVar, colorVar) {
    const uniqueValues = [...new Set(data.map(item => item[colorVar]))];
    
    const traces = uniqueValues.map(value => {
        const filteredData = data.filter(item => item[colorVar] === value);
        
        const groups = {};
        filteredData.forEach(item => {
            const key = item[xVar];
            if (!groups[key]) {
                groups[key] = { sum: 0, count: 0 };
            }
            groups[key].sum += item[yVar];
            groups[key].count++;
        });
        
        const xValues = Object.keys(groups);
        const yValues = xValues.map(key => groups[key].sum / groups[key].count);
        
        return {
            x: xValues,
            y: yValues,
            type: 'bar',
            name: value,
            marker: {
                color: colorPalette[uniqueValues.indexOf(value) % colorPalette.length]
            }
        };
    });
    
    const layout = {
        title: `Average ${yVar} by ${xVar} and ${colorVar.replace(/_/g, ' ')}`,
        xaxis: { title: xVar },
        yaxis: { title: `Average ${yVar}` },
        barmode: 'group'
    };
    
    Plotly.newPlot('primary-visualization', traces, layout);
}

function createPieChart(data, xVar) {
    const counts = {};
    data.forEach(item => {
        counts[item[xVar]] = (counts[item[xVar]] || 0) + 1;
    });
    
    const trace = {
        values: Object.values(counts),
        labels: Object.keys(counts),
        type: 'pie',
        marker: {
            colors: colorPalette
        }
    };
    
    const layout = {
        title: `Distribution of ${xVar.replace(/_/g, ' ')}`
    };
    
    Plotly.newPlot('primary-visualization', [trace], layout);
}

function createBoxPlot(data, xVar, yVar, colorVar) {
    const uniqueValues = [...new Set(data.map(item => item[colorVar]))];
    
    const traces = uniqueValues.map(value => {
        const filteredData = data.filter(item => item[colorVar] === value);
        return {
            y: filteredData.map(item => item[yVar]),
            x: filteredData.map(item => item[xVar]),
            type: 'box',
            name: value,
            marker: {
                color: colorPalette[uniqueValues.indexOf(value) % colorPalette.length]
            }
        };
    });
    
    const layout = {
        title: `${yVar} Distribution by ${xVar} and ${colorVar.replace(/_/g, ' ')}`,
        xaxis: { title: xVar },
        yaxis: { title: yVar }
    };
    
    Plotly.newPlot('primary-visualization', traces, layout);
}

function createHistogram(data, xVar, colorVar) {
    const uniqueValues = [...new Set(data.map(item => item[colorVar]))];
    
    const traces = uniqueValues.map(value => {
        const filteredData = data.filter(item => item[colorVar] === value);
        return {
            x: filteredData.map(item => item[xVar]),
            type: 'histogram',
            name: value,
            opacity: 0.7,
            marker: {
                color: colorPalette[uniqueValues.indexOf(value) % colorPalette.length]
            }
        };
    });
    
    const layout = {
        title: `Distribution of ${xVar} by ${colorVar.replace(/_/g, ' ')}`,
        xaxis: { title: xVar },
        yaxis: { title: 'Count' },
        barmode: 'overlay'
    };
    
    Plotly.newPlot('primary-visualization', traces, layout);
}

function createBMIDistribution(data) {
    const traces = [];
    const obesityLevels = [...new Set(data.map(item => item.obesity_level))];
    
    obesityLevels.forEach(level => {
        const levelData = data.filter(item => item.obesity_level === level);
        traces.push({
            x: levelData.map(item => item.BMI),
            type: 'histogram',
            name: level,
            opacity: 0.7,
            marker: {
                color: colorPalette[obesityLevels.indexOf(level) % colorPalette.length]
            }
        });
    });
    
    const layout = {
        title: 'BMI Distribution by Obesity Level',
        xaxis: { title: 'BMI' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { orientation: 'h', y: -0.2 }
    };
    
    Plotly.newPlot('primary-visualization', traces, layout);
}

function updateObesityDistributionChart(data) {
    if (data.length === 0) {
        document.getElementById('obesity-distribution').innerHTML = 
            '<p>No data available with current filters.</p>';
        return;
    }
    
    const counts = {};
    data.forEach(item => {
        counts[item.obesity_level] = (counts[item.obesity_level] || 0) + 1;
    });
    
    const trace = {
        values: Object.values(counts),
        labels: Object.keys(counts),
        type: 'pie',
        marker: {
            colors: colorPalette
        },
        textinfo: 'percent+value'
    };
    
    const layout = {
        title: 'Obesity Level Distribution'
    };
    
    Plotly.newPlot('obesity-distribution', [trace], layout);
}

function updateCorrelationMatrix(data) {
    if (data.length === 0) {
        document.getElementById('correlation-matrix').innerHTML = 
            '<p>No data available with current filters.</p>';
        return;
    }
    
    const variables = ['Age', 'Height', 'Weight', 'BMI', 'physical_activity', 'use_vegetables'];
    const matrix = [];
    
    for (let i = 0; i < variables.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < variables.length; j++) {
            if (i === j) {
                matrix[i][j] = 1;
            } else {
                matrix[i][j] = calculateCorrelation(
                    data.map(item => item[variables[i]]),
                    data.map(item => item[variables[j]])
                );
            }
        }
    }
    
    const trace = {
        z: matrix,
        x: variables,
        y: variables,
        type: 'heatmap',
        colorscale: 'RdBu',
        zmin: -1,
        zmax: 1
    };
    
    const layout = {
        title: 'Correlation Matrix',
        annotations: []
    };
    
    for (let i = 0; i < variables.length; i++) {
        for (let j = 0; j < variables.length; j++) {
            layout.annotations.push({
                x: variables[j],
                y: variables[i],
                text: matrix[i][j].toFixed(2),
                font: {
                    color: Math.abs(matrix[i][j]) > 0.5 ? 'white' : 'black'
                },
                showarrow: false
            });
        }
    }
    
    Plotly.newPlot('correlation-matrix', [trace], layout);
}

function updateDetailedStats(data) {
    if (data.length === 0) {
        document.getElementById('detailed-stats').innerHTML = 
            '<p>No data available with current filters.</p>';
        return;
    }
    
    let statsHTML = '<h3>Numeric Variable Statistics</h3><table><tr><th>Variable</th><th>Min</th><th>Max</th><th>Mean</th><th>Median</th><th>Std Dev</th></tr>';
    
    numericColumns.forEach(col => {
        if (col === 'BMI') {
            const values = data.map(item => item.BMI);
            statsHTML += generateStatRow('BMI', values);
        } else {
            const values = data.map(item => item[col]).filter(val => typeof val === 'number');
            if (values.length > 0) {
                statsHTML += generateStatRow(col, values);
            }
        }
    });
    
    statsHTML += '</table>';
    
    statsHTML += '<h3 style="margin-top:20px;">Categorical Variable Distributions</h3>';
    
    ['Gender', 'family_history_with_overweight', 'high_caloric_food'].forEach(col => {
        const counts = {};
        data.forEach(item => {
            counts[item[col]] = (counts[item[col]] || 0) + 1;
        });
        
        statsHTML += `<h4>${col.replace(/_/g, ' ')}</h4><ul>`;
        for (const key in counts) {
            const pct = (counts[key] / data.length * 100).toFixed(1);
            statsHTML += `<li>${key}: ${counts[key]} (${pct}%)</li>`;
        }
        statsHTML += '</ul>';
    });
    
    document.getElementById('detailed-stats').innerHTML = statsHTML;
}