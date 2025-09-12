
# MindEase

MindEase is a modern, interactive web app designed to help users recharge, refocus, and reconnect with themselves. It features mindful activities, motivational content, and simple tools for mental wellness—all in a beautiful, responsive interface.

## Features

- **Hero Section:** Inspiring quotes and a welcoming introduction.
- **Activities Dashboard:** 
  - Spin the Wheel for random fun tasks
  - Guided breathing exercises
  - Meditation, drawing, movies, stories, music, and more
  - Filter activities by category (fun, relax, media, nature)
- **Quick Tips:** Actionable advice for mental wellness, including helping others, productivity, and uplifting content.
- **Footer:** Quick links and social media icons.

## Technologies Used

- React (functional components, hooks)
- Tailwind CSS for styling
- FontAwesome and Lucide for icons
- Vite for fast development
- Custom CSS for interactive elements (Wheel, Cards)
- Responsive design for all devices

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Mindease
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
   > **Required packages:**  
   > - `react`, `react-dom`  
   > - `tailwindcss`, `@tailwindcss/vite`  
   > - `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`  
   > - `lucide-react`  
   > - `@radix-ui/react-slot`  
   > - `animate.css`  
   > - `firebase`  
   > - `framer-motion`  
   > - `react-router-dom`  
   > - `react-slick`  
   > - `slick-carousel`  
   > - `styled-components`  
   > - `vite`, `@vitejs/plugin-react`  
   > - (Dev) `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `@types/react`, `@types/react-dom`, `tw-animate-css`

   
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/Component/` – Main React components (Navbar, Hero, Activities, Tips, Footer, Wheel, etc.)
- `src/templates/` – Card component and styles
- `src/hooks/` – Custom React hooks
- `public/png` – Images and icons

## Customization

- Add or edit activities in `Activities.jsx`
- Update tips in `Tips.jsx`
- Change images in the `public/png` or `src/assets` folders
- Edit styles in `index.css`, `wheelStyle.css`, or component-specific CSS files

## License

This project is open source and free to use for personal and educational purposes.

---

_Made with ❤️ for mental wellness and mindfulness._
