/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Minus, Plus, X, RotateCcw, Equal } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

interface CalcButtonProps {
  label: string | ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'equals' | 'clear';
  span?: number;
}

const CalcButton = ({ label, onClick, variant = 'number', span = 1 }: CalcButtonProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'operator':
        return 'bg-[#81A6C6] text-white font-bold';
      case 'equals':
        return 'bg-[#AACDDC] text-slate-800 font-bold';
      case 'clear':
        return 'bg-[#81A6C6] text-white font-bold';
      default:
        return 'bg-[#D2C4B4] text-slate-800 font-bold';
    }
  };

  const getShadows = () => {
    return 'shadow-[6px_6px_12px_#d9c9b5,-6px_-6px_12px_#ffffff]';
  };

  const getPressedShadows = () => {
    return 'shadow-[inset_4px_4px_8px_#d9c9b5,inset_-4px_-4px_8px_#ffffff]';
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (window.navigator.vibrate) window.navigator.vibrate(10);
        onClick();
      }}
      className={`
        relative flex items-center justify-center rounded-2xl text-xl transition-all duration-100
        ${getStyles()}
        ${getShadows()}
        active:${getPressedShadows()}
        ${span === 2 ? 'col-span-2' : ''}
        h-16 w-full
      `}
    >
      {label}
    </motion.button>
  );
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(prev => (prev === '0' ? num : prev + num));
    }
  };

  const handleOperator = (op: Operator) => {
    const current = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }
    
    setOperator(op);
    setEquation(`${display} ${op === '*' ? '×' : op === '/' ? '÷' : op}`);
    setShouldReset(true);
  };

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || !operator) return;
    
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    
    setEquation(`${prevValue} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${current} =`);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E3D0] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-[360px] bg-[#F3E3D0] rounded-[40px] p-6 shadow-[20px_20px_60px_#d9c9b5,-20px_-20px_60px_#ffffff] border border-white/20">
        
        {/* Display Screen */}
        <div className="mb-8 p-6 rounded-3xl bg-[#F3E3D0] shadow-[inset_6px_6px_12px_#d9c9b5,inset_-6px_-6px_12px_#ffffff] flex flex-col items-end justify-end min-h-[140px] overflow-hidden border border-[#D2C4B4]/30">
          <div className="text-slate-500 text-sm mb-1 h-6 font-medium truncate w-full text-right">
            {equation}
          </div>
          <motion.div 
            key={display}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight break-all text-right w-full"
          >
            {display}
          </motion.div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-4">
          <CalcButton label={<RotateCcw size={20} />} onClick={handleClear} variant="clear" />
          <CalcButton label={<Delete size={20} />} onClick={handleBackspace} variant="operator" />
          <CalcButton label={<Divide size={20} />} onClick={() => handleOperator('/')} variant="operator" />
          <CalcButton label={<X size={20} />} onClick={() => handleOperator('*')} variant="operator" />

          <CalcButton label="7" onClick={() => handleNumber('7')} />
          <CalcButton label="8" onClick={() => handleNumber('8')} />
          <CalcButton label="9" onClick={() => handleNumber('9')} />
          <CalcButton label={<Minus size={20} />} onClick={() => handleOperator('-')} variant="operator" />

          <CalcButton label="4" onClick={() => handleNumber('4')} />
          <CalcButton label="5" onClick={() => handleNumber('5')} />
          <CalcButton label="6" onClick={() => handleNumber('6')} />
          <CalcButton label={<Plus size={20} />} onClick={() => handleOperator('+')} variant="operator" />

          <CalcButton label="1" onClick={() => handleNumber('1')} />
          <CalcButton label="2" onClick={() => handleNumber('2')} />
          <CalcButton label="3" onClick={() => handleNumber('3')} />
          <CalcButton label={<Equal size={20} />} onClick={handleEquals} variant="equals" />

          <CalcButton label="0" onClick={() => handleNumber('0')} span={2} />
          <CalcButton label="." onClick={() => handleNumber('.')} />
          <div className="invisible" /> {/* Placeholder for grid alignment if needed, but 0 spans 2 */}
        </div>
      </div>
    </div>
  );
}
