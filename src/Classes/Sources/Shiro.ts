import qs from 'qs';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class Shiro extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'English';
    
    source: TaiyakiSourceTypes = 'Shiro';
        
    baseUrl = 'https://shiro.is/';
    
    options = { hasCloudflare: false, name: 'Shiro.is'};
	
	async getToken(): Promise<string> {
    	let html = await(await fetch('https://shiro.is')).text()
    	let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1]
    	script = await(await fetch(script)).text()
    	return script.match(/token\:\"(.*?)\"/)[1]
	}
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({
        	'search': title,
        	'token': await this.getToken()
    	})
        const link = `https://ani.api-web.site/advanced?${params}`
        var searchResults = JSON.parse(await (await fetch(link)).text()).data.nav
        if (typeof searchResults != "undefined") {
        	searchResults = searchResults.currentPage.items
        	return searchResults.map(result => {
        		return {
        			title: result['name'],
        			image: 'https://ani-cdn.api-web.site/' + result['image'],
        			embedLink: 'https://shiro.is/anime/' + result['slug']
        		}
        	})
    	} else {
        	return [] // returns [] as in "no results were found"
    	}
    }

    async availableEpisodes(link: string): Promise<string[]> {
		const slug = link.replace('https://shiro.is/anime/', '')
		const params = qs.stringify({'token': await this.getToken()})
		const api_link = 'https://ani.api-web.site/anime/slug/' + slug  + '?' + params
		
		const response = await (await fetch(api_link)).json()
		if (response['status'] == 'Found') {
			return response['data']['episodes'].map(episode => {
				return 'https://ani.googledrive.stream/vidstreaming/vid-ad/' + episode['videos'][0]['video_id']
			})
		} else {
			return [] // returns [] as in "no episodes were found"
		}
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
		const html = await (await fetch(episodeLink)).text()
		const sources = JSON.parse('{' + html.match(/window\.data\ \=\ \{(.*)\}/)[1] + '}')
		return [sources.source[0].file, sources.source_bk[0].file].map(source => {
			return {
				link: source,
				'server': 'Custom'
			}
		})
    }
}

export default Shiro;
