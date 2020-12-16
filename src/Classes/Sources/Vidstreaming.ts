import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class Vidstreaming implements SourceAbstract {
    
    source: TaiyakiSourceTypes = 'Vidstreaming';
    
    controller: AbortController = new AbortController();

    language: TaiyakiSourceLanguage = 'English';
    
    
    baseUrl = 'https://vidstreaming.io';
    
    options = { hasCloudflare: false, name: 'Vidstreaming'};
    
    destroy() {
        this.controller.abort();
    }
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        
        const response = await (await fetch(this.baseUrl + '/search.html?' + qs.stringify({keyword: title}), {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $('li.video-block').toArray().map((e: any) => {
                        const newTitle = $(e).find('div.picture').find('img[src]').attr('alt');
                        const link = `https://vidstreaming.io${$(e).find('a').attr('href')}`;
                        const image = $(e).find('div.picture').find('img').attr('src');
                        return {
                            title: newTitle,
                            image,
                            embedLink: link
                        };
                    });
    }

    async availableEpisodes(link: string): Promise<string[]> {
        const response = await (await fetch(link, {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $('ul.listing.items.lists > li.video-block').toArray().map((element: any, _index: number) => {
                        const epLink = $(element).find('a').attr('href');
                        return `https://vidstreaming.io${epLink}`;
                    }).reverse();
        
    }
    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
     
    const directLink = await this._prefetch(episodeLink);
    const documentFetch = await fetch(directLink);
    const document = await documentFetch.text();
    const $ = cheerio.load(document);
    return $('ul.list-server-items').find('li.linkserver').toArray().map((element: any) => {
        if ($(element).attr('data-status') == '1') {
            const _mint = $(element).text().trim();
            if (_mint === 'Server Hyrax') return;
            if (_mint === 'Easyload') return;
            const hostName = $(element).text().trim();
            let _hostLink = $(element).attr('data-video');
            if (_hostLink.startsWith('/')) _hostLink = 'https:' + _hostLink;
            return {
                server: hostName,
                link: _hostLink
            };
        }
    });
    }

    private async _prefetch(episodeLink: string): Promise<string> {
        const pageData = await fetch(episodeLink);
        const pageText = await pageData.text();
        const $ = cheerio.load(pageText);
        const phpFile = $('div.watch_play').find('div.play-video').find('iframe').attr('src');
        return `https:${phpFile}`;
    }

}

export default Vidstreaming; 