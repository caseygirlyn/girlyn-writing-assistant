# GirlynEmailAssistant

An AI-powered professional email writing and refining tool designed to humanize tone, correct grammar, and ensure originality. Powered by Gemini 3.1 Pro.

## 🚀 Features

- **Email Writing & Rewriting**: Generate clear, concise, and professional emails from scratch or improve existing drafts.
- **Tone Customization**: Adapt your message to various tones:
  - 💼 **Professional**: Balanced and business-appropriate.
  - 😊 **Friendly**: Warm and approachable.
  - ✨ **Persuasive**: Compelling and action-oriented.
  - 👔 **Formal**: Strict adherence to professional etiquette.
  - 🚨 **Urgent**: High-priority and direct.
- **AI Check & Humanization**: A simulated analysis that flags generic, overused, or "AI-like" phrases and suggests more natural, human-like alternatives.
- **Subject Line Generator**: Get 3-5 catchy and relevant subject line suggestions for every email.
- **Grammar & Style Correction**: Automatically fix punctuation, spelling, and sentence structure while improving readability.
- **Modern UI**: A responsive, split-pane interface with smooth animations and one-click copy functionality.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI Engine**: Google Gemini 3.1 Pro (via `@google/genai`)
- **Markdown Rendering**: `react-markdown`

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository (or download the source).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the App

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📖 Usage

1. **Input**: Paste your rough draft or a brief description of your email points into the left text area.
2. **Configure**: Select your desired **Tone** and add any **Additional Context** (e.g., "mention the deadline").
3. **Process**:
   - Click **Refine & Humanize** to polish an existing draft.
   - Click **Write New** to generate a full email from your notes.
   - Click **Fix Grammar** for a quick technical cleanup.
4. **Review**:
   - **Improved Email Tab**: View the final draft and copy it to your clipboard.
   - **AI Check Tab**: See the "AI Likelihood Score" and review specific phrases that were humanized.

## 📄 License

This project is licensed under the Apache-2.0 License.
