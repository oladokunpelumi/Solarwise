# ☀️ SolarWise

**SolarWise** is a smart, easy-to-use solar system sizing platform designed for homeowners, businesses, and installers. It takes the guesswork out of going solar by calculating your daily energy needs, analyzing local sunlight data, and recommending tailored solar systems (Off-Grid, Hybrid, and Budget options) in seconds.

## ✨ Features

- **Appliance Calculator:** Select from 30+ preset appliances across 7 categories or add custom devices with specific wattages and daily usage.
- **Global Coverage:** Built-in solar irradiation data (Peak Sun Hours) for 55+ major cities worldwide, with extensive coverage for Africa and emerging markets.
- **Instant System Design:** The robust engineering engine sizes out 3 types of systems based on your unique load profile:
  - **Off-Grid System:** For complete energy independence.
  - **Hybrid System:** Optimal mix of solar and grid backup.
  - **Budget Starter:** An affordable entry point for essential backup.
- **Detailed Component Specs:** Get exact sizing requirements for solar panels, batteries, inverters, and charge controllers.
- **System Comparison:** Side-by-side comparison table of all system designs to help users make informed decisions.
- **Lead Generation:** Integrated form to connect users with certified solar installers in their area.
- **Premium UI/UX:** Built with a stunning bespoke dark theme, dynamic glassmorphism aesthetics, and smooth micro-animations. Fully responsive for mobile, tablet, and desktop.

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React
- **Styling:** Vanilla CSS & CSS Modules (custom design system, no external UI libraries)
- **Backend:** Next.js API Routes (`/api/calculate`, `/api/appliances`, `/api/lead`)
- **Deployment:** Optimized for Vercel

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/oladokunpelumi/Solarwise.git
cd Solarwise
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## 📁 Project Structure

- `app/`: Next.js App Router root containing all pages (`/`, `/calculator`, `/results`) and API routes.
- `lib/`: Core engineering logic and static data.
  - `solarCalculations.js`: The 8-step algorithm that calculates energy load and sizes panels, batteries, and inverters.
  - `solarData.js`: Dataset mapping global cities to average daily Peak Sun Hours.
  - `appliancePresets.js`: Database of common home and office appliances.
