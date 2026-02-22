# 🎓 German University Application Tracker

A simple and elegant Next.js application to help you keep track of all your German university applications in one place.

## Features

- ✅ Track multiple university applications
- 📝 Comprehensive form with all essential fields
- 💾 Local storage - your data persists between sessions
- ✨ Beautiful, responsive UI with Tailwind CSS
- 🎯 Easy-to-use interface with visual application status
- 🔗 Automatic link extraction from text

## Application Fields

1. **University Name** - Name of the university
2. **Semester Fee** - Cost per semester in euros
3. **City/Location** - Where the university is located
4. **Apply Through** - Application portal (e.g., Uni-Assist, Direct)
5. **Application Start Date** - When applications open
6. **Application End Date** - Application deadline
7. **Subject** - Program/course you're applying for
8. **Living Cost** - Estimated monthly living expenses in euros
9. **Documents Required** - List of required documents (textarea)
10. **IELTS Score** - Required English proficiency score
11. **Application Fee** - Cost to apply in euros
12. **Applied?** - Checkbox to mark if you've already submitted
13. **Useful Links** - Important URLs and resources (automatically extracted)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd german-uni-tracker
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding an Application

1. Fill in the form with your university application details
2. Required fields are marked with an asterisk (*)
3. Click "Add University Application" to save

### Managing Applications

- **Toggle Application Status**: Click the "Applied" or "Not Applied" button to update status
- **Delete Application**: Click the "Delete" button to remove an application (with confirmation)
- **View Details**: All your application details are displayed in organized cards

### Data Persistence

- All data is stored in your browser's local storage
- Your applications will remain even after closing the browser
- Data is automatically saved whenever you add, update, or delete an application

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Local Storage API** - Data persistence

## Project Structure

```
german-uni-tracker/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page with state management
│   └── globals.css      # Global styles
├── components/
│   ├── ApplicationForm.tsx  # Form component
│   └── ApplicationList.tsx  # List display component
├── types/
│   └── application.ts   # TypeScript interfaces
└── package.json
```

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Features in Detail

### Responsive Design
- Mobile-friendly layout
- Grid system adapts to screen size
- Optimized for all devices

### Visual Feedback
- Color-coded application status (green for applied, yellow for not applied)
- Hover effects on interactive elements
- Clean, modern UI

### Link Extraction
- Automatically extracts URLs from the "Useful Links" field
- Makes links clickable
- Opens in new tab for convenience

## Tips

- Keep your application deadlines up to date
- Use the "Documents Required" field to track what you need to prepare
- Add official university websites and application portals in "Useful Links"
- Track all costs (semester fee, living cost, application fee) to plan your budget
- Mark applications as "Applied" once submitted to keep track of your progress

---

**Good luck with your German university applications! 🍀**
# my-german-university
