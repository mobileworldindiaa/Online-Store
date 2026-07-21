let currentStep = 1;
const totalSteps = 8;

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('stepIndicator').innerText = `Step ${currentStep} of ${totalSteps}`;
    
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById('step' + i);
        if (step) {
            step.style.display = (i === currentStep) ? 'block' : 'none';
        }
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) prevBtn.style.display = (currentStep === 1) ? 'none' : 'block';
    if (nextBtn) nextBtn.style.display = (currentStep === totalSteps) ? 'none' : 'block';
    if (submitBtn) submitBtn.style.display = (currentStep === totalSteps) ? 'block' : 'none';
}

function changeStep(direction) {
    currentStep += direction;
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;
    updateProgress();
    window.scrollTo(0, 0);
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
            function() {
                locInput.value = '';
                alert('Location access denied.');
            }
        );
    }
}

// SIMPLE SUBMIT FUNCTION - YEH HAI MAIN CODE
function submitForm() {
    console.log("Submit button clicked!");
    
    // Declaration check karein
    const declaration = document.getElementById('declaration');
    if (!declaration || !declaration.checked) {
        alert('⚠️ Please accept the declaration to proceed.');
        return;
    }
    
    // Loading screen dikhayein
    const formContainer = document.querySelector('.main-wrapper');
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (formContainer) formContainer.style.display = 'none';
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    
    console.log("Loading screen shown");
    
    // 2 second baad success screen
    setTimeout(function() {
        // Application ID generate karein
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                        String(today.getMonth() + 1).padStart(2, '0') + 
                        String(today.getDate()).padStart(2, '0');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const appId = 'EMI-' + dateStr + '-' + randomNum;
        
        // Application ID set karein
        const appIdElement = document.getElementById('appId');
        if (appIdElement) appIdElement.innerText = appId;
        
        // Loading hide, success show
        const loadingScreen2 = document.getElementById('loadingScreen');
        const successScreen = document.getElementById('successScreen');
        
        if (loadingScreen2) loadingScreen2.classList.add('hidden');
        if (successScreen) successScreen.classList.remove('hidden');
        
        console.log("Success! Application ID:", appId);
    }, 2000);
}

function copyId() {
    const appId = document.getElementById('appId');
    if (!appId) return;
    
    const id = appId.innerText;
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(id).then(function() {
            const btn = document.querySelector('.copy-btn');
            if (btn) {
                btn.innerText = '✅ Copied!';
                setTimeout(function() {
                    btn.innerText = '📋 Copy Application ID';
                }, 2000);
            }
        }).catch(function() {
            alert('Application ID: ' + id);
        });
    } else {
        alert('Application ID: ' + id);
    }
}

function backToHome() {
    location.reload();
}

// Global functions
window.changeStep = changeStep;
window.getLocation = getLocation;
window.submitForm = submitForm;
window.copyId = copyId;
window.backToHome = backToHome;

// Initialize
updateProgress();