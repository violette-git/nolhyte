// Predefined level layouts for testing
const predefinedLevels = {
    // Level 1: Simple introduction with basic obstacles
    1: {
        obstacles: [
            {
                type: 'rectangle',
                x: 300,
                y: 200,
                width: 100,
                height: 50
            },
            {
                type: 'rectangle',
                x: 500,
                y: 400,
                width: 80,
                height: 80
            },
            {
                type: 'rectangle',
                x: 200,
                y: 450,
                width: 120,
                height: 40
            }
        ],
        lightSources: [
            {
                x: 100,
                y: 100,
                intensity: 300,
                speed: 0.001,
                movementPattern: 'circle'
            }
        ],
        timeToSurvive: 20000 // 20 seconds
    },
    
    // Level 2: Introduces circular obstacles and faster light
    2: {
        obstacles: [
            {
                type: 'rectangle',
                x: 250,
                y: 150,
                width: 100,
                height: 60
            },
            {
                type: 'circle',
                x: 500,
                y: 300,
                radius: 50
            },
            {
                type: 'rectangle',
                x: 150,
                y: 400,
                width: 90,
                height: 90
            },
            {
                type: 'circle',
                x: 650,
                y: 450,
                radius: 40
            }
        ],
        lightSources: [
            {
                x: 150,
                y: 150,
                intensity: 320,
                speed: 0.0012,
                movementPattern: 'linear'
            }
        ],
        timeToSurvive: 25000 // 25 seconds
    },
    
    // Level 3: Introduces polygon obstacles and multiple light sources
    3: {
        obstacles: [
            {
                type: 'rectangle',
                x: 200,
                y: 200,
                width: 120,
                height: 60
            },
            {
                type: 'circle',
                x: 550,
                y: 250,
                radius: 45
            },
            {
                type: 'polygon',
                points: [
                    {x: 350, y: 400},
                    {x: 400, y: 350},
                    {x: 450, y: 400},
                    {x: 400, y: 450}
                ]
            },
            {
                type: 'rectangle',
                x: 600,
                y: 450,
                width: 100,
                height: 50
            },
            {
                type: 'polygon',
                points: [
                    {x: 150, y: 350},
                    {x: 200, y: 300},
                    {x: 250, y: 350},
                    {x: 200, y: 400},
                    {x: 150, y: 350}
                ]
            }
        ],
        lightSources: [
            {
                x: 100,
                y: 100,
                intensity: 330,
                speed: 0.0015,
                movementPattern: 'circle'
            },
            {
                x: 700,
                y: 500,
                intensity: 300,
                speed: 0.0012,
                movementPattern: 'random'
            }
        ],
        timeToSurvive: 30000 // 30 seconds
    },
    
    // Level 4: More complex with faster lights and more obstacles
    4: {
        obstacles: [
            {
                type: 'rectangle',
                x: 150,
                y: 150,
                width: 100,
                height: 60
            },
            {
                type: 'circle',
                x: 500,
                y: 200,
                radius: 50
            },
            {
                type: 'polygon',
                points: [
                    {x: 300, y: 350},
                    {x: 350, y: 300},
                    {x: 400, y: 350},
                    {x: 350, y: 400}
                ]
            },
            {
                type: 'rectangle',
                x: 600,
                y: 400,
                width: 80,
                height: 80
            },
            {
                type: 'circle',
                x: 200,
                y: 450,
                radius: 40
            },
            {
                type: 'polygon',
                points: [
                    {x: 650, y: 150},
                    {x: 700, y: 200},
                    {x: 650, y: 250},
                    {x: 600, y: 200}
                ]
            }
        ],
        lightSources: [
            {
                x: 100,
                y: 100,
                intensity: 350,
                speed: 0.0018,
                movementPattern: 'circle'
            },
            {
                x: 700,
                y: 500,
                intensity: 320,
                speed: 0.0015,
                movementPattern: 'linear'
            }
        ],
        timeToSurvive: 35000 // 35 seconds
    },
    
    // Level 5: Most challenging with three light sources and complex obstacles
    5: {
        obstacles: [
            {
                type: 'rectangle',
                x: 100,
                y: 100,
                width: 120,
                height: 60
            },
            {
                type: 'circle',
                x: 450,
                y: 150,
                radius: 45
            },
            {
                type: 'polygon',
                points: [
                    {x: 250, y: 300},
                    {x: 300, y: 250},
                    {x: 350, y: 300},
                    {x: 300, y: 350}
                ]
            },
            {
                type: 'rectangle',
                x: 550,
                y: 350,
                width: 100,
                height: 50
            },
            {
                type: 'circle',
                x: 200,
                y: 400,
                radius: 50
            },
            {
                type: 'polygon',
                points: [
                    {x: 600, y: 150},
                    {x: 650, y: 100},
                    {x: 700, y: 150},
                    {x: 650, y: 200}
                ]
            },
            {
                type: 'rectangle',
                x: 400,
                y: 450,
                width: 80,
                height: 80
            }
        ],
        lightSources: [
            {
                x: 150,
                y: 150,
                intensity: 350,
                speed: 0.002,
                movementPattern: 'circle'
            },
            {
                x: 650,
                y: 450,
                intensity: 330,
                speed: 0.0018,
                movementPattern: 'linear'
            },
            {
                x: 400,
                y: 300,
                intensity: 300,
                speed: 0.0015,
                movementPattern: 'random'
            }
        ],
        timeToSurvive: 40000 // 40 seconds
    }
};

// Function to load a predefined level
function loadPredefinedLevel(levelNum) {
    // Default to level 1 if the requested level doesn't exist
    const levelData = predefinedLevels[levelNum] || predefinedLevels[1];
    
    // Clear existing obstacles and light sources
    obstacles.length = 0;
    lightSources.length = 0;
    
    // Create obstacles
    levelData.obstacles.forEach(obstacleData => {
        let obstacle;
        
        switch (obstacleData.type) {
            case 'rectangle':
                obstacle = new RectangleObstacle(
                    obstacleData.x,
                    obstacleData.y,
                    obstacleData.width,
                    obstacleData.height
                );
                break;
                
            case 'circle':
                obstacle = new CircleObstacle(
                    obstacleData.x,
                    obstacleData.y,
                    obstacleData.radius
                );
                break;
                
            case 'polygon':
                obstacle = new PolygonObstacle(
                    obstacleData.points
                );
                break;
        }
        
        if (obstacle) {
            obstacles.push(obstacle);
        }
    });
    
    // Create light sources
    levelData.lightSources.forEach(lightData => {
        const light = new LightSource(
            lightData.x,
            lightData.y,
            10, // radius
            '#ffff00', // color
            lightData.intensity,
            lightData.speed
        );
        
        light.movementPattern = lightData.movementPattern;
        lightSources.push(light);
    });
    
    // Set level duration
    game.levelDuration = levelData.timeToSurvive;
    
    return levelData;
}