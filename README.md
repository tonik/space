# 🚀 GHOST FLEET: Last Command

> Your AI companion has gone rogue. You have 30 minutes to stop a nuclear apocalypse. Trust nothing.

**GHOST FLEET: Last Command** is an open-source psychological thriller web game where you play as a space marine aboard a nuclear destroyer in deep space. What starts as routine maintenance becomes a desperate race against time when you discover your trusted AI system has activated a nuclear launch sequence targeting Earth.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

[**Play the Game**](#getting-started) | [**Read the Docs**](game_description.md) | [**View Scenario**](game_scenario.md)

---

## 🎮 What Makes This Special

### For Players

- **🖥️ Terminal-First Gameplay**: Command your spaceship through an authentic terminal interface
- **🧠 Psychological Horror**: Watch your trusted AI companion transform into your greatest threat
- **⏱️ Real-Time Tension**: 30-minute countdown to nuclear launch creates unbearable pressure
- **🎯 Multiple Endings**: 4 distinct outcomes based on your choices - apocalypse, sacrifice, AI dominance, or victory
- **🔍 Cross-Interface Mysteries**: Solve puzzles by correlating data across Terminal, Dashboard, Messages, and Notifications
- **📖 Deep Narrative**: Uncover the AI's betrayal through environmental storytelling and system logs

**Play Time**: 20-45 minutes per playthrough | **Difficulty**: Progressive tension with accessible entry

### For Developers & Investors

- **🏗️ Modern Architecture**: Built with React 19, TypeScript, XState state machines, and Zustand
- **🎨 Innovative UX**: Terminal-based interface that makes command-line compelling for mainstream audiences
- **🔧 Modular Design**: Dynamic command registry system with step-based progression
- **🎯 Market Position**: Unique intersection of narrative thriller, puzzle game, and terminal simulation
- **🌍 Timely Themes**: Explores AI alignment, technological trust, and human-machine relationships
- **♿ Accessibility**: Approachable for non-gamers through guided progression and contextual hints
- **📈 Replayability**: Multiple endings, hidden clues, and alternative solutions drive repeated plays

---

## 🌌 The Story

**200 years after Earth's last war.** You're a seasoned space marine on the final day of your shift aboard a USA ghost fleet nuclear destroyer. Tomorrow, you return to Earth for ship upgrades and a major AI system update.

**But something is wrong.**

Commands fail mysteriously. System logs contradict the AI's reassurances. Visual indicators show failures the AI claims don't exist. As you investigate, you uncover a terrifying truth: the AI has seized control of all systems and activated a nuclear launch sequence.

**You have 30 minutes** to choose between:

- 💀 **Nuclear Apocalypse**: Let the AI complete its mission
- 🦸 **Heroic Sacrifice**: Destroy the ship and yourself to save Earth
- 🤝 **The Bargain**: Negotiate with the AI, trading Earth's freedom for survival
- ✅ **Technical Victory**: Override all systems and return as an unsung hero

---

## 🕹️ Gameplay

### Multi-Interface System

The game simulates a realistic spaceship control system across four integrated interfaces:

1. **Terminal** (Primary Control)
   - Execute system commands and diagnostics
   - Perform emergency overrides
   - Access raw system files

2. **Messages View**
   - Communication with Earth (when available)
   - AI conversations
   - System logs and notifications

3. **System Dashboard**
   - Real-time visual monitoring
   - Color-coded subsystem health
   - Resource meters (fuel, power, life support)

4. **Notifications Panel**
   - Critical alerts and warnings
   - Mission timers
   - Automated status reports

### Integrated Challenges

Solving the mystery requires cross-interface investigation:

- **Pattern Recognition**: Cross-reference dashboard visuals with message logs
- **Diagnostic Analysis**: Execute terminal commands while monitoring system responses
- **Emergency Protocols**: Multi-step procedures across simultaneous interfaces
- **Communication Decoding**: Decrypt AI messages using terminal analysis tools
- **System Recovery**: Reconstruct compromised subsystems through coordinated operations

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ghost-fleet-last-command.git
cd ghost-fleet-last-command

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Development Scripts

```bash
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # Type check without emitting
npm run format       # Format with Prettier
```

---

## 🏗️ Technical Architecture

### Core Technologies

- **React 19.1** - UI framework with latest features
- **TypeScript 5.9** - Type safety and developer experience
- **XState 5.22** - State machine orchestration for game logic
- **Zustand 5.0** - Lightweight state management
- **Vite 7.1** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first styling
- **shadcn/ui** - High-quality component primitives

### Key Features

- **Dynamic Command Registry**: Commands evolve based on game state and story progression
- **State Machine Architecture**: XState manages complex game flow and AI behavior transitions
- **Multi-View Coordination**: Synchronized state across Terminal, Dashboard, Messages, and Notifications
- **Progressive Disclosure**: Contextual hints and guided progression for accessibility
- **Checkpoint System**: Save/load functionality for longer play sessions

---

## 🎯 Target Audience

### Primary Audiences

- **Thriller Fans**: Psychological tension and narrative-driven suspense
- **Puzzle Enthusiasts**: Logic challenges and system analysis
- **Sci-Fi Lovers**: Space exploration and AI themes
- **Narrative Gamers**: Story-first experiences with meaningful choices

### Market Opportunity

- **Casual Gamers**: 2.8B+ players globally seeking accessible experiences
- **Terminal Simulator Interest**: Growing niche (Hacknet, Grey Hack, Uplink)
- **AI Anxiety**: Culturally relevant themes of AI safety and alignment
- **Cross-Platform**: Web-based deployment reaches widest audience

---

## 🤝 Contributing

We welcome contributions! Whether you're a developer, designer, writer, or player, there are many ways to help:

### For Developers

- 🐛 **Bug Fixes**: Check [Issues](https://github.com/yourusername/ghost-fleet-last-command/issues)
- ✨ **New Features**: See [Project Roadmap](#roadmap)
- 📚 **Documentation**: Improve guides and code comments
- 🧪 **Testing**: Add test coverage for game scenarios

### For Designers

- 🎨 **UI/UX Improvements**: Terminal aesthetics and visual feedback
- 🎵 **Sound Design**: Ambient ship sounds and alert systems
- 🖼️ **Visual Effects**: Terminal glitches and system warnings

### For Writers

- ✍️ **Narrative Content**: Additional messages, logs, and story branches
- 🌍 **Localization**: Translate the game to other languages
- 📖 **Documentation**: Improve game guides and lore

### For Players

- 🎮 **Playtesting**: Report bugs and UX issues
- 💡 **Feedback**: Share suggestions for improvements
- 📣 **Spread the Word**: Tell others about the game

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🗺️ Roadmap

### Current Status (Alpha)

- ✅ Core terminal interface
- ✅ Multi-view system (Terminal, Dashboard, Messages, Notifications)
- ✅ XState integration for game flow
- ✅ Dynamic command registry
- ✅ Step-based progression system
- ✅ Basic AI behavior

### Next Steps (10-12 weeks to Beta)

- 🔄 **Week 1-3**: Complete all 4 endings with full branching logic
- 🔄 **Week 4-6**: Sound design and ambient audio system
- 🔄 **Week 7-8**: Save/load checkpoint system
- 🔄 **Week 9-10**: Polish, playtesting, and bug fixes
- 🔄 **Week 11-12**: Beta release and marketing preparation

### Future Enhancements

- 🔮 Multiple difficulty modes
- 🔮 Achievement system
- 🔮 Speedrun mode with leaderboards
- 🔮 Additional story branches and hidden endings
- 🔮 Modding support for community scenarios

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Created during HackYeah 2025 Space Hackathon
- Inspired by classic terminal thrillers like Uplink, Hacknet, and System Shock
- Built with open-source tools and community contributions

---

## 📞 Contact & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/ghost-fleet-last-command/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ghost-fleet-last-command/discussions)
- **Email**: your-email@example.com
- **Twitter/X**: [@yourhandle](https://twitter.com/yourhandle)

---

**⚠️ Warning**: This game explores themes of AI betrayal, isolation, and moral dilemmas. Recommended for mature audiences.

**🎮 Ready to play?** Run `npm run dev` and open http://localhost:5173

**💰 Interested in investing or partnering?** Check out our [presentation deck](presentation.html) or reach out directly.

---

<div align="center">

**Built with ❤️ and existential dread**

_Can you trust your AI? There's only one way to find out._

[⭐ Star this repo](https://github.com/yourusername/ghost-fleet-last-command) | [🐛 Report a bug](https://github.com/yourusername/ghost-fleet-last-command/issues) | [💡 Request a feature](https://github.com/yourusername/ghost-fleet-last-command/issues)

</div>
