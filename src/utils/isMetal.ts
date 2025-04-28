// isMetal.ts
import { elementDictionary } from '@/components/elements/periodic';

export function isMetal(elementSymbol: string): boolean {
  const metalClasses = [
    'metal', 
    'transition-metal', 
    'alkali-metal', 
    'alkaline-earth-metal', 
    'lanthanide', 
    'actinide'
  ];
  
  const element = elementDictionary[elementSymbol];
  return element ? metalClasses.includes(element.class) : false;
}
