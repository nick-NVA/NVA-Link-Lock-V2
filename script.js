const targetUrlInput = document.getElementById('targetUrl');
const pinInput = document.getElementById('pin');
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');
const lockedUrlOutput = document.getElementById('lockedUrlOutput');
const copyBtn = document.getElementById('copyBtn');
const copyMessage = document.getElementById('copyMessage');

// --- Helper function to convert ArrayBuffer to Hex String ---
function buf2hex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

// --- Main Generation Logic ---
async function generateLockedUrl() {
    const targetUrl = targetUrlInput.value.trim();
    const pin = pinInput.value.trim();

    if (!targetUrl || !pin) {
        alert('Please enter both a URL and a PIN.');
        return;
    }

    try {
        // 1. Validate URL (basic check)
        new URL(targetUrl);
    } catch (_) {
        alert('Please enter a valid URL (including http:// or https://).');
        return;
    }

    try {
        // 2. Encode the target URL using Base64 (simple obfuscation)
        const encodedUrl = btoa(targetUrl); // Base64 encode

        // 3. Hash the PIN using SHA-256 (more secure than storing plain PIN)
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const pinHashHex = buf2hex(hashBuffer);

        // 4. Construct the locked URL
        // Get the base URL for lock.html (works on localhost and GitHub Pages)
        const lockPageUrl = new URL('lock.html', window.location.href).href;

        // Add encoded URL and PIN hash as hash parameters
        const lockedUrl = `${lockPageUrl}#url=${encodeURIComponent(encodedUrl)}&hash=${pinHashHex}`;

        // 5. Display the result
        lockedUrlOutput.value = lockedUrl;
        resultArea.style.display = 'block';
        copyMessage.style.display = 'none'; // Hide copy message initially

    } catch (error) {
        console.error("Error generating URL:", error);
        alert('An error occurred while generating the URL. Check the console for details.');
    }
}

// --- Event Listeners ---
generateBtn.addEventListener('click', generateLockedUrl);

copyBtn.addEventListener('click', () => {
    lockedUrlOutput.select();
    document.execCommand('copy'); // Note: execCommand is older, but simple for this case
    copyMessage.style.display = 'inline';
    setTimeout(() => {
        copyMessage.style.display = 'none';
    }, 2000); // Hide message after 2 seconds
});

// Allow pressing Enter in PIN field to generate
pinInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        generateBtn.click(); // Trigger button click
    }
});
