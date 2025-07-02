let obesityData = [];
let numericColumns = [];
let categoricalColumns = [];

function loadData(file) {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            obesityData = results.data.filter(item => item.Age);
            
            obesityData.forEach(item => {
                item.BMI = item.Weight / Math.pow(item.Height, 2);
            });
            
            identifyColumnTypes();
            updateVariableDropdowns();
            updateDashboard();
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
            alert("Error loading CSV file. Please check the file format.");
        }
    });
}

function identifyColumnTypes() {
    if (obesityData.length === 0) return;
    
    numericColumns = [];
    categoricalColumns = [];
    
    const firstRow = obesityData[0];
    
    for (const key in firstRow) {
        if (typeof firstRow[key] === 'number') {
            numericColumns.push(key);
        } else {
            categoricalColumns.push(key);
        }
    }
    
    numericColumns = numericColumns.filter(col => !['family_history_with_overweight', 'high_caloric_food'].includes(col));
    categoricalColumns = [...new Set([...categoricalColumns, 'family_history_with_overweight', 'high_caloric_food'])];
}

function updateVariableDropdowns() {
    const xAxisSelect = document.getElementById('x-axis');
    const yAxisSelect = document.getElementById('y-axis');
    const colorBySelect = document.getElementById('color-by');
    
    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';
    colorBySelect.innerHTML = '';
    
    numericColumns.forEach(col => {
        xAxisSelect.add(new Option(col, col));
        yAxisSelect.add(new Option(col, col));
    });
    
    xAxisSelect.add(new Option('BMI', 'BMI'));
    yAxisSelect.add(new Option('BMI', 'BMI'));
    
    categoricalColumns.forEach(col => {
        colorBySelect.add(new Option(col.replace(/_/g, ' '), col));
    });
    
    colorBySelect.add(new Option('Obesity Level', 'obesity_level'));
    colorBySelect.add(new Option('Gender', 'Gender'));
}

function filterData() {
    const ageRange = parseInt(document.getElementById('age-range').value);
    const gender = document.getElementById('gender').value;
    const obesityLevel = document.getElementById('obesity-level').value;
    const familyHistory = document.getElementById('family-history').value;
    
    let filteredData = obesityData.filter(item => item.Age <= ageRange);
    
    if (gender !== 'all') {
        filteredData = filteredData.filter(item => item.Gender === gender);
    }
    
    if (obesityLevel !== 'all') {
        filteredData = filteredData.filter(item => item.obesity_level === obesityLevel);
    }
    
    if (familyHistory !== 'all') {
        filteredData = filteredData.filter(item => 
            item.family_history_with_overweight === (familyHistory === 'yes' ? 'yes' : 'no')
        );
    }
    
    return filteredData;
}