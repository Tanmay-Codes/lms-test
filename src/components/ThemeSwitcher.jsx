import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from './ui/Button';
import { 
  setTheme, 
  setColorTheme, 
  selectTheme, 
  selectColorTheme 
} from '../lib/redux/slices/themeSlice';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const currentColorTheme = useSelector(selectColorTheme);
  const [showColorOptions, setShowColorOptions] = useState(false);

  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  // Function to change color theme
  const changeColorTheme = (color) => {
    dispatch(setColorTheme(color));
    setShowColorOptions(false);
  };

  // Close color options when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowColorOptions(false);
    };

    if (showColorOptions) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColorOptions]);

  return (
    <div className="flex items-center space-x-2">
      {/* Dark/Light mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {currentTheme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {/* Color theme selector */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorOptions(!showColorOptions);
          }}
          aria-label="Change color theme"
        >
          <Palette className="h-5 w-5" />
        </Button>

        {/* Color options dropdown */}
        {showColorOptions && (
          <div className="absolute right-0 mt-2 w-36 bg-background border border-border rounded-md shadow-lg p-2 z-50">
            <div className="flex flex-col space-y-1">
              <ColorOption
                color="blue"
                isActive={currentColorTheme === 'blue'}
                onClick={() => changeColorTheme('blue')}
              />
              <ColorOption
                color="purple"
                isActive={currentColorTheme === 'purple'}
                onClick={() => changeColorTheme('purple')}
              />
              <ColorOption
                color="green"
                isActive={currentColorTheme === 'green'}
                onClick={() => changeColorTheme('green')}
              />
              <ColorOption
                color="orange"
                isActive={currentColorTheme === 'orange'}
                onClick={() => changeColorTheme('orange')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Color option component
function ColorOption({ color, isActive, onClick }) {
  // Color mapping for theme options
  const colorMap = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'flex items-center w-full p-2 rounded-md hover:bg-accent',
        isActive && 'bg-accent/50'
      )}
    >
      <div className={cn('h-4 w-4 rounded-full mr-2', colorMap[color])} />
      <span className="capitalize">{color}</span>
    </button>
  );
} 