# Vercel Deployment Guide

## Prerequisites
- Push the repo to GitHub, GitLab, or Bitbucket.
- Keep `README.md` at the repo root as the main entry guide.
- Make sure `.env` is not committed. Add production values in Vercel instead.

## Required scripts
This project now includes:
- `npm run dev`
- `npm run build`
- `npm run preview`

Vercel uses `npm run build` for production builds.

## Deployment steps
1. Go to Vercel and choose **Add New > Project**.
2. Import the Frill repository.
3. Set the framework preset to **Vite** if Vercel does not auto-detect it.
4. Confirm the build command is `npm run build`.
5. Confirm the output directory is `dist`.
6. Add environment variables from `.env` in the Vercel project settings if needed.
7. Deploy.

## Environment variables
Add these in Vercel if you use them in production:
- `VITE_API_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

If a variable is not needed in production, leave it unset.

## After deploy
- Open the live site.
- Test homepage, products, studio, cart, and checkout.
- Check that admin routes still work.
- If you changed environment variables, redeploy once after updating them.

## Common fixes
- If the build fails, verify `npm run build` works locally first.
- If routes 404 on refresh, add a Vercel SPA rewrite to `index.html`.
- If images or API calls fail, confirm the production environment variables are set.

## Suggested Vercel rewrite
If needed, add a `vercel.json` like this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
