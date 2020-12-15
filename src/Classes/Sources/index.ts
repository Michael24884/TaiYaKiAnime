import  SourceAbstract from './SourceAbstract';
import Vidstreaming from './Vidstreaming';

export type TaiyakiSourceTypes= 'Vidstreaming';


const sourceAbstractList: SourceAbstract[] = [
    new Vidstreaming()
];

export const MapSourceTypesToAbstract = new Map<TaiyakiSourceTypes, SourceAbstract>([
    ['Vidstreaming', new Vidstreaming()],
])

export {
    SourceAbstract,
    Vidstreaming,
    sourceAbstractList,
}