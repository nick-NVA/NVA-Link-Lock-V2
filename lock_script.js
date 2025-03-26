const pinInput = document.getElementById('pinInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');

// --- Helper function to convert ArrayBuffer to Hex String ---
function buf2hex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

// --- Get data from URL hash ---
function getDataFromHash() {
    const hash = window.location.hash.substring(1); // Remove leading '#'
    if (!hash) return null;

    const params = new URLSearchParams(hash);
    const encodedUrl = params.get('url');
    const storedHash = params.get('hash');

    if (!encodedUrl || !storedHash) return null;

    try {
        // Decode the Base64 URL
        const targetUrl = atob(decodeURIComponent(encodedUrl));
        return { targetUrl, storedHash };
    } catch (e) {
        console.error("Error decoding URL from hash:", e);
        return null; // Invalid Base64 or encoding
    }
}

// --- Main Unlock Logic ---
async function unlockUrl() {
    const pageData = getDataFromHash();
    const enteredPin = pinInput.value.trim();

    if (!pageData) {
        errorMessage.textContent = "Invalid or missing lock data in URL.";
        errorMessage.style.display = 'block';
        pinInput.disabled = true; // Disable input if URL is broken
        unlockBtn.disabled = true;
        return;
    }

    if (!enteredPin) {
        errorMessage.textContent = "Please enter the PIN.";
        errorMessage.style.display = 'block';
        return;
    }

    // Hash the entered PIN using the same method (SHA-256)
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(enteredPin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const enteredPinHashHex = buf2hex(hashBuffer);

        // Compare hashes
        if (enteredPinHashHex === pageData.storedHash) {
            // Success! Redirect.
            errorMessage.style.display = 'none';
            // Add slight delay so user sees feedback isn't instant failure
            // You could add a "Redirecting..." message here
            // console.log("Redirecting to:", pageData.targetUrl);
            window.location.href = pageData.targetUrl;
        } else {
            // Failure
            errorMessage.textContent = "Incorrect PIN.";
            errorMessage.style.display = 'block';
            pinInput.value = ''; // Clear the input
            pinInput.focus();
        }
    } catch (error) {
        console.error("Error during unlock:", error);
        errorMessage.textContent = "An error occurred during unlock. Check console.";
        errorMessage.style.display = 'block';
    }
}

// --- Event Listeners ---
unlockBtn.addEventListener('click', unlockUrl);

// Allow pressing Enter in PIN field to unlock
pinInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        unlockBtn.click(); // Trigger button click
    }
});

// --- Initial Check ---
// Check if data exists on load, otherwise show an error early
if (!getDataFromHash()) {
   errorMessage.textContent = "Invalid or missing lock data in URL.";
   errorMessage.style.display = 'block';
   pinInput.disabled = true;
   unlockBtn.disabled = true;
} else {
    pinInput.focus(); // Focus input field on load if URL seems okay
}
