import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

const PatutiGame = () => {
    const [position, setPosition] = useState({ left: 225, top: -90 });
    const [isJumping, setIsJumping] = useState(false);
    const [isDucking, setIsDucking] = useState(false);
    const [isFalling, setIsFalling] = useState(false);
    const [health, setHealth] = useState(100);
    const platformWidth = 550;
    const platformLeftEdge = -60;
    const platformRightEdge = platformLeftEdge + platformWidth;
    const [bullets, setBullets] = useState([]);
    const bulletSpeed = 20;
    const bulletSpawnInterval = 1600;

    const backgroundRef = useRef(null);

    const [idleSprite, setIdleSprite] = useState('/images/idle-1.png');
    const [isMovingLeft, setIsMovingLeft] = useState(false);
    const [isMovingRight, setIsMovingRight] = useState(false);
    const [leftSpriteIndex, setLeftSpriteIndex] = useState(0);
    const [rightSpriteIndex, setRightSpriteIndex] = useState(0);
    const [jumpSpriteIndex, setJumpSpriteIndex] = useState(0);
    const [duckSpriteIndex, setDuckSpriteIndex] = useState(0);

    const leftSprites = [
        '/moves/left-1.png',
        '/moves/left-2.png',
        '/moves/left-3.png',
        '/moves/left-4.png',
        '/moves/left-5.png',
        '/moves/left-6.png'
    ];

    const rightSprites = [
        '/moves/right-1.png',
        '/moves/right-2.png',
        '/moves/right-3.png',
        '/moves/right-4.png',
        '/moves/right-5.png'
    ];

    const jumpSprites = [
        '/moves/jump-1.png',
        '/moves/jump-2.png',
        '/moves/jump-3.png',
        '/moves/jump-4.png',
        '/moves/jump-5.png',
        '/moves/jump-6.png',
        '/moves/jump-7.png'
    ];

    const duckSprites = [
        '/moves/dock-1.png',
        '/moves/dock-2.png',
        '/moves/dock-3.png',
        '/moves/dock-4.png',
        '/moves/dock-5.png'
    ];

    const moveLeft = () => {
        setPosition(prev => ({ ...prev, left: prev.left - 10 }));
        setIsMovingLeft(true);
        setIsMovingRight(false);
    }

    const moveRight = () => {
        setPosition(prev => ({ ...prev, left: prev.left + 10 }));
        setIsMovingRight(true);
        setIsMovingLeft(false);
    }

    const checkFall = () => {
        if (position.left < platformLeftEdge || position.left > platformRightEdge) {
            setIsFalling(true);
        }
    };

    const jump = () => {
        if (!isJumping && !isDucking) {
            setIsJumping(true);
            setJumpSpriteIndex(0);
            setPosition(prev => ({ ...prev, top: prev.top - 50 }));

            const jumpInterval = setInterval(() => {
                setJumpSpriteIndex(prevIndex => {
                    if (prevIndex < jumpSprites.length - 1) {
                        return prevIndex + 1;
                    }
                    clearInterval(jumpInterval);
                    return prevIndex;
                });
            }, 100);

            setTimeout(() => {
                setPosition(prev => ({ ...prev, top: prev.top + 50 }));
                setIsJumping(false);
                setJumpSpriteIndex(0);
                clearInterval(jumpInterval);
            }, 1000);
        }
    };

    const duck = () => {
        if (!isJumping) {
            setIsDucking(true);
        }
    };

    const standUp = () => {
        setIsDucking(false);
    };

    const spawnBullet = () => {
        if (!backgroundRef.current) return;

        const backgroundRect = backgroundRef.current.getBoundingClientRect();
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let bullet;

        if (direction === 'horizontal') {
            const fromLeft = Math.random() < 0.5;

            const yPosition = Math.random() < 0.5 ? -30 : -100;
            bullet = {
                id: Date.now(),
                direction: fromLeft ? 'left' : 'right',
                position: {
                    left: fromLeft ? -400 : backgroundRect.width + 700,
                    top: yPosition
                }
            };
        } else {
            bullet = {
                id: Date.now(),
                direction: 'down',
                position: {
                    left: Math.random() * backgroundRect.width,
                    top: -375
                }
            };
        }

        setBullets(prev => [...prev, bullet]);
    };

    const checkCollision = () => {
        setBullets((prevBullets) =>
            prevBullets.filter((bullet) => {
                const alienWidth = 100; // Character width is constant regardless of state.
                const alienHeight = isDucking ? 60 : 100; // Adjust height if ducking.
                const alienHitbox = {
                    left: position.left,
                    right: position.left + alienWidth,
                    top: position.top + (isDucking ? 40 : 0), // Lower the hitbox if ducking
                    bottom: position.top + alienHeight + (isDucking ? 40 : 0), // Adjust for ducking
                };

                const bulletHitbox = {
                    left: bullet.position.left,
                    right: bullet.position.left + 30,
                    top: bullet.position.top,
                    bottom: bullet.position.top + 30,
                };

                const isCollision =
                    alienHitbox.left < bulletHitbox.right &&
                    alienHitbox.right > bulletHitbox.left &&
                    alienHitbox.top < bulletHitbox.bottom &&
                    alienHitbox.bottom > bulletHitbox.top;

                if (isCollision) {
                    setHealth((prevHealth) => Math.max(prevHealth - 10, 0));
                    if (health <= 10) {
                        alert('Game Over');
                    }
                    return false;
                }

                return true;
            })
        );
    };

    useEffect(() => {
        const idleAnimation = setInterval(() => {
            setIdleSprite(prev =>
                prev === '/moves/idle-1.png' ? '/moves/idle-2.png' : '/moves/idle-1.png'
            );
        }, 500);

        return () => clearInterval(idleAnimation);
    }, []);

    useEffect(() => {
        if (isMovingLeft) {
            const leftAnimation = setInterval(() => {
                setLeftSpriteIndex(prevIndex => (prevIndex + 1) % leftSprites.length);
            }, 100);

            return () => clearInterval(leftAnimation);
        }
    }, [isMovingLeft]);

    useEffect(() => {
        if (isMovingRight) {
            const rightAnimation = setInterval(() => {
                setRightSpriteIndex(prevIndex => (prevIndex + 1) % rightSprites.length);
            }, 100);

            return () => clearInterval(rightAnimation);
        }
    }, [isMovingRight]);

    useEffect(() => {
        let duckAnimation;
        if (isDucking) {
            duckAnimation = setInterval(() => {
                setDuckSpriteIndex(prevIndex => (prevIndex + 1) % duckSprites.length);
            }, 100);
        }

        return () => clearInterval(duckAnimation);
    }, [isDucking]);

    useEffect(() => {
        checkFall();
    }, [position.left]);

    useEffect(() => {
        if (isFalling) {
            setTimeout(() => {
                setHealth(0);
                alert('Game Over');
            }, 2000);

            const fallInterval = setInterval(() => {
                setPosition(prev => ({ ...prev, top: prev.top + 10 }));
                if (position.top > window.innerHeight) {
                    clearInterval(fallInterval);
                }
            }, 100);
            return () => clearInterval(fallInterval);
        }
    }, [isFalling]);

    useEffect(() => {
        const moveBullets = setInterval(() => {
            setBullets(prevBullets =>
                prevBullets.map(bullet => {
                    if (bullet.direction === 'left') {
                        return { ...bullet, position: { ...bullet.position, left: bullet.position.left + bulletSpeed } };
                    } else if (bullet.direction === 'right') {
                        return { ...bullet, position: { ...bullet.position, left: bullet.position.left - bulletSpeed } };
                    } else if (bullet.direction === 'down') {
                        return { ...bullet, position: { ...bullet.position, top: bullet.position.top + bulletSpeed } };
                    }
                    return bullet;
                }).filter(bullet => bullet.position.left < window.innerWidth && bullet.position.top < window.innerHeight)
            );
        }, 100);

        const collisionCheckInterval = setInterval(checkCollision, 100);

        return () => {
            clearInterval(moveBullets);
            clearInterval(collisionCheckInterval);
        };
    }, [position, isDucking]);

    useEffect(() => {
        const bulletSpawner = setInterval(spawnBullet, bulletSpawnInterval);
        return () => clearInterval(bulletSpawner);
    }, []);

    const healthBarStyle = {
        position: 'absolute',
        bottom: '80px',
        right: '30px',
        width: '150px',
        height: '30px',
        backgroundColor: 'grey',
        border: '4px solid white'
    };

    const healthFillStyle = {
        width: `${health}%`,
        height: '100%',
        backgroundColor: 'green'
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                moveLeft();
            }
            else if (e.key === 'ArrowRight' || e.key === 'd') {
                moveRight();
            }
            else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') {
                jump();
            }
            else if (e.key === 'ArrowDown' || e.key === 's') {
                duck();
            }
        };

        const handleKeyRelease = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                setIsMovingLeft(false);
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                setIsMovingRight(false);
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                standUp();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
        };
    }, [isJumping, isDucking]);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                maxWidth: "100%",
                maxHeight: "100%",
                backgroundImage: 'url(/moves/bg.png)',
                backgroundSize: "100% 100%",
                objectFit: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Health bar */}
            <Box sx={healthBarStyle}>
                <Box sx={healthFillStyle}></Box>
                <span style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '2px',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: 'bold', // Bold text for better visibility
                    fontSize: '14px',   // Adjust the font size
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' // Add a shadow for contrast
                }}>
                    {health}
                </span>
            </Box>

            {/* Box for platform */}
            <Box
                ref={backgroundRef}
                sx={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "35%",
                    height: "55%",
                    backgroundImage: 'url(/moves/area.png)',
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    //border:'2px solid white'
                }}>
                {/* Bullets */}
                {bullets.map((bullet) => (
                    <Box
                        key={bullet.id}
                        sx={{
                            position: "absolute",
                            width: "30px",
                            height: "30px",
                            left: `${bullet.position.left}px`,
                            top: `${bullet.position.top}px`,
                            backgroundImage: `url(${
                                bullet.direction === 'left'
                                    ? '/moves/bullet_h_right.png'
                                    : bullet.direction === 'right'
                                        ? '/moves/bullet_h_left.png'
                                        : '/moves/bullet_v.png'
                            })`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            //border: "2px solid white"
                        }}
                    ></Box>
                ))}

                {/* Alien character */}
                <Box
                    sx={{
                        position: "absolute",
                        width: isDucking ? "100px" : "100px",
                        height: isDucking ? "60px" : "100px",
                        left: `${position.left}px`,
                        top: `${isDucking ? position.top + 40 : position.top}px`,
                        backgroundImage: `url(${
                            isFalling
                                ? jumpSprites[4]
                                : isJumping
                                    ? jumpSprites[jumpSpriteIndex]
                                    : isMovingLeft
                                        ? leftSprites[leftSpriteIndex]
                                        : isMovingRight
                                            ? rightSprites[rightSpriteIndex]
                                            : isDucking
                                                ? duckSprites[duckSpriteIndex]
                                                : idleSprite
                        })`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }}
                ></Box>
            </Box>
        </Box>
    );
};

export default PatutiGame;