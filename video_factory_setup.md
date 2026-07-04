# Video Factory Setup Guide

Welcome to the **Video Factory**! This guide will walk you through the necessary steps to get your automated video production pipeline up and running.

---

## 1. Install FFmpeg (Required)
The Video Factory uses FFmpeg for all video rendering and audio processing. This MUST be installed and available in your system path.

1.  **Download**: Visit [ffmpeg.org](https://ffmpeg.org/download.html) and download the version for Windows (GYAN.DEV or BtbN builds are recommended).
2.  **Extract**: Extract the zip file (e.g., to `C:\ffmpeg`).
3.  **Add to Path**:
    -   Open **Start Search**, type "env", and select **Edit the system environment variables**.
    -   Click **Environment Variables**.
    -   Under **System variables**, find **Path**, select it, and click **Edit**.
    -   Add a new entry pointing to the `bin` folder (e.g., `C:\ffmpeg\bin`).
4.  **Verify**: Open PowerShell and type `ffmpeg -version`. If it shows version info, you're good!

---

## 2. Google Sheets Configuration
The Factory reads topics from a Google Sheet.

### Create the Sheet
1.  Create a new Google Sheet.
2.  Set up the first row (headers):
    -   **Column A**: `Topic` (e.g., "Why the sky is blue")
    -   **Column B**: `Niche` (e.g., "Facts")
    -   **Column C**: `Status` (Leave blank or set to "Pending")
3.  Add some test data in Columns A and B.

### Google Service Account
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new Project (or select an existing one).
3.  **Enable APIs**: Search for "Google Sheets API" and "Google Drive API" and click **Enable** for both.
4.  **Create Credentials**:
    -   Go to **APIs & Services** > **Credentials**.
    -   Click **+ CREATE CREDENTIALS** > **Service Account**.
    -   Follow the prompts. No specific roles are required just yet.
5.  **Generate Key**:
    -   Select your new Service Account.
    -   Go to the **Keys** tab.
    -   Click **ADD KEY** > **Create new key** > **JSON**.
    -   Save the file as `google-service-account.json`.
6.  **Place the File**: Move this file to your software's `config/` directory.
7.  **Share the Sheet**:
    -   Open your `google-service-account.json`.
    -   Copy the `client_email` address.
    -   Go back to your Google Sheet, click **Share**, and paste the email. Give it **Editor** permissions.

---

## 3. Prepare Assets
The Factory needs background footage and (optional) branding.

### Background Footage
-   Place `.mp4` vertical (9:16) clips in `assets/backgrounds/`.
-   The Factory will pick a random clip from this folder for each video.
-   Ensure clips are at least 60 seconds long for best results.

### Branding (Optional)
-   Place your transparent logo in `assets/branding/logo.png`.
-   This will be used as a watermark in your videos.

---

## 4. Final Steps
1.  **Launch the App**: Go to the **Video Factory** tab.
2.  **Paste Sheet URL**: Copy the full URL of your Google Sheet into the input field.
3.  **Configure AI**: Ensure your Anthropic API key is set in **Settings**.
4.  **Run**: Click **Run Factory** and watch the Production Console!

---

---

## 5. Automated Backgrounds (Pexels)
No background videos? No problem. The Factory can automatically fetch relevant footage for you.

1.  **Get an API Key**: Sign up for a free developer account at [pexels.com/api/](https://www.pexels.com/api/).
2.  **Copy the Key**: Once logged in, go to your **API Key** dashboard and copy the long string.
3.  **Configure the App**:
    -   Go to the **Video Factory** tab in the dashboard.
    -   Find the **Pexels API Key** field in the bottom-left settings.
    -   Paste your key and enable the **Auto-Fetch** toggle.
4.  **How it works**: For every script generated, the AI creates a "visual search query." The bot then searches Pexels for a matching **Vertical (9:16)** video, downloads it, and uses it for your render. The video is also saved to your `assets/backgrounds` folder to build your local library!

---
