import type { NeighborsItem } from '@/stores/engine'
import { elementDictionary} from '@/components/elements/periodic'

export function scoreAtomicNumbers(result: NeighborsItem[]) : number{
    let total = 0;

  for (const item of result) {
    const element = elementDictionary[item.element];

    if (element) {
      total += element.atomicNumber;
    } else {
      console.warn(`Elemento ${item.element} não encontrado no dicionário.`);
    }
  }
  console.log(total)
  return total

}