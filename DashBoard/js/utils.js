function generateStatRow(name, values) {
    if (values.length === 0) return '';
    
    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    
    const sorted = [...values].sort((a, b) => a - b);
    const median = (sorted.length % 2 === 0) 
        ? ((sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2).toFixed(2)
        : sorted[Math.floor(sorted.length/2)].toFixed(2);
        
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(val => Math.pow(val - avg, 2));
    const stdDev = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    
    return `<tr>
        <td>${name}</td>
        <td>${min}</td>
        <td>${max}</td>
        <td>${mean}</td>
        <td>${median}</td>
        <td>${stdDev}</td>
    </tr>`;
}

function calculateCorrelation(x, y) {
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0;
    let sumX2 = 0, sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
    }
    
    const numerator = sumXY - (sumX * sumY / n);
    const denominator = Math.sqrt((sumX2 - sumX*sumX/n) * (sumY2 - sumY*sumY/n));
    
    return denominator === 0 ? 0 : numerator / denominator;
}