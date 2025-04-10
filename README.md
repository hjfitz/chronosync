# ChronoSync

A sophisticated timekeeping application featuring a luxury GMT Master-inspired watch face with multiple complications.

## Features

### Luxury GMT Master Watch Face
- Photorealistic rendering of a professional GMT Master watch
- Three iconic bezel options:
  - **Pepsi** (blue/red) - the original GMT Master colorway
  - **Batman** (blue/black) - inspired by the GMT Master II BLNR
  - **Rootbeer** (brown/gold) - based on the luxury two-tone version
- Authentic watch details:
  - Distinctive Mercedes-style hour hand
  - Red second hand with counterbalance
  - Triangle-tipped GMT hand for tracking second timezone
  - Professional dial with proper hour markers
  - 24-hour rotating bezel

### Moon Phase Display
- Accurate lunar phase calculation
- Elegant visualization with golden moon against night sky
- Stars that twinkle in the night portion
- Current moon phase percentage indicator

### Date & Calendar Functions
- Current date display with elegant typography
- Day of week indicator
- Clean, professional layout

### Additional Features
- Light and dark mode support
- Fully responsive design for all device sizes
- Timezone selection for GMT hand tracking
- Digital time display for both local and selected timezone

## Technologies Used

- React and Next.js
- TypeScript
- Tailwind CSS for styling
- HTML5 Canvas for clock rendering
- CSS animations and transitions
- Responsive design principles

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chrono-sync.git
cd chrono-sync

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Changing the Bezel Style
Click on one of the bezel style buttons in the header of the clock card to switch between the Pepsi, Batman, and Rootbeer bezel designs.

### Setting a Second Timezone
1. Use the timezone dropdown to select your desired GMT offset
2. Toggle the "Show GMT hand" switch to display or hide the GMT hand
3. The red triangle-tipped hand will point to the corresponding hour on the 24-hour bezel

### Reading the Moon Phase
The moon phase display shows the current lunar phase with the percentage of the lunar cycle. The highlighted phase name shows the current phase of the moon.

## Project Structure

```
/app                  - Next.js app directory
/components           - React components
  /combined-time-display.tsx - GMT Master watch component
  /date-and-moon-display.tsx - Moon phase and date component
/public               - Static assets
/styles               - Global styles
```

## Customization

You can customize the application by:
- Editing the color themes in `styles/globals.css`
- Modifying the watch face details in `components/combined-time-display.tsx`
- Changing the moon phase visualization in `components/date-and-moon-display.tsx`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the iconic design of luxury GMT watches
- Built with modern web technologies
- Special thanks to the open-source community 