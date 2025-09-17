# Email Templates for Flashcard Frenzy

This directory contains HTML email templates for Supabase authentication emails.

## Templates Included

### 1. `confirm-signup.html`
- **Purpose**: Email confirmation for new user signups
- **When used**: When a user creates a new account
- **Variables**: `{{ .ConfirmationURL }}`, `{{ .Email }}`

### 2. `invite.html`
- **Purpose**: Invitation emails for new users
- **When used**: When inviting users to join the platform
- **Variables**: `{{ .ConfirmationURL }}`, `{{ .Email }}`

### 3. `recovery.html`
- **Purpose**: Password reset emails
- **When used**: When a user requests to reset their password
- **Variables**: `{{ .ConfirmationURL }}`, `{{ .Email }}`

## How to Use with Supabase

1. **Access Supabase Dashboard**
   - Go to your project dashboard
   - Navigate to Authentication > Email Templates

2. **Configure Each Template**
   - Copy the HTML content from each template file
   - Paste into the corresponding template section in Supabase
   - Customize the subject lines as needed

3. **Recommended Subject Lines**
   - **Confirm signup**: "Welcome to Flashcard Frenzy - Please confirm your email"
   - **Invite user**: "You're invited to join Flashcard Frenzy!"
   - **Reset password**: "Reset your Flashcard Frenzy password"

4. **Template Variables**
   - `{{ .ConfirmationURL }}` - The action URL (confirmation/reset/invite link)
   - `{{ .Email }}` - The recipient's email address
   - `{{ .SiteURL }}` - Your site's URL (if needed)

## Customization

- **Colors**: Update the CSS color variables to match your brand
- **Logo**: Replace the emoji logo with your actual logo
- **Content**: Modify the messaging to fit your app's tone
- **Contact Email**: Update `support@flashcardfrenzy.com` to your actual support email

## Features

- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern Styling**: Clean, professional appearance
- 🔒 **Security Notices**: Built-in security messaging
- ⏰ **Expiration Warnings**: Clear expiration time notices
- 🎯 **Action-Oriented**: Clear call-to-action buttons

## Testing

Before enabling user confirmation:
1. Test each template with a real email
2. Verify all links work correctly
3. Check rendering across different email clients
4. Ensure mobile responsiveness

## Supabase Configuration

After uploading templates:
1. Enable email confirmations in Auth settings
2. Set appropriate redirect URLs
3. Configure SMTP settings if using custom provider
4. Test the complete flow from signup to confirmation