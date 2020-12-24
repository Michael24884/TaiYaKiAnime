import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { SourceAbstract, TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';


class XAnime extends SourceAbstract {
    
    headers?: Record<string, string> | undefined = {
        Referer: 'https://www.xsanime.com/',
        Host: 'ww.xsanime.com',
    };
    baseUrl: string = 'https://www.xsanime.com';
    source: TaiyakiSourceTypes = 'XSAnime';
    language: TaiyakiSourceLanguage = 'Arabic';
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: 'XSAnime'};
    

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({search: title});
        const url = this.baseUrl + '/wp-content/themes/YourColor-XSAnime/SearchComplete.php?tpe=&' + params;
        const response = await (await fetch(url, {headers: this.headers, signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $('div.allResults > div.ListPostsSearh')
        .toArray()
        .map((e: any) => {
            const title = $(e)
            .find('a')
            .text();
            const link = $(e)
            .find('a')
            .attr('href');
            return {title, embedLink: link};
        });
            
    }
    async availableEpisodes(link: string): Promise<string[]> {
        const response = await (await fetch(link, {signal: this.controller.signal, headers: this.headers})).text();
        const $ = cheerio.load(response);
        return $('ul.InnerESP > li')
        .toArray()
        .map((e: any) => {
            const links = $(e)
            .find('a')
            .attr('href');
            return links;
        });

        
    }
    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        
        const response = await (await fetch(episodeLink, {signal: this.controller.signal, headers: this.headers})).text();
        const $ = cheerio.load(response) 
        const shortlink = $('link[rel=shortlink]').attr('href')
        const id = Number(shortlink.split('=')[1]);
        
        const list: {link: string; server: string}[] = $('ul.WatchServers > li')
        .toArray()
        .map((e: any) => {
            const link = $(e)
            .attr('data-i');
            const server = $(e)
            .text();
            return {link, server};
        });
        const extractedEmbedLinks: {link: string; server: string}[] = [];
         for (let obj of list) {
          
            console.log('the obj', obj)
            const body = qs.stringify({
                action: 'GetServer',
                post: id.toString(),
                i: obj.link,
                server: '',
            });

            const serverResponse = await (await fetch(this.baseUrl + '/wp-admin/admin-ajax.php', 
            {
            signal: this.controller.signal, 
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Host': 'ww.xsanime.com'}, 
            method: 'POST', 
            body, 
            keepalive: true,
            mode: 'no-cors',
            })).text();
            const document = cheerio.load(serverResponse);
            console.log(serverResponse)
            const link = document.find('iframe').attr('src');
            extractedEmbedLinks.push({server: obj.server, link});
        }
        console.log('the final links', extractedEmbedLinks)
        return extractedEmbedLinks;
    }

}

export default XAnime;
