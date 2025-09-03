# Luxe Interiors - Premium Home Interior Design

A modern e-commerce platform for premium home interior design services, built with React, TypeScript, and Supabase.

## 🚀 Live Demo

[Deployed on Netlify](https://your-app-name.netlify.app)

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Secure signup/login with email and phone
- **Product Catalog**: Browse interior design items by categories
- **Shopping Cart**: Add, remove, and manage items
- **Payment Integration**: Razorpay payment gateway
- **Transaction History**: Complete payment tracking
- **Real-time Updates**: Live cart and order status
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Payment**: Razorpay
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MedamoniSharan/luxe-interior.git
   cd luxe-interior
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Netlify Deployment

1. **Connect to GitHub**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `luxe-interior` repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set environment variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-app-name.netlify.app`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project
2. Run database migrations:
   ```bash
   npx supabase db push
   ```
3. Deploy edge functions:
   ```bash
   npx supabase functions deploy
   ```

### Razorpay Setup

1. Create a Razorpay account
2. Get your API keys
3. Set environment variables in Supabase:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Cart, Checkout)
├── lib/               # Utility functions and Supabase config
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── assets/            # Static assets

supabase/
├── functions/         # Edge functions
└── migrations/        # Database migrations
```

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Edge Functions
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🧪 Testing

Run the test scripts to verify payment integration:
```bash
node test-simple-payment.js
node test-complete-payment.js
node test-edge-functions.js
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@luxeinteriors.com or create an issue in this repository.
