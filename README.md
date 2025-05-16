# MedAssist Chatbot & Booking

An AI-powered medical assistant chatbot and appointment scheduler. It helps answer patients's frequently asked questions and quickly books appointments through the booking page.
<br><br>
<div align="center" width="600">
  <img src="https://raw.githubusercontent.com/rbhogal/med-assist-ai/refs/heads/main/public/screenshots/med-assist-chat.png" alt="Med Assist Chat Screenshot" width="600"/>
</div>

### Try Demo: 
https://med-assist-ai.vercel.app/

## ✨ Demo Features

- **ChatGPT-4.1** powered chatbot answering FAQs (via OpenAI API)
- **Appointment Booking Calender** (via Google Calender API)
- **Rate limiting** with Upstash Redis (e.g., 10 requests per 2 hours)

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Backend**: Server Actions / API routes
- **AI**: OpenAI GPT-4.1 API
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **UI Components**: Tailwind CSS + shadcn/ui


## 🗓️ Planned Features
- **Login** using Clerk for user authentication
- **Admin Dashboard** to view patients and update incoming appointments
- **Backend Storage** Right now, I’m just using localStorage and it works totally fine for a simple MVP. But I’m planning to switch to Django + PostgreSQL (mostly because I’m learning Python and want the full-stack practice). That said, if you just want to get something working fast, Django is probably overkill. I’d recommend something like Supabase instead: it gives you a hosted Postgres DB and an auto-generated API so it's super quick to set up.

