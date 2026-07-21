let currentStep = 1;
const totalSteps = 8;

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('stepIndicator').innerText = `Step ${currentStep} of ${totalSteps}`;
    
    // Show/hide steps
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById('step' + i);
        if (i === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
    
    // Button visibility
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = currentStep === totalSteps ? 'block' : 'none';
}

function validateStep(step) {
    const stepEl = document.getElementById('step' + step);
    const inputs = stepEl.querySelectorAll('input[required], select[required]');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#27ae60';
        }
    });
    
    if (!valid) {
        alert('⚠️ Please fill all required fields before proceeding!');
    }
    return valid;
}

function changeStep(direction) {
    if (direction === 1 && !validateStep(currentStep)) {
        return;
    }
    
    currentStep += direction;
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Location (Optional)
function getLocation() {
    if (navigator.geolocation) {
        document.getElementById('location').value = 'Fetching location...';
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('location').value = 
                'Lat: ' + position.coords.latitude.toFixed(4) + ', Long: ' + position.coords.longitude.toFixed(4);
        }, function() {
            document.getElementById('location').value = '';
            alert('Location access denied. You can continue without location.');
        });
    } else {
        alert('Geolocation not supported by your browser.');
    }
}

// Form Submission
document.getElementById('emiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    // Show Loading
    document.querySelector('.main-wrapper').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');

    // Simulate Processing (2.5 seconds)
    setTimeout(function() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('successScreen').classList.remove('hidden');
        
        // Generate Application ID
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                        (today.getMonth()+1).toString().padStart(2, '0') + 
                        today.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const appId = `EMI-${dateStr}-${randomNum}`;
        
        document.getElementById('appId').innerText = appId;
    }, 2500);
});

// Copy ID
function copyId() {
    const id = document.getElementById('appId').innerText;
    navigator.clipboard.writeText(id).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy Application ID'; }, 2000);
    }).catch(() => {
        alert('Application ID: ' + id);
    });
}

// Back to Home
function backToHome() {
    location.reload();
}

// Initialize
updateProgress();