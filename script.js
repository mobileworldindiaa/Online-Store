let currentStep = 1;
const totalSteps = 8;

// Page load hone par
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded successfully");
    updateProgress();
    
    // Form submit handler
    const form = document.getElementById('emiForm');
    if (form) {
        console.log("Form found, attaching submit listener");
        form.addEventListener('submit', handleSubmit, false);
    }
});

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById('progressBar');
    const stepIndicator = document.getElementById('stepIndicator');
    
    if (progressBar) progressBar.style.width = progress + '%';
    if (stepIndicator) stepIndicator.innerText = `Step ${currentStep} of ${totalSteps}`;
    
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById('step' + i);
        if (step) {
            if (i === currentStep) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        }
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    if (submitBtn) {
        submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
        submitBtn.disabled = false;
    }
}

function validateStep(step) {
    const stepEl = document.getElementById('step' + step);
    if (!stepEl) return false;
    
    const inputs = stepEl.querySelectorAll('input:not([readonly]), select');
    let valid = true;
    let firstInvalidField = null;
    
    inputs.forEach(input => {
        let isEmpty = false;
        
        if (input.type === 'checkbox') {
            if (!input.checked && step === 8) isEmpty = true;
        } else if (input.type === 'file') {
            if (input.files.length === 0) isEmpty = true;
        } else {
            if (!input.value || input.value.trim() === '') isEmpty = true;
        }
        
        if (isEmpty) {
            valid = false;
            input.style.borderColor = '#e74c3c';
            input.style.backgroundColor = '#ffebee';
            if (!firstInvalidField) firstInvalidField = input;
        } else {
            input.style.borderColor = '#27ae60';
            input.style.backgroundColor = '#fff';
        }
    });
    
    if (!valid) {
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert('⚠️ Please fill all required fields marked with *');
    }
    
    return valid;
}

function changeStep(direction) {
    console.log("Changing step by:", direction);
    
    if (direction === 1) {
        if (!validateStep(currentStep)) {
            console.log("Validation failed");
            return;
        }
    }
    
    currentStep += direction;
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;
    
    console.log("Current step is now:", currentStep);
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getLocation() {
    const locInput = document.getElementById('location');
    if (navigator.geolocation) {
        locInput.value = 'Fetching location...';
        navigator.geolocation.getCurrentPosition(
            function(position) {
                locInput.value = 'Lat: ' + position.coords.latitude.toFixed(4) + 
                                ', Long: ' + position.coords.longitude.toFixed(4);
            },
            function(error) {
                locInput.value = '';
                alert('Location access denied. You can continue without location.');
                console.error("Location error:", error);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        alert('Geolocation not supported by your browser.');
    }
}

function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submit triggered!");
    
    if (!validateStep(currentStep)) {
        console.log("Final validation failed");
        return false;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
    }
    
    console.log("Showing loading screen");
    
    // Hide form, show loading
    const formContainer = document.querySelector('.main-wrapper');
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (formContainer) formContainer.style.display = 'none';
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    
    // Process application
    setTimeout(function() {
        console.log("Generating Application ID");
        
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                        (today.getMonth()+1).toString().padStart(2, '0') + 
                        today.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const appId = `EMI-${dateStr}-${randomNum}`;
        
        const appIdElement = document.getElementById('appId');
        if (appIdElement) appIdElement.innerText = appId;
        
        const loadingScreen2 = document.getElementById('loadingScreen');
        const successScreen = document.getElementById('successScreen');
        
        if (loadingScreen2) loadingScreen2.classList.add('hidden');
        if (successScreen) successScreen.classList.remove('hidden');
        
        console.log("Success! Application ID:", appId);
    }, 2500);
    
    return false;
}

function copyId() {
    const appId = document.getElementById('appId');
    if (!appId) return;
    
    const id = appId.innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(id).then(function() {
            const btn = document.querySelector('.copy-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = '✅ Copied!';
                setTimeout(function() {
                    btn.innerText = originalText;
                }, 2000);
            }
        }).catch(function(err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = id;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Application ID Copied: ' + id);
        });
    } else {
        alert('Application ID: ' + id);
    }
}

function backToHome() {
    location.reload();
}

// Make functions global for onclick handlers
window.changeStep = changeStep;
window.getLocation = getLocation;
window.copyId = copyId;
window.backToHome = backToHome;