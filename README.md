# GirlynWritingAssistant

An AI-powered writing and email assistant designed to compose, humanize, rewrite, and polish emails, essays, articles, cover letters, and documents with authentic tone and high originality. Powered by Gemini 3.1 Pro.

## 🎥 Demo & Screen Recording

![Girlyn Writing Assistant Demo](https://girlyn.com/images/Girlyn-Writing-Assistant.gif)

> **Workflow Demonstration**:
> 1. **Format Selection**: Switch seamlessly between **Email**, **General Text**, **Essay / Academic**, **Article / Blog**, **Cover Letter**, and **Social Post**.
> 2. **Draft Input & Tone**: Provide bullet points or rough drafts (e.g. *"write follow up email to client regarding the outstanding payment"*) and select a target tone (**Friendly**, **Professional**, **Persuasive**, etc.).
> 3. **Polished Draft & Suggestions**: Get 3-5 headline/subject suggestions, a humanized draft, structured change log, and context-specific writing tips.
> 4. **AI Check & Humanizer**: Review the **Authenticity Percentage Gauge** (e.g. 95% Authentic), side-by-side authenticity vs AI likelihood meters, and flagged clichés with humanized alternatives.

---

## 🚀 Key Features

- **Multi-Format Support**:
  - 📧 **Email**: Cold outreach, client communications, updates with subject line suggestions.
  - 📝 **General Text**: Notes, memos, reports, and standard prose.
  - 🎓 **Essay / Academic**: Essays, research papers, thesis statements, reports.
  - 📰 **Article / Blog**: Articles, blog posts, news pieces with headline suggestions.
  - 📄 **Cover Letter**: Job application letters and professional introductions.
  - 📱 **Social Post**: LinkedIn posts, announcements, X/Twitter threads.

- **Tone Customization**: Adapt tone to Professional, Friendly, Persuasive, Formal, Academic, Creative, Urgent, or Concise.

- **AI Check & Humanizer**: Analyzes your draft for overused AI clichés, formulaic phrasing, and filler words, providing a realistic AI likelihood score and human-like suggestions.

- **Headlines & Subject Lines**: Generates 3-5 catchy subject lines (for emails) or compelling titles/headlines (for articles, essays, and social posts).

- **Grammar & Style Polish**: Automatically fixes punctuation, spelling, sentence structure, and flow without altering the intended meaning.

- **Quick Starter Templates**: One-click templates to test cold emails, cover letters, blog introductions, and academic hooks immediately.

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

## 📄 License

This project is licensed under the Apache-2.0 License.
