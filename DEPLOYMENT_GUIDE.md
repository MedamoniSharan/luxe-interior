# Netlify Deployment Guide

This guide will walk you through deploying your Luxe Interiors application to Netlify.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"

2. **Connect GitHub**
   - Choose GitHub as your Git provider
   - Authorize Netlify to access your repositories
   - Select `luxe-interior` repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Set Environment Variables**
   - Click "Show advanced" → "New variable"
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live!

### Option 2: Manual Deploy

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your project**
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## 🔧 Configuration Files

### netlify.toml
This file configures your Netlify deployment:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects
Handles React Router SPA routing:
```
/*    /index.html   200
```

### public/_headers
Sets security headers and caching:
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## 🌍 Environment Variables

### Required Variables
Set these in Netlify dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Get Supabase Credentials

1. **Go to your Supabase project**
   - Visit [supabase.com](https://supabase.com)
   - Select your project

2. **Get Project URL**
   - Go to Settings → API
   - Copy the Project URL

3. **Get Anon Key**
   - In the same API settings
   - Copy the anon/public key

## 🔄 Continuous Deployment

### Automatic Deploys
- Every push to `main` branch triggers a new deployment
- Pull requests create preview deployments
- Branch deployments are available for testing

### Custom Domain
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## 🐛 Troubleshooting

### Build Failures

**Error: "Build command failed"**
- Check if all dependencies are in `package.json`
- Verify Node.js version (should be 18+)
- Check build logs for specific errors

**Error: "Environment variables not found"**
- Verify environment variables are set in Netlify
- Check variable names (must start with `VITE_`)
- Redeploy after adding variables

### Runtime Errors

**Error: "Supabase connection failed"**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify RLS policies are configured

**Error: "Payment not working"**
- Ensure Supabase edge functions are deployed
- Check Razorpay environment variables in Supabase
- Verify payment gateway configuration

## 📊 Monitoring

### Build Logs
- View build logs in Netlify dashboard
- Check for TypeScript compilation errors
- Monitor build time and performance

### Function Logs
- Supabase edge function logs in Supabase dashboard
- Monitor payment processing and errors
- Track API response times

## 🔒 Security

### Environment Variables
- Never commit `.env` files to Git
- Use Netlify's environment variable system
- Rotate keys regularly

### Headers
- Security headers are configured in `netlify.toml`
- CORS policies are handled by Supabase
- HTTPS is enforced by Netlify

## 📈 Performance

### Optimization
- Assets are cached for 1 year
- Index.html is cached for 0 seconds (always fresh)
- Images are optimized automatically

### Monitoring
- Use Netlify Analytics for performance insights
- Monitor Core Web Vitals
- Track user engagement metrics

## 🆘 Support

### Common Issues
1. **Build fails**: Check Node.js version and dependencies
2. **Environment variables**: Verify names and values
3. **Routing issues**: Check `_redirects` file
4. **Performance**: Optimize images and bundle size

### Resources
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

## 🎉 Success!

Once deployed, your Luxe Interiors application will be live at:
`https://your-app-name.netlify.app`

Remember to:
- Test all functionality after deployment
- Set up monitoring and analytics
- Configure custom domain if needed
- Set up backup and monitoring
