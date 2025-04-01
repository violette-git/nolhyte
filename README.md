# Shadow Escape

A thrilling 2D browser game where you must navigate through the shadows to avoid deadly light sources.

## Game Description

Shadow Escape is a unique stealth game where light is your enemy. You control a character who must stay hidden in the shadows to survive. The game features advanced 2D lighting and shadow effects, creating an immersive and challenging gameplay experience.

As you progress through the levels, you'll face increasingly complex obstacles and more aggressive light sources. Your goal is to survive until the timer runs out on each level, earning points by staying hidden in the shadows.

## How to Play

1. Open `index.html` in a modern web browser
2. Use your mouse to move your character
3. Stay in the shadows to avoid detection by light sources
4. Survive until the timer runs out to complete each level
5. Progress through all 5 levels to win the game

## Controls

- **Mouse Movement**: Control your character
- **M Key**: Toggle sound on/off
- **P Key**: Toggle performance metrics display
- **S Key**: Toggle shadow quality (for performance optimization)

## Game Mechanics

### Light and Shadow System

The game uses an advanced ray casting system to create realistic light and shadow effects:

- Light sources emit rays in all directions
- Obstacles block these rays, creating shadow areas
- The player must stay in these shadow areas to remain safe
- Different light sources have varying movement patterns and intensities

### Danger Meter

When exposed to light, your danger meter fills up:
- Staying in shadows gradually reduces the danger meter
- If the danger meter fills completely, you lose the game
- The rate at which the danger meter fills increases with each level

### Scoring System

- Points are awarded for time spent in shadows
- Higher levels award more points
- Your high score is saved locally

## Level Progression

The game features 5 increasingly challenging levels:

1. **Level 1**: Simple introduction with basic obstacles and a single light source
2. **Level 2**: Introduces circular obstacles and faster light movement
3. **Level 3**: Adds polygon obstacles and multiple light sources
4. **Level 4**: More complex layout with faster lights and additional obstacles
5. **Level 5**: Most challenging level with three light sources and complex obstacle arrangements

## Browser Compatibility

Shadow Escape has been tested and works well on:
- Google Chrome (version 90+)
- Mozilla Firefox (version 88+)
- Microsoft Edge (version 90+)
- Safari (version 14+)

For the best experience, we recommend using the latest version of Google Chrome or Mozilla Firefox.

## Technical Implementation

The game is built using vanilla JavaScript and HTML5 Canvas, featuring:

- Advanced 2D lighting and shadow effects using ray casting
- Optimized shadow calculation algorithms for smooth performance
- Responsive design that adapts to different screen sizes
- Local storage for saving high scores
- Dynamic level generation system

## Credits

- Game Design & Development: Shadow Escape Team
- Sound Effects: [Various sources, properly licensed]
- Special thanks to the open source community for inspiration and resources

## License

This game is provided for personal use and educational purposes.