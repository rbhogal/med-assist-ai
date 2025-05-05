# MedAssist Chatbot Demo

A friendly, AI-powered medical assistant chatbot built with Next.js, OpenAI GPT-4, and Upstash Redis for rate limiting. It helps answer user's frequently asked questions related to a primary care clinic and guides them to book appointments when needed. Can book appointments through the booking page. 

## ✨ Features

- GPT-4 powered chatbot answering FAQs (via OpenAI API)
- Appointment Booking Calender (via Google Calender API)
- **Rate limiting** with Upstash Redis (e.g., 10 requests per 2 hours)

## 📦 Tech Stack

- **Frontend**: Next.js
- **Backend**: Server Actions / API routes
- **AI**: OpenAI GPT-4 API
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **UI Components**: Tailwind CSS + shadcn/ui


## 🗓️ Planned Features
- **Login** using Clerk for user authentication
- **Admin Dashboard** to view patients and update incoming appointments
- Store chat and appointment history using a Django Backend with PostgresSQL

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/medassist-chatbot.git
cd medassist-chatbot
