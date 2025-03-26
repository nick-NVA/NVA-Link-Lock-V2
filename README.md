# Simple URL Locker (Client-Side)

This is a basic static website that allows you to create a "locked" URL. You provide a target website URL and a PIN. It generates a new link. When someone visits this new link, they must enter the correct PIN to be redirected to the original target URL.

**Demo:** You can deploy this yourself on GitHub Pages (see below).

## How it Works

1.  **Generator (`index.html`):**
    *   Takes the target URL and a PIN as input.
    *   The target URL is encoded using Base64 (this is easily reversible).
    *   The PIN is hashed using the secure SHA-256 algorithm. The original PIN is *not* stored.
    *   A new URL is created pointing to `lock.html`. The Base64-encoded URL and the SHA-256 hash of the PIN are embedded in the URL's hash fragment (`#`).
2.  **Locker (`lock.html`):**
    *   Extracts the encoded URL and the stored PIN hash from the URL's hash fragment.
    *   Asks the visitor to enter a PIN.
    *   Hashes the entered PIN using SHA-256.
    *   Compares the hash of the entered PIN with the stored hash from the URL.
    *   If the hashes match, it decodes the Base64 URL and redirects the visitor.
    *   If the hashes don't match, it shows an error message.

## Security Warning ⚠️

*   **CLIENT-SIDE ONLY:** All encoding, decoding, hashing, and comparison happens in the visitor's web browser using JavaScript.
*   **NOT TRULY SECURE:** This method provides only basic obfuscation, not strong security.
    *   The target URL is only Base64 encoded and can be easily decoded by anyone inspecting the generated locked URL.
    *   The *hash* of the PIN is visible in the locked URL. While this is much better than storing the plain PIN, it could potentially be vulnerable to brute-force or dictionary attacks if a weak PIN is used.
    *   The JavaScript code containing the unlocking logic is visible to anyone.
*   **DO NOT USE FOR SENSITIVE INFORMATION.** This is more suitable for casually sharing links where you just want a minor barrier to entry.

## How to Deploy on GitHub Pages

1.  **Create a GitHub Repository:** Create a new public repository on GitHub (e.g., `url-locker`).
2.  **Upload Files:** Upload `index.html`, `lock.html`, `style.css`, `script.js`, and `lock_script.js` to the root of your repository.
3.  **Enable GitHub Pages:**
    *   Go to your repository on GitHub.
    *   Click on the "Settings" tab.
    *   Scroll down to the "GitHub Pages" section (or click "Pages" in the left sidebar).
    *   Under "Source", select the branch you uploaded your files to (e.g., `main` or `master`).
    *   Keep the folder as `/ (root)`.
    *   Click "Save".
4.  **Wait:** It might take a minute or two for GitHub to build and deploy your site. The page will refresh, and you'll see a URL like `https://<your-username>.github.io/<repository-name>/`.
5.  **Use:** Visit the provided URL (which will load `index.html`) to start generating locked links.

## Usage

1.  Go to the deployed `index.html` page.
2.  Enter the full URL you want to lock (e.g., `https://www.google.com`).
3.  Enter a PIN.
4.  Click "Generate Locked URL".
5.  Copy the generated URL and send it to someone.
6.  When they visit the link, they will be prompted to enter the PIN on the `lock.html` page to proceed.
