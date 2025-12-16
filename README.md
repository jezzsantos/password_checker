# Password Strength Tester & Generator

A modern web-based password strength tester and generator with an animated letter glitch background effect. Built with React, vanilla JavaScript, HTML, and CSS.

## 🌟 Features

### Password Generator (Home Page)

- ✨ **Animated Letter Glitch Background** - Matrix-style animated background with customizable colors
- 🎲 **Random Password Generation** - Create secure passwords instantly
- 📏 **Adjustable Length** - Slider control from 4 to 32 characters
- 🔧 **Character Options**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%)
- 📊 **Real-time Strength Display** - See how strong your generated password is
- 📋 **One-Click Copy** - Copy passwords to clipboard instantly
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

### Password Tester (Second Page)

- 🔍 **Single Password Testing** - Test individual passwords in real-time
- 📦 **Bulk Password Analysis** - Analyze multiple passwords at once
  - Overall security score
  - Strength distribution chart
  - Individual password breakdown
  - Color-coded results
- ✅ **Password Requirements Checklist**:
  - Minimum 8 characters
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- 👁️ **Show/Hide Password** - Toggle password visibility
- 📈 **Visual Progress Bar** - Color-coded strength indicator

## 🎨 Background Effect

The home page features a custom **Letter Glitch Animation** inspired by [ReactBits Letter Glitch](https://www.reactbits.dev/backgrounds/letter-glitch):

- Animated matrix of scrambling characters
- Customizable colors (teal/green theme by default)
- Smooth opacity transitions
- Outer vignette effect for focus
- Fully responsive canvas animation

## 🚀 Getting Started

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Usage

1. **Clone or download** this repository:

```bash
git clone https://github.com/DeltaHotelSierra/password_checker.git
cd password_checker
```

2. **Open in browser**:

   - Simply open `index.html` in your web browser
   - Or double-click the file

3. **Navigate between pages**:
   - **Password Generator** (index.html) - Home page with glitch background
   - **Password Tester** (tester.html) - Test single or multiple passwords

## 📂 Project Structure

```
password-strength-tester/
├── index.html                  # Password Generator (Home)
├── tester.html                 # Password Tester
├── generator.html              # (Legacy - not in navigation)
├── PasswordGenerator.jsx       # Generator React component
├── PasswordStrengthTester.jsx  # Tester React component
├── appGenerator.js             # Generator app initialization
├── appTester.js               # Tester app initialization
├── LetterGlitch.js            # Animated background effect
├── styles.css                  # All styling
├── password_tester.py         # Original Python version
└── README.md                   # This file
```

## 🎯 How to Use

### Generate Passwords:

1. Open `index.html` (home page with cool glitch background!)
2. Adjust the length slider
3. Select character types to include
4. Click "Generate Password"
5. Click the 📋 button to copy

### Test Password Strength:

1. Click "Password Tester" in navigation
2. **Single Mode**: Type a password to see real-time analysis
3. **Bulk Mode**:
   - Click "Bulk Analysis"
   - Paste multiple passwords (one per line)
   - Click "Analyze Passwords"
   - View comprehensive security report

## 🎨 Password Strength Criteria

Passwords are scored based on:

- **Length**: 8+ chars (20pts), 12+ chars (+10pts), 16+ chars (+10pts)
- **Uppercase Letters**: A-Z (15pts)
- **Lowercase Letters**: a-z (15pts)
- **Numbers**: 0-9 (15pts)
- **Special Characters**: !@#$%^&\*() etc. (15pts)

**Strength Levels**:

- 🔴 Very Weak: < 30%
- 🟠 Weak: 30-49%
- 🟡 Medium: 50-69%
- 🟢 Strong: 70-84%
- 🟢 Very Strong: 85%+

## 🛠️ Technologies Used

- **React 18** - UI components and state management
- **Vanilla JavaScript** - Letter Glitch animation
- **HTML5 Canvas** - Animated background rendering
- **CSS3** - Modern styling, gradients, and animations
- **Babel Standalone** - JSX transformation in browser

## 📱 Responsive Design

Fully responsive and works on:

- 💻 Desktop computers
- 📱 Tablets
- 📱 Mobile phones

## 🎨 Customization

### Change Glitch Background Colors:

Edit `index.html`, find the LetterGlitch initialization:

```javascript
glitchColors: ['#2b4539', '#61dca3', '#61b3dc'], // Change these hex colors
```

### Adjust Animation Speed:

```javascript
glitchSpeed: 50, // Lower = slower, Higher = faster
```

## 🐍 Python Version

The original Python/Tkinter version is still available in `password_tester.py`:

```bash
python password_tester.py
```

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

**Contact**: deltahotelsierra@hotmail.com

## 🌐 Live Demo

Open `index.html` in your browser to see it in action!

## 👤 Author

**DeltaHotelSierra**

- GitHub: [@deltahotelsierra](https://github.com/deltahotelsierra)
- Email: deltahotelsierra@hotmail.com

---

Made with ❤️ using React, JavaScript, and Canvas Animation
