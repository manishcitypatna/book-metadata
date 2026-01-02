async function startAutomation() {
    const isbn = document.getElementById('isbnInput').value;
    const consoleBox = document.getElementById('console');
    const outputContent = document.getElementById('outputContent');

    if (!isbn) return alert("Please enter an ISBN");

    // Reset UI
    consoleBox.innerHTML = "";
    outputContent.innerHTML = "<p>Processing...</p>";

    // Function to add logs
    const addLog = (text) => {
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerText = `> ${text}`;
        consoleBox.appendChild(item);
        consoleBox.scrollTop = consoleBox.scrollHeight;
    };

    try {
        addLog(`Initiating request for ISBN: ${isbn}`);
        addLog("Connecting to n8n workflow...");
        
        const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn: isbn })
        });

        addLog("Request received by n8n. Fetching library data...");
        addLog("Extracting commercial specifications...");
        
        const data = await response.json();
        
        addLog("Success! Data parsed.");

        // Build the result table
        let html = `<h4>${data.title || 'Book Title'}</h4>`;
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'title') {
                html += `<div class="data-row">
                            <span class="label">${key.replace(/_/g, ' ')}:</span>
                            <span>${value}</span>
                         </div>`;
            }
        }
        outputContent.innerHTML = html;

    } catch (error) {
        addLog(`ERROR: ${error.message}`);
        outputContent.innerHTML = "<p style='color:red'>Failed to fetch data.</p>";
    }
}