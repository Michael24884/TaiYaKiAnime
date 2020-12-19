import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class Anime8 implements SourceAbstract {
    
    source: TaiyakiSourceTypes = 'Anime8';
    
    controller: AbortController = new AbortController();

    
    
    baseUrl = 'https://anime8.ru/';
    
    options = { hasCloudflare: false, name: 'Anime8'};
    
    destroy() {
        this.controller.abort();
    }
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        
        const response = await (await fetch(source.baseUrl + "Search/?" + qs.stringify({s: title}))).text();
        const $ = cheerio.load(response);
        return $('div.ml-item > a').toArray().map((e: any) => {
                        const newTitle = $(e).find("h2").text().trim();
                        const link = $(e).attr("href");
                        const image = $(e).find("img").attr("data-original");
                        return {
                            title: newTitle,
                            image,
                            embedLink: link
                        };
                    });
    }

    async availableEpisodes(link: string): Promise<string[]> {
        var response = await (await fetch(link, {signal: this.controller.signal})).text();
        var $ = cheerio.load(response);

        newLink = $("div#mv-info").find('a').attr('href');

        _response = await (await fetch(newLink)).text();
        $ = cheerio.load(_response);

        var eps = $('a[href*="'+ episodeLink +'Episode-"]').toArray().map((e) => {
            const link = $(e).attr("href");
            let episodeType = link.split('/');
            episodeType = episodeType[episodeType.length - 1].split('?')[0];
            if (episodeType.includes('-Sneak-Peak')) { return }
            return link;
        }).filter(episode => episode != undefined);
        
        return eps;
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
     
        const servers = ['fserver', 'fdserver', 'oserver'];
        const _response = await (await fetch(episodeLink)).text();
        const ctk = _response.match(/ctk\s+=\s+'(.*)?';/)[0].replace('ctk = ', '').replace(/'/g, '').replace(';', '');
        const id = _response.match(/episode_id\s*=\s*([^;]*)/)[1];
        var $ = cheerio.load(_response);
        postData = "episode_id="+id+"&ctk="+ctk;
        const init = {
            "method": 'POST',
            "body": postData,
            "headers": {"Content-Type": "application/x-www-form-urlencoded"}
        }
        var sourcesFound = [];
        for (let i=0; i < servers.length; i++) {
            var res = await fetch("https://anime8.ru/ajax/anime/load_episodes_v2?s="+servers[i], init);
            const response = await res.json();
            if (response['status'] && response['value'].includes('src=')) {
                $ = cheerio.load(response['value']);
                entry = {
                    link: $('iframe').attr('src'),
                    server: "streamx"
                }
                sourcesFound.push(entry);
            }
        }
        return sourcesFound;
    }
}

export default Anime8;
