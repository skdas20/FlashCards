# 🎯 Flashcard Frenzy

A real-time multiplayer flashcard game built with Next.js, Supabase, and MongoDB.

## 🚀 Features

- **Multiplayer Gameplay**: Real-time synchronization between players
- **Room-based System**: Create or join game rooms with unique codes
- **User Authentication**: Secure login/signup with Supabase
- **Score Tracking**: Live scoring and game history
- **Responsive Design**: Works on desktop and mobile
- **Professional Email Templates**: Beautiful confirmation emails

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (game history), Supabase (auth)
- **Real-time**: Supabase Realtime
- **Deployment**: Render

## 🎮 How to Play

1. **Create Account**: Sign up or play as guest
2. **Create/Join Room**: Generate a room code or join existing room
3. **Answer Questions**: Race to answer flashcard questions correctly
4. **Score Points**: Earn points for correct answers
5. **View History**: Check your past game results

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/skdas20/FlashCards.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🚀 Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically from main branch

### Environment Setup

- **Node Version**: 18.x or higher
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## 📧 Email Templates

Professional email templates are included in `/email-templates/`:

- `confirm-signup.html` - Account confirmation
- `invite.html` - User invitations
- `recovery.html` - Password reset

Copy these to your Supabase dashboard under Authentication > Email Templates.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── game/          # Game room pages
│   └── history/       # Game history
├── components/        # React components
├── lib/              # Utilities and configurations
└── data/             # Static data (flashcards)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Live Demo**: [Coming Soon on Render]

**Repository**: https://github.com/skdas20/FlashCards