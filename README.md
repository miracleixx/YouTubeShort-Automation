# YouTube Shorts Automation System

> End-to-end automation for uploading, titling, and scheduling YouTube Shorts.
> Powered by **Claude AI** + **Playwright** + **YouTube Data API v3**.

---

## Features

| Module | What it does |
|---|---|
| **Input scanner** | Reads `.mp4`/`.mov`/`.mkv` from `./videos`, extracts topic from filename |
| **AI generator** | Claude API → viral titles, SEO descriptions, hashtags |
| **API uploader** | YouTube Data API v3 with quota guard & retry |
| **Browser uploader** | Playwright with human-like typing, mouse jitter, cookie sessions |
| **Queue manager** | Persistent JSON queue: pending → uploading → uploaded / failed |
| **Scheduler** | Cron-based interval uploads (every N hours) |
| **Duplicate detector** | SHA-256 hash prevents re-uploading the same file |
| **Logger** | Winston + daily-rotating log files with error isolation |

---

## Requirements

- **Node.js ≥ 20** (ESM support required)
- **npm ≥ 9**
- A Google account with a YouTube channel
- An [Anthropic API key](https://console.anthropic.com)

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd youtube-shorts-automation
npm install
npx playwright install chromium   # Download Chromium for browser mode
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env with your keys and credentials
node scripts/setup.js   # Validates env, creates directories
```

### 3. Add videos

Drop `.mp4` files into `./videos/`. Use descriptive filenames for better AI titles:

```
videos/
  clip_001_morning_routine.mp4
  clip_002_cooking_pasta.mp4
  my_tutorial_final.mp4
```

### 4. Choose upload mode

#### Mode A — Browser (recommended, no quota limits)

Set in `.env`:
```
UPLOAD_MODE=browser
YOUTUBE_EMAIL=your@gmail.com
YOUTUBE_PASSWORD=yourpassword
```

#### Mode B — YouTube Data API

Set in `.env`:
```
UPLOAD_MODE=api
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
```

Then run the one-time OAuth2 flow:
```bash
node scripts/authenticate.js
# Follow the browser prompt, then copy the tokens into .env
```

### 5. Run

```bash
# Run one batch and exit
npm run start -- --once

# Dry run (see AI output, skip upload)
npm run start -- --dry-run --once

# Run with scheduler (every 2 hours indefinitely)
npm start

# Force API mode
npm run upload:api -- --once

# Force browser mode
npm run upload:browser -- --once
```

---

## CLI Reference

| Flag | Description |
|---|---|
| `--once` | Run one batch and exit (no scheduler loop) |
| `--mode=api\|browser` | Override `UPLOAD_MODE` from `.env` |
| `--status` | Print queue status and exit |
| `--retry` | Reset all failed items to pending, then process |
| `--limit=N` | Max videos to process in this run |
| `--dry-run` | Scan + generate content, skip actual upload |

---

## Project Structure

```
youtube-shorts-automation/
├── src/
│   ├── main.js                  # Orchestrator + CLI entry point
│   ├── input/
│   │   └── videoScanner.js      # Reads videos from disk
│   ├── ai/
│   │   └── contentGenerator.js  # Claude API — titles, descriptions, hashtags
│   ├── upload/
│   │   ├── apiUploader.js       # YouTube Data API v3
│   │   └── browserUploader.js   # Playwright browser automation
│   ├── queue/
│   │   └── queueManager.js      # JSON-persisted upload queue
│   ├── scheduler/
│   │   └── scheduler.js         # node-cron interval scheduler
│   └── utils/
│       ├── configLoader.js      # Merges config.json + .env
│       ├── duplicateDetector.js # SHA-256 file hashing
│       └── logger.js            # Winston + daily rotation
├── config/
│   └── config.json              # Default configuration
├── scripts/
│   ├── authenticate.js          # OAuth2 token flow (API mode)
│   └── setup.js                 # First-run setup checker
├── data/                        # Auto-created at runtime
│   ├── queue.json               # Upload queue state
│   ├── schedule.json            # Scheduler state
│   ├── hashes.json              # Duplicate detection store
│   ├── cookies.json             # Browser session cookies
│   └── quota.json               # Daily API quota tracker
├── videos/                      # Drop your .mp4 files here
├── screenshots/                 # Error screenshots from browser mode
├── logs/                        # Rotating log files
├── .env.example                 # Environment variable template
└── package.json
```

---

## Video Filename Conventions

The AI generator uses the filename as a starting point for content generation:

| Filename | Extracted topic |
|---|---|
| `clip_001_morning_routine.mp4` | "morning routine" |
| `clip_042_cooking_pasta.mp4` | "cooking pasta" |
| `2024-06-01_gym_workout.mp4` | "gym workout" |
| `my_random_video.mp4` | "my random video" |

Use descriptive filenames for the best AI output.

---

## Quota & Rate Limits

### API Mode
- YouTube Data API free tier: **10,000 units/day**
- Each video insert costs **1,600 units** → max **~6 uploads/day**
- The system tracks usage in `data/quota.json` and refuses to exceed the limit
- Set `MAX_UPLOADS_PER_DAY=6` in `.env`

### Browser Mode
- No hard quota — YouTube Studio allows 15+ uploads/session
- The system adds human-like delays between uploads to avoid detection
- Recommended: `DELAY_BETWEEN_UPLOADS_MS=45000` (45 seconds minimum)

---

## Customising AI Output

Edit `config/config.json` → `ai.titleStyle`:

| Style | Description |
|---|---|
| `viral` | Pattern interrupts, curiosity gaps, power words |
| `educational` | Clear, benefit-driven, actionable titles |
| `motivational` | Uplifting, emotional, action-oriented |

---

## Troubleshooting

### Browser login loop
- Delete `data/cookies.json` and re-run — the system will log in fresh
- Check that `YOUTUBE_EMAIL` / `YOUTUBE_PASSWORD` are correct
- Enable `browser.headless=false` in config to watch the browser

### API quota exceeded
- Check `data/quota.json` to see today's usage
- Wait until midnight UTC for the quota to reset
- Switch to `UPLOAD_MODE=browser` for unlimited uploads

### Uploads failing silently
- Check `logs/errors-YYYY-MM-DD.log` for detailed error messages
- Check `screenshots/` for error screenshots (browser mode)
- Run with `--once` for cleaner console output

### AI titles look generic
- Improve your filenames (`clip_001_funny_cat.mp4` → `clip_001_cat_falls_asleep_on_keyboard.mp4`)
- Change `AI_TITLE_STYLE` in `.env`

---

## Security Notes

- Never commit `.env` to version control (it's in `.gitignore`)
- `data/cookies.json` contains active session — treat as sensitive
- Use [Google App Passwords](https://support.google.com/accounts/answer/185833) if 2FA is enabled on your Google account
- API credentials: restrict your OAuth2 client to the YouTube Data API only

---

## License

MIT — use freely, but respect YouTube's Terms of Service.
Do not use this system to upload spam, misleading, or policy-violating content.
