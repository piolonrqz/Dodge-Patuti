import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState({ top: 100, left: 150 });
  const [frame, setFrame] = useState(0);

  const centerAreaHeight = 200;
  const centerAreaWidth = 400; 
  const patutiHeight = 160;
  const patutiWidth = 150;

  useEffect(() => {
    const handleKeyPress = (e) => {
      setPosition((prevPos) => {
        const step = 20;
        const newPos = { ...prevPos };

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            newPos.top = Math.max(newPos.top - step, 0);
            break;
          case 'ArrowDown':
          case 's':
            newPos.top = Math.min(newPos.top + step, centerAreaHeight - patutiHeight);
            break;
          case 'ArrowLeft':
          case 'a':
            newPos.left = Math.max(newPos.left - step, 0);
            break;
          case 'ArrowRight':
          case 'd':
            newPos.left = Math.min(newPos.left + step, centerAreaWidth - patutiWidth);
            break;
          default:
            break;
        }

        setFrame((prevFrame) => (prevFrame + 1) % 4);
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <div className="backgroundImg">
        <div className="center-area" 
        style={{ 
          height: `${centerAreaHeight}px`, width: `${centerAreaWidth}px` }}>
          <div
            className={`patuti frame-${frame}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              position: 'absolute',
              width: `${patutiWidth}px`,
              height: `${patutiHeight}px`,
              zIndex: 2,
            }}
          ></div>

          {/* Display Patuti's life */}
          <div className="lifeCounter">
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
