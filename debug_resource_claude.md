# YouTube Shorts Automation - Comprehensive Debug Resource

This file is a consolidated technical view of the project, designed to help an AI (like Claude) understand the current state, codebase, and debugging history of the bot.

## 1. Project Overview
- **Goal**: 100% headless, automated YouTube Shorts uploads via Playwright and Electron.
- **Tech Stack**: Playwright (Headless Browser), Electron (UI), Node.js (Engine), Anthropic Claude (AI Content).
- **Core Orchestrator**: `src/engine.mjs`
- **Automation Driver**: `src/upload/browserUploader.js`

## 2. Key Selectors (Studio UI)
The following selectors are used in `src/upload/browserUploader.js` to navigate YouTube Studio:
- **Upload File**: `input[type="file"]`
- **Dialog**: `ytcp-uploads-dialog`
- **Title**: `#title-textarea #textbox`
- **Description**: `#description-textarea #textbox`
- **Not Made for Kids**: `tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]`
- **Next Button**: `ytcp-button#next-button`
- **Visibility Radio (Public)**: `tp-yt-paper-radio-button[name="PUBLIC"]`
- **Final Save/Publish**: `#done-button`

## 3. Major Bugs & Solved Blockers

### A. The Phantom Click Bug (Fixed)
- **Problem**: In headless mode, buttons like "Made for Kids" were below the fold (off-screen). The bot was clicking the empty gray void.
- **Fix**: Implemented `element.scrollIntoView({ block: 'center' })` in the `_humanClick` helper to force every target button to the dead center of the screen before clicking.

### B. The Sticky Footer Bug (Fixed)
- **Problem**: YouTube's floating "Next/Back" bar was overlapping buttons at the bottom of the screen.
- **Fix**: Centering every element vertically via scroll ensures no floating bars (top or bottom) can block the click.

### C. The Upload Stepper Stalling (Fixed)
- **Problem**: The bot would click "Next" too quickly while the page was animating, causing it to miss tabs or get stuck.
- **Fix**: Implement a loop that checks if the *Final Visibility* screen has arrived. If not, it waits 3 seconds and clicks "Next" again, up to 10 retries.

## 4. Current Critical Blocker: "Verify it's you"
- **Incident**: Google occasionally triggers a re-authentication modal mid-upload.
- **Visual Evidence**: [Refer to screenshot: 1774754018183_Nkbio9zBAL_error.png]
- **Symptom**: The screen dims, and a modal titled "Verify it's you" appears. The bot's "Next" button clicks hit the dimmed overlay and fail.
- **Strategy**: 
  - Detect text "Verify it's you" or "confirm it's really you".
  - Attempt to click "Next" within that modal.
  - If it requires a password/phone tap, notify the user to do a one-time headful run.

## 5. Title Fixes
- **Problem**: Titles were being uploaded with `#[NUMBER]` placeholders.
- **Fix**: The `contentGenerator.js` was ignoring the `episode.format` template from `config.json`. Updated the regex to correctly replace `{n}` with the actual episode number consistently.

## 6. How to Debug Further
1. **Logs**: Check `logs/automation-<date>.log` for `verbose` events (Title filled, Audience clicked).
2. **Screenshots**: Automatically saved to `./screenshots` on every failure.
3. **Headful Mode**: Change `browser.headless` to `false` in `config/config.json` to watch the bot work in real-time.

---
### Code Snippet: The "Human Click" Fix
```javascript
  async _humanClick(element) {
    // Force element to center to avoid sticky borders
    await element.evaluate((el) => {
      if (el.scrollIntoView) el.scrollIntoView({ block: 'center', inline: 'center' });
    });
    await sleep(400);
    // ... move mouse to box.x + random offset ...
    await this._page.mouse.click(targetX, targetY);
  }
```
---
