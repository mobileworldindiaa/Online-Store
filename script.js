// Location Fetch
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('location').value = 
                "Lat: " + position.coords.latitude.toFixed(4) + ", Long: " + position.coords.longitude.toFixed(4);
        }, function() {
            alert("Location permission denied!");
        });
    }
}

// Form Submission
document.getElementById('emiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show Loading
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');

    // Simulate Processing (2 seconds)
    setTimeout(function() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('successScreen').classList.remove('hidden');
        
        // Generate Application ID (EMI-YYYYMMDD-XXXXXX)
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                        (today.getMonth()+1).toString().padStart(2, '0') + 
                        today.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const appId = `EMI-${dateStr}-${randomNum}`;
        
        document.getElementById('appId').innerText = appId;
    }, 2000);
});

// Copy ID
function copyId() {
    const id = document.getElementById('appId').innerText;
    navigator.clipboard.writeText(id).then(() => {
        alert("Application ID Copied: " + id);
    });
}

// Download Receipt
function downloadReceipt() {
    const appId = document.getElementById('appId').innerText;
    const name = document.getElementById('fullName').value;
    const product = document.getElementById('productName').value;
    const emi = document.getElementById('emiPlan').value;
    
    const receiptContent = `
        ====================================
           EMI APPLICATION RECEIPT
        ====================================
        Application ID : ${appId}
        Date           : ${new Date().toLocaleString()}
        
        Customer Name  : ${name}
        Product        : ${product}
        EMI Plan       : ${emi}
        
        Status         : SUBMITTED SUCCESSFULLY
        ====================================
        Thank you for your application!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${appId}.txt`;
    a.click();
}

// Back to Home
function backToHome() {
    location.reload();
}