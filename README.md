# Simple Text to Speech Demo

This project provides a minimal example of converting text to speech in the browser. It relies on the Web Speech API and includes a small Node.js server to serve the static files and report a `/status` endpoint.

## Features

- Predefined text in English and Portuguese
- Adjustable speech rate
- Optional download simulation using gTTS (see `download-audio.js`)

## Usage

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser at `http://localhost:3000`.

Use the play button to listen to the text. The download button demonstrates how a backend service could provide an MP3 file.

## Requirements

- Node.js 14+
- Modern browser with Web Speech API support
