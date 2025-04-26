import { getChangeBgClass, getArrowIcon } from '@/components/statCard';
import { ArrowUp, ArrowDown } from 'lucide-react';

describe('getChangeBgClass', () => {
  it('retorna clase verde para valores positivos', () => {
    expect(getChangeBgClass(5)).toBe('bg-green-100 text-green-800');
  });

  it('retorna clase roja para valores negativos', () => {
    expect(getChangeBgClass(-2)).toBe('bg-red-100 text-red-800');
  });

  it('retorna string vacío para cero', () => {
    expect(getChangeBgClass(0)).toBe('');
  });
});

describe('getArrowIcon', () => {
  it('retorna ArrowUp para cambio positivo', () => {
    expect(getArrowIcon(3)).toBe(ArrowUp);
  });

  it('retorna ArrowUp también para cero', () => {
    expect(getArrowIcon(0)).toBe(ArrowUp);
  });

  it('retorna ArrowDown para negativo', () => {
    expect(getArrowIcon(-1)).toBe(ArrowDown);
  });
});
