<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FlMVSNZ-7hDq5k79p8aQeOzLxhMvEtcy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Embed on your website (widget only, no white area)

Embed **only the chat button** by using a small iframe fixed to the bottom-right. Replace `YOUR_WIDGET_URL` with your deployed app URL (e.g. `https://your-app.vercel.app`).

```html
<iframe
  src="YOUR_WIDGET_URL"
  style="position: fixed; bottom: 24px; right: 24px; width: 80px; height: 80px; border: none; background: transparent; z-index: 9999;"
  title="Chat"
></iframe>
```

When the chat window opens, it will expand above the button. To avoid clipping on small screens, you can use a larger iframe (e.g. `width: 420px; height: 660px`) so the open chat fits inside; the page background stays transparent so only the widget is visible.
