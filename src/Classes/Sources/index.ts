import SourceAbstract from './SourceAbstract';
import Vidstreaming from './Vidstreaming';
import FourAnime from './FourAnime';
import AnimeOwl from './AnimeOwl';
import KimAnime from './KimAnime';
import XSAnime from './Xsanime';
import AnimeRush from './AnimeRush';
import TioAnime from './TioAnime';
import Anime8 from './Anime8';
import Shiro from './Shiro';
import AniWatch from './Aniwatch';
import AnimeWorld from './AnimeWorld';
//STEP 1: Import the file above (Place at the end)

//STEP 2: Add a unique name
export type TaiyakiSourceTypes= 
'Vidstreaming' | 
'FourAnime' | 
'AnimeOwl' | 
'KimAnime' | 
'XSAnime' | 
'AnimeRush' |
'Anime8' |
'TioAnime' |
'Shiro' |
'AniWatch' |
'AnimeWorld';

//STEP 3(OPTIONAL): If the source uses a language not added here put the proper language, if possible use Alphabetic order
export type TaiyakiSourceLanguage = 'Arabic'| 'English' | 'French' | 'Italian' | 'Spanish';

export const TaiyakiSourceLanguageArray = ['All', 'English','French','Spanish'];

//STEP 4: Add the class constructor here (Place at the end)
const sourceAbstractList: SourceAbstract[] = [
    new Vidstreaming(),
    new FourAnime(),
    // new AnimeOwl(),
    // new KimAnime(),
    // new AnimeRush(),
    new TioAnime(),
    new AniWatch(),
    // new XSAnime(),
    new Anime8(),
    new Shiro(),
    new AnimeWorld(),
].sort((a, b) => a.options.name.localeCompare(b.options.name));

//STEP 5: Add a map using the unique name from STEP 2, to the proper class constructor
export const MapSourceTypesToAbstract = new Map<TaiyakiSourceTypes, SourceAbstract>([
    ['Vidstreaming', new Vidstreaming()],
    ['FourAnime', new FourAnime()],
    ['AnimeOwl', new AnimeOwl()],
    ['KimAnime', new KimAnime()],
    ['Anime8', new Anime8()],
    ['TioAnime', new TioAnime()],
    ['XSAnime', new XSAnime()],
    ['AnimeRush', new AnimeRush()],
    ['Shiro', new Shiro()],
    ['AniWatch', new AniWatch()],
    ['AnimeWorld', new AnimeWorld()],
])

//STEP 6: Finally add the imported class from STEP 1 (Place at the end)
export {
    SourceAbstract,
    sourceAbstractList,
    Vidstreaming,
    FourAnime,
    AnimeOwl,
    KimAnime,
    Anime8,
    Shiro,
    AniWatch,
    AnimeWorld,
}
