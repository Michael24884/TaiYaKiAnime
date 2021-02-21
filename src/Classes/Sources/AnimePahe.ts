import qs from 'qs';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class AnimePahe extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'English';
    source: TaiyakiSourceTypes = 'AnimePahe';
    baseUrl = 'https://animepahe.com';
    options = { hasCloudflare: false, name: 'AnimePahe'};
    

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({
            'm': "search",
            'l': 8,
            'q': title
    	})
        const settings = {
            headers: {
                'referer': 'https://animepahe.com/'
            }
        }
        const link = `https://animepahe.com/api?${params}`
        var searchResults = await (await fetch(link, settings)).json()
        if (searchResults['total'] != 0) {
            return searchResults['data'].map( result => {
                return {
                    title: `${result.title} (${result.type})`,
                    link: 'https://animepahe.com/anime/' + result.session + '/' + result.id,
                    embedLink : result.poster
                }
            })
        } else {
            return []
        }
    }

    async availableEpisodes(link: string): Promise<string[]> {
		const attr = link.split('/')
        const session = attr[attr.length - 2], id = attr[attr.length - 1]
        var page = 1
        var apiUri = 'https://animepahe.com/api?m=release&id='+ id +'&sort=episode_asc&page='
        var jsonResponse = await (await fetch(apiUri + page, {method: 'GET', headers: {'referer': 'https://animepahe.com/'}})).json()
        var episodesList = [...jsonResponse['data']]
        var current_page = jsonResponse['current_page']
        const lastPage = jsonResponse['last_page']

        while (current_page < lastPage) {
            page++
            jsonResponse = await (await fetch(apiUri + page, {method: 'GET', headers: {'referer': 'https://animepahe.com/'}})).json()
            current_page = jsonResponse['current_page']
            episodesList = [...episodesList, ...jsonResponse['data']]
        }

        return episodesList.map(episode => {
            return 'https://animepahe.com/api?m=links&id=' + episode.anime_id + '&session='+ episode.session +'&p=kwik'
        })
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
		const settings = {
            headers: {
                Referer: 'https://animepahe.com/'
            }
        }
        const res = await (await fetch(episodeLink, settings)).json()
        const qualities = []
        for (const video of res.data) {
            if (video.hasOwnProperty('720')) {
                qualities.push({
                    link: video['720'].kwik,
                    label: '720p',
                    server: 'kwik'
                })
            } else if (video.hasOwnProperty('1080')) {
                qualities.push({
                    link: video['1080'].kwik,
                    label: '1080p',
                    server: 'kwik'
                })
            }
        }
		return qualities
    }
}

export default AnimePahe;
