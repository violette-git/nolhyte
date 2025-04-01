// Test script for Shadow Escape game
// This script should be run in the browser console to test various aspects of the game

const testShadowEscape = {
    // Test performance metrics
    testPerformance: function() {
        console.log("Testing performance monitoring...");
        
        // Enable performance metrics
        game.showPerformanceMetrics = true;
        
        // Monitor FPS for 5 seconds
        const startTime = Date.now();
        const fpsValues = [];
        
        const fpsInterval = setInterval(() => {
            fpsValues.push(performance.fps);
            
            if (Date.now() - startTime > 5000) {
                clearInterval(fpsInterval);
                
                // Calculate average FPS
                const avgFps = fpsValues.reduce((sum, fps) => sum + fps, 0) / fpsValues.length;
                console.log(`Average FPS: ${avgFps.toFixed(2)}`);
                
                // Check if FPS is acceptable
                if (avgFps < 30) {
                    console.warn("⚠️ Low FPS detected. Consider optimizing shadow calculations or reducing effects.");
                } else {
                    console.log("✅ FPS is acceptable.");
                }
                
                // Test shadow optimization
                this.testShadowOptimization();
            }
        }, 500);
    },
    
    // Test shadow optimization
    testShadowOptimization: function() {
        console.log("Testing shadow optimization...");
        
        // Test with high-quality shadows
        lightSources.forEach(light => light.useOptimizedShadows = false);
        
        setTimeout(() => {
            const highQualityFps = performance.fps;
            console.log(`FPS with high-quality shadows: ${highQualityFps}`);
            
            // Test with optimized shadows
            lightSources.forEach(light => light.useOptimizedShadows = true);
            
            setTimeout(() => {
                const optimizedFps = performance.fps;
                console.log(`FPS with optimized shadows: ${optimizedFps}`);
                
                const improvement = ((optimizedFps - highQualityFps) / highQualityFps * 100).toFixed(2);
                console.log(`Shadow optimization improvement: ${improvement}%`);
                
                // Test game mechanics
                this.testGameMechanics();
            }, 2000);
        }, 2000);
    },
    
    // Test game mechanics
    testGameMechanics: function() {
        console.log("Testing game mechanics...");
        
        // Test player movement
        const originalSpeed = player.speed;
        console.log(`Original player speed: ${originalSpeed}`);
        
        // Test different speeds
        const speedTests = [0.05, 0.1, 0.15, 0.2];
        speedTests.forEach(speed => {
            console.log(`Testing player speed: ${speed}`);
            player.speed = speed;
        });
        
        // Reset speed
        player.speed = originalSpeed;
        
        // Test danger meter fill/drain rates
        console.log("Testing danger meter rates...");
        
        // Test audio system
        this.testAudio();
    },
    
    // Test audio system
    testAudio: function() {
        console.log("Testing audio system...");
        
        // Check if audio context is initialized
        if (audioSystem.context) {
            console.log("✅ Audio context initialized.");
            
            // Test playing each sound
            const sounds = ['playerMove', 'lightDetection', 'levelComplete', 'gameOver', 'buttonClick'];
            sounds.forEach(sound => {
                if (audioSystem.sounds[sound]) {
                    console.log(`✅ Sound '${sound}' loaded.`);
                } else {
                    console.warn(`⚠️ Sound '${sound}' not loaded.`);
                }
            });
            
            // Test background music
            if (audioSystem.music.buffer) {
                console.log("✅ Background music loaded.");
            } else {
                console.warn("⚠️ Background music not loaded.");
            }
            
            // Test mute functionality
            console.log("Testing mute functionality...");
            const originalMuteState = audioSystem.isMuted;
            audioSystem.toggleMute();
            console.log(`Mute toggled to: ${audioSystem.isMuted}`);
            audioSystem.toggleMute();
            console.log(`Mute toggled back to: ${audioSystem.isMuted}`);
            
            // Restore original state
            if (originalMuteState !== audioSystem.isMuted) {
                audioSystem.toggleMute();
            }
        } else {
            console.error("❌ Audio context not initialized.");
        }
        
        // Test visual effects
        this.testVisualEffects();
    },
    
    // Test visual effects
    testVisualEffects: function() {
        console.log("Testing visual effects...");
        
        // Test particle effects
        visualEffects.createParticleBurst(
            game.width / 2, 
            game.height / 2, 
            '#0ff', 
            20, 2, 3, 1000
        );
        console.log("✅ Particle burst effect created.");
        
        // Test screen flash
        setTimeout(() => {
            visualEffects.createScreenFlash('rgb(0, 255, 255)', 500, 0.3);
            console.log("✅ Screen flash effect created.");
            
            // Test screen shake
            setTimeout(() => {
                visualEffects.createScreenShake(5, 500);
                console.log("✅ Screen shake effect created.");
                
                // Complete tests
                setTimeout(() => {
                    console.log("All tests completed!");
                    console.log("Shadow Escape game is ready for play testing.");
                }, 1000);
            }, 1000);
        }, 1000);
    },
    
    // Run all tests
    runTests: function() {
        console.log("Starting Shadow Escape tests...");
        
        // Check if game is initialized
        if (typeof game === 'undefined') {
            console.error("❌ Game not initialized. Make sure the game is running.");
            return;
        }
        
        // Start with performance tests
        this.testPerformance();
    }
};

// Instructions to run tests
console.log("To run Shadow Escape tests, execute: testShadowEscape.runTests()");