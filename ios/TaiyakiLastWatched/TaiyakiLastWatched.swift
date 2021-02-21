//
//  TaiyakiLastWatched.swift
//  TaiyakiLastWatched
//
//  Created by Michael Garcia on 2/4/21.
//

import WidgetKit
import SwiftUI
import Intents
import URLImage

struct HistoryModel: Decodable {
  let id: Int, title: String, image: String, bannerImage: String?;
}

let placeHolderHistory: HistoryModel = HistoryModel(id: 19815, title: "No Game No Life", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx19815-bIo51RMWWhLv.jpg", bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/19815.jpg")

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
       SimpleEntry(date: Date(), history: placeHolderHistory);
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        completion(SimpleEntry(date: Date(), history: placeHolderHistory))
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
      
      var historyData: HistoryModel = placeHolderHistory;
      
      let sharedDefaults = UserDefaults.init(suiteName: "group.com.izanamiNightz")
                if sharedDefaults != nil {
                      do{
                        let shared = sharedDefaults?.string(forKey: "historyWidgetData")
                        if(shared != nil){
                        let data = try JSONDecoder().decode(HistoryModel.self, from: shared!.data(using: .utf8)!)
                          historyData = data;
                        }
                      }catch{
                        print(error)
                      }
                }

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
         
          
          
            let entry = SimpleEntry(date: entryDate, history: historyData)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
  let date: Date, history: HistoryModel;
}


struct TaiyakiLastWatchedEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      ZStack(alignment: .leading) {
        URLImage(url: URL(string: entry.history.image)!) { image in
          image
            .resizable()
            .scaledToFill()
        }
        Color.blue
          .ignoresSafeArea()
          .opacity(0.75)

        VStack(alignment: .leading) {
          Text(entry.history.title)
            .font(.system(size: 18))
            .bold()
        }.scaledToFill()
      }.scaledToFill()
    }
}

@main
struct TaiyakiLastWatched: Widget {
    let kind: String = "TaiyakiLastWatched"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            TaiyakiLastWatchedEntryView(entry: entry)
        }
        .configurationDisplayName("Last Viewed Anime")
        .description("Quickly access your last watched anime.")
    }
}

struct TaiyakiLastWatched_Previews: PreviewProvider {
    static var previews: some View {
        TaiyakiLastWatchedEntryView(entry: SimpleEntry(date: Date(), history: placeHolderHistory))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

//struct TaiyakiHistoryWidget: View {
//  var body: some View {
//    ZStack {
//      VStack(alignment: .leading) {
//        HStack {
//          
//        }
//      }
//    }
//  }
//}
