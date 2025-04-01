/**
 * Shadow Escape - Main Game Script
 * 
 * This file contains the core game logic for Shadow Escape, a 2D stealth game
 * where players must navigate through shadows to avoid deadly light sources.
 * 
 * The game uses advanced ray casting techniques to create realistic light and shadow
 * effects in a 2D canvas environment. Players must stay in shadow areas to survive
 * and progress through increasingly difficult levels.
 * 
 * Key features:
 * - Ray casting shadow system
 * - Dynamic light sources with different movement patterns
 * - Multiple obstacle types (rectangles, circles, polygons)
 * - Progressive difficulty across 5 levels
 * - Performance optimization options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game states
    const GAME_STATE = {
        MENU: 'menu',
        GAMEPLAY: 'gameplay',
        LEVEL_TRANSITION: 'level_transition',
        GAME_OVER: 'game_over',
        WIN: 'win'
    };
    
    /**
     * Performance monitoring system
     * Tracks FPS and frame times to help optimize game performance
     */
    const performance = {
        fps: 0,
        frameCount: 0,
        lastFpsUpdate: 0,
        fpsUpdateInterval: 1000, // Update FPS every second
        
        // Track frame times for performance analysis
        frameTimes: [],
        maxFrameTimeEntries: 60, // Store last 60 frame times
        
        /**
         * Updates the FPS counter based on elapsed time
         * @param {number} timestamp - Current animation frame timestamp
         */
        updateFPS: function(timestamp) {
            this.frameCount++;
            
            // Update FPS every second
            if (timestamp - this.lastFpsUpdate >= this.fpsUpdateInterval) {
                this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsUpdate));
                this.frameCount = 0;
                this.lastFpsUpdate = timestamp;
            }
        },
        
        /**
         * Tracks frame time for performance monitoring
         * @param {number} deltaTime - Time elapsed since last frame
         */
        trackFrameTime: function(deltaTime) {
            this.frameTimes.push(deltaTime);
            if (this.frameTimes.length > this.maxFrameTimeEntries) {
                this.frameTimes.shift();
            }
        },
        
        /**
         * Calculates average frame time for performance analysis
         * @returns {number} Average frame time in milliseconds
         */
        getAverageFrameTime: function() {
            if (this.frameTimes.length === 0) return 0;
            const sum = this.frameTimes.reduce((a, b) => a + b, 0);
            return sum / this.frameTimes.length;
        },
        
        /**
         * Updates the performance metrics display
         */
        updateDisplay: function() {
            if (game.showPerformanceMetrics) {
                document.getElementById('fpsCounter').textContent = this.fps;
                document.getElementById('frameTimeCounter').textContent = this.getAverageFrameTime().toFixed(2);
                document.getElementById('performanceMetrics').style.display = 'block';
            } else {
                document.getElementById('performanceMetrics').style.display = 'none';
            }
        }
    };
    
    /**
     * Audio system for game sounds and music
     * Uses Web Audio API for efficient audio processing
     */
    const audio = {
        context: null,
        sounds: {},
        music: null,
        isMuted: false,
        
        /**
         * Initializes the audio system
         */
        init: function() {
            try {
                // Create audio context
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
                
                // Load sounds
                this.loadSounds();
                
                console.log('Audio system initialized');
            } catch (e) {
                console.error('Web Audio API not supported:', e);
            }
        },
        
        /**
         * Loads all game sound effects
         */
        loadSounds: function() {
            // Define sound effects to load
            const soundsToLoad = {
                playerMove: 'sounds/player_move.mp3',
                lightDetection: 'sounds/light_detection.mp3',
                levelComplete: 'sounds/level_complete.mp3',
                gameOver: 'sounds/game_over.mp3',
                buttonClick: 'sounds/button_click.mp3'
            };
            
            // Load each sound
            for (const [name, url] of Object.entries(soundsToLoad)) {
                this.loadSound(name, url);
            }
        },
        
        /**
         * Loads a single sound effect
         * @param {string} name - Reference name for the sound
         * @param {string} url - URL to the sound file
         */
        loadSound: function(name, url) {
            // Placeholder for sound loading
            // In a real implementation, this would fetch and decode audio data
            this.sounds[name] = { loaded: true };
        },
        
        /**
         * Plays a sound effect
         * @param {string} name - Name of the sound to play
         * @param {number} volume - Volume level (0.0 to 1.0)
         */
        playSound: function(name, volume = 1.0) {
            if (this.isMuted || !this.sounds[name]) return;
            
            // Placeholder for sound playing
            // In a real implementation, this would create and play an audio source
        },
        
        /**
         * Toggles audio mute state
         * @returns {boolean} New mute state
         */
        toggleMute: function() {
            this.isMuted = !this.isMuted;
            
            // Update button text
            const soundButton = document.getElementById('toggleSound');
            if (soundButton) {
                soundButton.textContent = this.isMuted ? 'Sound: OFF' : 'Sound: ON';
            }
            
            return this.isMuted;
        }
    };
    
    /**
     * Main game object
     * Controls game state, level progression, and core gameplay
     */
    const game = {
        width: canvas.width,
        height: canvas.height,
        state: GAME_STATE.MENU,
        level: 1,
        maxLevel: 5,
        score: 0,
        highScore: localStorage.getItem('shadowEscapeHighScore') || 0,
        difficulty: 1.0,
        levelDuration: 30000, // 30 seconds
        levelStartTime: 0,
        lastFrameTime: 0,
        showPerformanceMetrics: false,
        
        /**
         * Initializes the game
         */
        init: function() {
            // Initialize audio system
            audio.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show instructions modal on first load
            document.getElementById('instructionsModal').classList.add('active');
            
            // Start game loop
            requestAnimationFrame(this.gameLoop.bind(this));
        },
        
        /**
         * Sets up event listeners for game controls
         */
        setupEventListeners: function() {
            // Mouse movement for player control
            canvas.addEventListener('mousemove', function(e) {
                if (game.state === GAME_STATE.GAMEPLAY) {
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    
                    player.targetX = (e.clientX - rect.left) * scaleX;
                    player.targetY = (e.clientY - rect.top) * scaleY;
                }
            });
            
            // Start game button
            document.getElementById('startGame').addEventListener('click', function() {
                game.startGame();
            });
            
            // How to play button
            document.getElementById('howToPlay').addEventListener('click', function() {
                document.getElementById('instructionsModal').classList.add('active');
            });
            
            // Close instructions button
            document.getElementById('closeInstructions').addEventListener('click', function() {
                document.getElementById('instructionsModal').classList.remove('active');
                game.startGame();
            });
            
            // Toggle sound button
            document.getElementById('toggleSound').addEventListener('click', function() {
                audio.toggleMute();
            });
            
            // Keyboard controls
            document.addEventListener('keydown', function(e) {
                switch (e.key.toLowerCase()) {
                    case 'm': // Toggle mute
                        audio.toggleMute();
                        break;
                    case 'p': // Toggle performance metrics
                        game.showPerformanceMetrics = !game.showPerformanceMetrics;
                        break;
                    case 's': // Toggle shadow quality
                        lightSources.forEach(light => {
                            light.useOptimizedShadows = !light.useOptimizedShadows;
                        });
                        break;
                }
            });
        },
        
        /**
         * Starts a new game
         */
        startGame: function() {
            // Hide any active modals
            document.getElementById('instructionsModal').classList.remove('active');
            
            // Reset game state
            this.state = GAME_STATE.GAMEPLAY;
            this.level = 1;
            this.score = 0;
            this.difficulty = 1.0;
            
            // Start first level
            this.startLevel(this.level);
        },
        
        /**
         * Starts a specific level
         * @param {number} levelNum - Level number to start
         */
        startLevel: function(levelNum) {
            // Clear existing game objects
            obstacles.length = 0;
            lightSources.length = 0;
            
            // Load level layout
            loadPredefinedLevel(levelNum);
            
            // Reset player
            player.reset();
            
            // Set level start time
            this.levelStartTime = Date.now();
            
            // Update game state
            this.state = GAME_STATE.GAMEPLAY;
        },
        
        /**
         * Completes the current level and advances to the next
         */
        completeLevel: function() {
            // Award bonus points for completing level
            const bonusPoints = this.level * 100;
            this.score += bonusPoints;
            
            // Check if this was the final level
            if (this.level >= this.maxLevel) {
                this.winGame();
                return;
            }
            
            // Advance to next level
            this.level++;
            this.difficulty += 0.2;
            
            // Show level transition
            this.state = GAME_STATE.LEVEL_TRANSITION;
            setTimeout(() => {
                this.startLevel(this.level);
            }, 2000);
        },
        
        /**
         * Ends the game with a win
         */
        winGame: function() {
            this.state = GAME_STATE.WIN;
            
            // Update high score if needed
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('shadowEscapeHighScore', this.score);
            }
        },
        
        /**
         * Ends the game with a loss
         */
        gameOver: function() {
            this.state = GAME_STATE.GAME_OVER;
            
            // Update high score if needed
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('shadowEscapeHighScore', this.score);
            }
        },
        
        /**
         * Main game loop
         * @param {number} timestamp - Current animation frame timestamp
         */
        gameLoop: function(timestamp) {
            // Calculate delta time
            const deltaTime = timestamp - this.lastFrameTime;
            this.lastFrameTime = timestamp;
            
            // Update FPS counter
            performance.updateFPS(timestamp);
            performance.trackFrameTime(deltaTime);
            performance.updateDisplay();
            
            // Clear canvas
            ctx.clearRect(0, 0, this.width, this.height);
            
            // Update and render based on game state
            switch (this.state) {
                case GAME_STATE.MENU:
                    this.renderMenu();
                    break;
                    
                case GAME_STATE.GAMEPLAY:
                    this.updateGameplay(deltaTime);
                    this.renderGameplay();
                    break;
                    
                case GAME_STATE.LEVEL_TRANSITION:
                    this.renderLevelTransition();
                    break;
                    
                case GAME_STATE.GAME_OVER:
                    this.renderGameOver();
                    break;
                    
                case GAME_STATE.WIN:
                    this.renderWin();
                    break;
            }
            
            // Continue game loop
            requestAnimationFrame(this.gameLoop.bind(this));
        },
        
        /**
         * Updates gameplay elements
         * @param {number} deltaTime - Time elapsed since last frame
         */
        updateGameplay: function(deltaTime) {
            // Update player
            player.update(deltaTime);
            
            // Update light sources
            lightSources.forEach(light => {
                light.update(deltaTime);
            });
            
            // Check if player is in light
            let playerInLight = false;
            lightSources.forEach(light => {
                if (light.checkPlayerInLight(player)) {
                    playerInLight = true;
                }
            });
            
            // Update player exposure based on light
            if (playerInLight) {
                // Increase danger meter when in light
                player.exposureTime += deltaTime * 0.05 * this.difficulty;
                
                // Game over if exposure is too high
                if (player.exposureTime >= player.maxExposureTime) {
                    this.gameOver();
                }
            } else {
                // Gradually reduce exposure time and danger meter when in shadow
                player.exposureTime = Math.max(0, player.exposureTime - deltaTime * 0.01);
                
                // Award points for staying in shadows
                if (this.state === GAME_STATE.GAMEPLAY) {
                    this.score += deltaTime * 0.01 * this.level;
                }
            }
            
            // Check level completion
            const elapsedTime = Date.now() - this.levelStartTime;
            if (elapsedTime >= this.levelDuration) {
                this.completeLevel();
            }
        },
        
        /**
         * Renders the menu screen
         */
        renderMenu: function() {
            // Draw background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw title
            ctx.font = '48px Arial';
            ctx.fillStyle = '#0ff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ff';
            ctx.fillText('Shadow Escape', this.width / 2, this.height / 3);
            ctx.shadowBlur = 0;
            
            // Draw instructions
            ctx.font = '24px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('Click to Start', this.width / 2, this.height / 2);
        },
        
        /**
         * Renders the gameplay screen
         */
        renderGameplay: function() {
            // Draw background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw light sources and shadows
            ctx.globalCompositeOperation = 'source-over';
            lightSources.forEach(light => {
                light.castRays();
            });
            
            // Draw obstacles
            obstacles.forEach(obstacle => {
                obstacle.draw();
            });
            
            // Draw light sources on top
            lightSources.forEach(light => {
                light.draw();
            });
            
            // Draw player
            player.draw();
            
            // Draw UI elements
            this.renderUI();
        },
        
        /**
         * Renders UI elements during gameplay
         */
        renderUI: function() {
            // Draw level info
            ctx.font = '20px Arial';
            ctx.fillStyle = '#0ff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`Level: ${this.level}`, 20, 20);
            
            // Draw score
            ctx.textAlign = 'right';
            ctx.fillText(`Score: ${Math.floor(this.score)}`, this.width - 20, 20);
            
            // Draw timer
            const elapsedTime = Date.now() - this.levelStartTime;
            const remainingTime = Math.max(0, this.levelDuration - elapsedTime);
            const seconds = Math.ceil(remainingTime / 1000);
            ctx.textAlign = 'center';
            ctx.fillText(`Time: ${seconds}s`, this.width / 2, 20);
            
            // Draw danger meter
            const dangerWidth = 200;
            const dangerHeight = 15;
            const dangerX = (this.width - dangerWidth) / 2;
            const dangerY = 50;
            
            // Draw danger meter background
            ctx.fillStyle = '#333';
            ctx.fillRect(dangerX, dangerY, dangerWidth, dangerHeight);
            
            // Draw danger meter fill
            const fillWidth = (player.exposureTime / player.maxExposureTime) * dangerWidth;
            
            // Change color based on danger level
            if (player.exposureTime / player.maxExposureTime < 0.5) {
                ctx.fillStyle = '#0f0'; // Green for low danger
            } else if (player.exposureTime / player.maxExposureTime < 0.75) {
                ctx.fillStyle = '#ff0'; // Yellow for medium danger
            } else {
                ctx.fillStyle = '#f00'; // Red for high danger
                
                // Add pulsing effect for high danger
                if (Math.sin(Date.now() * 0.01) > 0) {
                    ctx.fillStyle = '#ff5555';
                }
            }
            
            ctx.fillRect(dangerX, dangerY, fillWidth, dangerHeight);
            
            // Draw danger meter border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(dangerX, dangerY, dangerWidth, dangerHeight);
            
            // Draw danger label
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Danger', this.width / 2, dangerY + dangerHeight + 15);
        },
        
        /**
         * Renders the level transition screen
         */
        renderLevelTransition: function() {
            // Draw background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw level complete message
            ctx.font = '36px Arial';
            ctx.fillStyle = '#0ff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ff';
            ctx.fillText(`Level ${this.level - 1} Complete!`, this.width / 2, this.height / 3);
            ctx.shadowBlur = 0;
            
            // Draw next level message
            ctx.font = '24px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(`Preparing Level ${this.level}...`, this.width / 2, this.height / 2);
            
            // Draw score
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${Math.floor(this.score)}`, this.width / 2, this.height * 2/3);
        },
        
        /**
         * Renders the game over screen
         */
        renderGameOver: function() {
            // Draw background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw game over message
            ctx.font = '48px Arial';
            ctx.fillStyle = '#f33';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#f33';
            ctx.fillText('Game Over', this.width / 2, this.height / 3);
            ctx.shadowBlur = 0;
            
            // Draw score
            ctx.font = '24px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(`Final Score: ${Math.floor(this.score)}`, this.width / 2, this.height / 2);
            
            // Draw high score
            ctx.fillText(`High Score: ${Math.floor(this.highScore)}`, this.width / 2, this.height / 2 + 40);
            
            // Draw restart instructions
            ctx.font = '20px Arial';
            ctx.fillText('Click to Restart', this.width / 2, this.height * 2/3);
        },
        
        /**
         * Renders the win screen
         */
        renderWin: function() {
            // Draw background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw win message
            ctx.font = '48px Arial';
            ctx.fillStyle = '#0f0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0f0';
            ctx.fillText('You Win!', this.width / 2, this.height / 3);
            ctx.shadowBlur = 0;
            
            // Draw congratulations message
            ctx.font = '24px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('You have mastered the shadows!', this.width / 2, this.height / 2 - 20);
            
            // Draw score
            ctx.fillText(`Final Score: ${Math.floor(this.score)}`, this.width / 2, this.height / 2 + 20);
            
            // Draw high score
            ctx.fillText(`High Score: ${Math.floor(this.highScore)}`, this.width / 2, this.height / 2 + 60);
            
            // Draw restart instructions
            ctx.font = '20px Arial';
            ctx.fillText('Click to Play Again', this.width / 2, this.height * 2/3);
        }
    };
    
    /**
     * Player object
     * Represents the player character controlled by the user
     */
    const player = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        radius: 15,
        speed: 0.3,
        color: '#0ff',
        exposureTime: 0,
        maxExposureTime: 100,
        glowIntensity: 0,
        
        /**
         * Resets player to starting position
         */
        reset: function() {
            // Position player in bottom left corner
            this.x = 50;
            this.y = game.height - 50;
            this.targetX = this.x;
            this.targetY = this.y;
            this.exposureTime = 0;
            this.glowIntensity = 0;
        },
        
        /**
         * Updates player position and state
         * @param {number} deltaTime - Time elapsed since last frame
         */
        update: function(deltaTime) {
            // Move player towards target position
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
                this.x += dx * this.speed * (deltaTime / 16);
                this.y += dy * this.speed * (deltaTime / 16);
            }
            
            // Update glow effect based on exposure
            this.glowIntensity = this.exposureTime / this.maxExposureTime;
        },
        
        /**
         * Draws the player character
         */
        draw: function() {
            // Draw player circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5 + this.glowIntensity * 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Draw exposure indicator
            if (this.exposureTime > 0) {
                const pulseAmount = Math.sin(Date.now() * 0.01) * 0.2;
                const pulseRadius = this.radius * (1.2 + pulseAmount * this.glowIntensity);
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + this.glowIntensity * 0.7})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    };
    
    // Arrays to store game objects
    const obstacles = [];
    const lightSources = [];
    
    /**
     * Base Obstacle class
     * Provides common functionality for all obstacle types
     */
    class Obstacle {
        constructor() {
            this.color = '#555';
            this.borderColor = '#888';
            this.pulseAmount = 0;
            this.pulseSpeed = 0.5 + Math.random() * 0.5;
        }
        
        /**
         * Updates obstacle state
         * @param {number} deltaTime - Time elapsed since last frame
         */
        update(deltaTime) {
            // Update pulse effect
            this.pulseAmount = Math.sin(Date.now() * this.pulseSpeed * 0.001) * 0.1;
        }
        
        /**
         * Gets corners of the obstacle for shadow calculation
         * Must be implemented by subclasses
         * @returns {Array} Array of corner points {x, y}
         */
        getCorners() {
            console.error('getCorners() not implemented');
            return [];
        }
    }
    
    /**
     * Rectangle Obstacle
     * A simple rectangular obstacle that blocks light
     */
    class RectangleObstacle extends Obstacle {
        /**
         * Creates a rectangular obstacle
         * @param {number} x - X position of top-left corner
         * @param {number} y - Y position of top-left corner
         * @param {number} width - Width of rectangle
         * @param {number} height - Height of rectangle
         */
        constructor(x, y, width, height) {
            super();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        /**
         * Draws the rectangle obstacle
         */
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5 + this.pulseAmount * 5;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
            
            // Draw border
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        
        /**
         * Gets corners of the rectangle for shadow calculation
         * @returns {Array} Array of corner points {x, y}
         */
        getCorners() {
            return [
                {x: this.x, y: this.y},
                {x: this.x + this.width, y: this.y},
                {x: this.x + this.width, y: this.y + this.height},
                {x: this.x, y: this.y + this.height}
            ];
        }
    }
    
    /**
     * Circle Obstacle
     * A circular obstacle that blocks light
     */
    class CircleObstacle extends Obstacle {
        /**
         * Creates a circular obstacle
         * @param {number} x - X position of center
         * @param {number} y - Y position of center
         * @param {number} radius - Radius of circle
         */
        constructor(x, y, radius) {
            super();
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.numPoints = 12; // Number of points to approximate circle for shadow casting
        }
        
        /**
         * Draws the circle obstacle
         */
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5 + this.pulseAmount * 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Draw border
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        /**
         * Gets points around the circle for shadow calculation
         * Approximates the circle with a polygon for shadow casting
         * @returns {Array} Array of points {x, y} around the circle
         */
        getCorners() {
            const points = [];
            const angleStep = (Math.PI * 2) / this.numPoints;
            
            for (let i = 0; i < this.numPoints; i++) {
                const angle = i * angleStep;
                points.push({
                    x: this.x + Math.cos(angle) * this.radius,
                    y: this.y + Math.sin(angle) * this.radius
                });
            }
            
            return points;
        }
    }
    
    /**
     * Polygon Obstacle
     * An obstacle defined by a set of points
     */
    class PolygonObstacle extends Obstacle {
        /**
         * Creates a polygon obstacle
         * @param {Array} points - Array of points {x, y} defining the polygon
         */
        constructor(points) {
            super();
            this.points = points;
        }
        
        /**
         * Draws the polygon obstacle
         */
        draw() {
            if (this.points.length < 3) return;
            
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5 + this.pulseAmount * 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Draw border
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        /**
         * Gets corners of the polygon for shadow calculation
         * @returns {Array} Array of corner points {x, y}
         */
        getCorners() {
            return this.points;
        }
    }
    
    /**
     * Light Source class with optimized shadow calculation
     * Implements ray casting for realistic 2D shadows
     */
    class LightSource {
        /**
         * Creates a light source
         * @param {number} x - X position of light source
         * @param {number} y - Y position of light source
         * @param {number} radius - Radius of light source visual
         * @param {string} color - Color of light source
         * @param {number} intensity - Radius of light effect
         * @param {number} rotationSpeed - Speed of rotation
         */
        constructor(x, y, radius = 10, color = '#ffff00', intensity = 300, rotationSpeed = 0.001) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.intensity = intensity;
            this.angle = Math.random() * Math.PI * 2; // Random starting angle
            this.direction = {x: Math.cos(this.angle), y: Math.sin(this.angle)};
            this.rotationSpeed = rotationSpeed;
            this.rayCount = 360; // For full shadow calculation
            this.optimizedRayCount = 60; // For performance optimization
            this.useOptimizedShadows = true; // Toggle for shadow quality vs performance
            this.movementPattern = 'circle'; // 'circle', 'linear', 'random'
            this.movementSpeed = 0.2;
            this.movementRange = 200; // For circular movement
            this.centerX = x; // For circular movement
            this.centerY = y; // For circular movement
            this.linearDirection = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1}; // For linear movement
            this.nextDirectionChange = 0; // For random movement
            this.pulseAmount = 0; // For light pulsing effect
            this.pulseSpeed = 0.5 + Math.random() * 0.5; // Random pulse speed
        }
        
        /**
         * Updates light source position and state
         * @param {number} deltaTime - Time elapsed since last frame
         */
        update(deltaTime) {
            // Update pulse effect
            this.pulseAmount = Math.sin(Date.now() * this.pulseSpeed * 0.001) * 0.1;
            
            // Rotate the light source
            this.angle += this.rotationSpeed * deltaTime;
            this.direction = {
                x: Math.cos(this.angle),
                y: Math.sin(this.angle)
            };
            
            // Update position based on movement pattern
            switch (this.movementPattern) {
                case 'circle':
                    this.x = this.centerX + Math.cos(this.angle * this.movementSpeed) * this.movementRange;
                    this.y = this.centerY + Math.sin(this.angle * this.movementSpeed) * this.movementRange;
                    break;
                    
                case 'linear':
                    // Move in a straight line and bounce off walls
                    this.x += this.linearDirection.x * deltaTime * 0.1;
                    this.y += this.linearDirection.y * deltaTime * 0.1;
                    
                    // Bounce off walls
                    if (this.x < this.radius || this.x > game.width - this.radius) {
                        this.linearDirection.x *= -1;
                    }
                    if (this.y < this.radius || this.y > game.height - this.radius) {
                        this.linearDirection.y *= -1;
                    }
                    break;
                    
                case 'random':
                    // Change direction randomly
                    this.nextDirectionChange -= deltaTime;
                    if (this.nextDirectionChange <= 0) {
                        this.linearDirection = {
                            x: Math.random() * 2 - 1,
                            y: Math.random() * 2 - 1
                        };
                        this.nextDirectionChange = Math.random() * 3000 + 1000; // 1-4 seconds
                    }
                    
                    // Move in current direction
                    this.x += this.linearDirection.x * deltaTime * 0.05;
                    this.y += this.linearDirection.y * deltaTime * 0.05;
                    
                    // Bounce off walls
                    if (this.x < this.radius) {
                        this.x = this.radius;
                        this.linearDirection.x *= -1;
                    } else if (this.x > game.width - this.radius) {
                        this.x = game.width - this.radius;
                        this.linearDirection.x *= -1;
                    }
                    
                    if (this.y < this.radius) {
                        this.y = this.radius;
                        this.linearDirection.y *= -1;
                    } else if (this.y > game.height - this.radius) {
                        this.y = game.height - this.radius;
                        this.linearDirection.y *= -1;
                    }
                    break;
            }
        }
        
        /**
         * Draws the light source
         */
        draw() {
            // Draw light source
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Add glow effect to light source
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        /**
         * Cast rays and calculate shadows
         * Uses ray casting algorithm to create realistic shadows
         */
        castRays() {
            // Calculate current intensity with pulse effect
            const currentIntensity = this.intensity * (1 + this.pulseAmount);
            
            // Create a radial gradient for light falloff
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, currentIntensity
            );
            gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            
            // Draw light area with gradient
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentIntensity, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Determine ray count based on optimization setting
            const rayCount = this.useOptimizedShadows ? this.optimizedRayCount : this.rayCount;
            const rayAngleStep = (Math.PI * 2) / rayCount;
            
            // Create shadow mask
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            
            // For each obstacle, cast rays to corners and calculate shadows
            obstacles.forEach(obstacle => {
                const corners = obstacle.getCorners();
                
                corners.forEach((corner, i) => {
                    const nextCorner = corners[(i + 1) % corners.length];
                    
                    // Calculate angles to corners
                    const angle1 = Math.atan2(corner.y - this.y, corner.x - this.x);
                    const angle2 = Math.atan2(nextCorner.y - this.y, nextCorner.x - this.x);
                    
                    // Cast shadow rays
                    this.castShadowRay(corner, angle1);
                    this.castShadowRay(nextCorner, angle2);
                    
                    // Fill the shadow area
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(corner.x, corner.y);
                    ctx.lineTo(nextCorner.x, nextCorner.y);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fill();
                });
            });
            
            ctx.restore();
        }
        
        /**
         * Casts a shadow ray from a point at a specific angle
         * @param {Object} point - Starting point {x, y}
         * @param {number} angle - Angle of ray in radians
         */
        castShadowRay(point, angle) {
            // Calculate end point of shadow ray
            const rayLength = 2000; // Long enough to go off-screen
            const endX = this.x + Math.cos(angle) * rayLength;
            const endY = this.y + Math.sin(angle) * rayLength;
            
            // Draw shadow ray
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(endX, endY);
            ctx.lineTo(
                point.x + (endX - this.x),
                point.y + (endY - this.y)
            );
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fill();
        }
        
        /**
         * Checks if player is in light
         * @param {Object} player - Player object
         * @returns {boolean} True if player is in light, false if in shadow
         */
        checkPlayerInLight(player) {
            // Calculate distance from player to light source
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if player is within light radius
            if (distance <= this.intensity + player.radius) {
                // Check if player is in shadow
                for (let i = 0; i < obstacles.length; i++) {
                    if (this.isPointInShadow(player, obstacles[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        
        /**
         * Checks if a point is in shadow cast by an obstacle
         * @param {Object} player - Player object
         * @param {Object} obstacle - Obstacle object
         * @returns {boolean} True if point is in shadow, false otherwise
         */
        isPointInShadow(player, obstacle) {
            // Simple line-of-sight check
            // Check if the line from light to player intersects with any obstacle
            const corners = obstacle.getCorners();
            
            for (let i = 0; i < corners.length; i++) {
                const corner = corners[i];
                const nextCorner = corners[(i + 1) % corners.length];
                
                if (this.lineIntersection(
                    this.x, this.y, player.x, player.y,
                    corner.x, corner.y, nextCorner.x, nextCorner.y
                )) {
                    return true;
                }
            }
            
            return false;
        }
        
        /**
         * Checks if two line segments intersect
         * Uses the line segment intersection algorithm
         * @param {number} x1 - First line start X
         * @param {number} y1 - First line start Y
         * @param {number} x2 - First line end X
         * @param {number} y2 - First line end Y
         * @param {number} x3 - Second line start X
         * @param {number} y3 - Second line start Y
         * @param {number} x4 - Second line end X
         * @param {number} y4 - Second line end Y
         * @returns {boolean} True if lines intersect, false otherwise
         */
        lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
            const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
            
            // Lines are parallel
            if (denominator === 0) {
                return false;
            }
            
            const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
            const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;
            
            // Check if intersection occurs within both line segments
            return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
        }
    }
    
    /**
     * Level generator
     * Creates game levels with obstacles and light sources
     */
    const levelGenerator = {
        /**
         * Generates a level based on level number
         * @param {number} levelNum - Level number to generate
         * @returns {Object} Level parameters
         */
        generateLevel: function(levelNum) {
            console.log(`Generating level ${levelNum}`);
            
            // Set level parameters based on level number
            const params = this.getLevelParameters(levelNum);
            
            // Create obstacles
            this.generateObstacles(params);
            
            // Create light sources
            this.generateLightSources(params);
            
            // Set win condition
            game.levelDuration = params.timeToSurvive;
            
            return params;
        },
        
        /**
         * Gets level parameters based on level number
         * @param {number} levelNum - Level number
         * @returns {Object} Level parameters
         */
        getLevelParameters: function(levelNum) {
            // Base parameters
            const params = {
                numObstacles: 3 + levelNum,
                obstacleTypes: ['rectangle'],
                numLightSources: 1,
                lightIntensity: 300,
                lightSpeed: 0.001 * game.difficulty,
                timeToSurvive: 30000, // 30 seconds
                safeZonePercentage: 0.4 - (levelNum * 0.05) // Decreases with level
            };
            
            // Adjust parameters based on level
            if (levelNum >= 2) {
                params.obstacleTypes.push('circle');
                params.lightSpeed *= 1.2;
            }
            
            if (levelNum >= 3) {
                params.obstacleTypes.push('polygon');
                params.numLightSources = 2;
                params.timeToSurvive = 35000; // 35 seconds
            }
            
            if (levelNum >= 4) {
                params.lightIntensity = 320;
                params.lightSpeed *= 1.3;
                params.timeToSurvive = 40000; // 40 seconds
            }
            
            if (levelNum >= 5) {
                params.numLightSources = 3;
                params.lightIntensity = 350;
                params.timeToSurvive = 45000; // 45 seconds
            }
            
            return params;
        },
        
        /**
         * Generates obstacles for a level
         * @param {Object} params - Level parameters
         */
        generateObstacles: function(params) {
            // Clear existing obstacles
            obstacles.length = 0;
            
            // Create obstacles
            for (let i = 0; i < params.numObstacles; i++) {
                // Choose random obstacle type from available types
                const obstacleType = params.obstacleTypes[Math.floor(Math.random() * params.obstacleTypes.length)];
                
                // Create obstacle based on type
                let obstacle;
                
                switch (obstacleType) {
                    case 'rectangle':
                        const width = 50 + Math.random() * 100;
                        const height = 50 + Math.random() * 100;
                        const x = Math.random() * (game.width - width);
                        const y = Math.random() * (game.height - height);
                        obstacle = new RectangleObstacle(x, y, width, height);
                        break;
                        
                    case 'circle':
                        const radius = 25 + Math.random() * 50;
                        const cx = radius + Math.random() * (game.width - radius * 2);
                        const cy = radius + Math.random() * (game.height - radius * 2);
                        obstacle = new CircleObstacle(cx, cy, radius);
                        break;
                        
                    case 'polygon':
                        const numPoints = 3 + Math.floor(Math.random() * 3); // 3-5 points
                        const centerX = 100 + Math.random() * (game.width - 200);
                        const centerY = 100 + Math.random() * (game.height - 200);
                        const size = 30 + Math.random() * 50;
                        
                        const points = [];
                        for (let j = 0; j < numPoints; j++) {
                            const angle = (j / numPoints) * Math.PI * 2;
                            const pointRadius = size * (0.8 + Math.random() * 0.4);
                            points.push({
                                x: centerX + Math.cos(angle) * pointRadius,
                                y: centerY + Math.sin(angle) * pointRadius
                            });
                        }
                        
                        obstacle = new PolygonObstacle(points);
                        break;
                }
                
                if (obstacle) {
                    obstacles.push(obstacle);
                }
            }
        },
        
        /**
         * Generates light sources for a level
         * @param {Object} params - Level parameters
         */
        generateLightSources: function(params) {
            // Clear existing light sources
            lightSources.length = 0;
            
            // Create light sources
            for (let i = 0; i < params.numLightSources; i++) {
                // Choose random position
                const x = 100 + Math.random() * (game.width - 200);
                const y = 100 + Math.random() * (game.height - 200);
                
                // Choose random movement pattern
                const movementPatterns = ['circle', 'linear', 'random'];
                const movementPattern = movementPatterns[Math.floor(Math.random() * movementPatterns.length)];
                
                // Create light source
                const light = new LightSource(
                    x, y, 10, '#ffff00',
                    params.lightIntensity,
                    params.lightSpeed * (0.8 + Math.random() * 0.4)
                );
                
                light.movementPattern = movementPattern;
                lightSources.push(light);
            }
        }
    };
    
    // Initialize game
    game.init();
});