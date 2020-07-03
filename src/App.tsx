import React, { useRef, useEffect, useState, useContext, createContext } from 'react';
import logo from './logo.svg';
import mock1 from './assets/mock.svg';
import queueMock from './assets/queue_mock.svg';
import genreMock from './assets/genre_mock.svg';
import malLogo from './assets/malLogo.png';
import anilistLogo from './assets/anilistLogo.png';
import { Toolbar, AppBar } from '@material-ui/core';
import { Row } from 'react-grid-system';
import './App.css';
import Grid from './components/grid';
import PlatformButtons from './components/buttons';
import { githubLink } from './models/constants';
import ParticlesBg, { ConfigProp } from 'particles-bg';



const _scrollHere = (ref: any) => window.scrollTo({ behavior: "smooth", top: ref?.current?.offsetTop });


const Body = () => {
  const context = useContext(provider);

  return (
    <React.Fragment>
      <div className="Body">
        <div className={["Header", "Title"].join(" ")}>Taiyaki</div>
        <div className={["Desc", "Roboto"].join(" ")}>Watch and sync your anime</div>
        <div className="Container-items">
          <PlatformButtons
            platform={"ios"}
            onClick={() => window.open(githubLink + "/releases")}
          />
          <PlatformButtons
            platform={"android"}
            onClick={() => window.open(githubLink + "/releases")}
          />
        </div>
        <PlatformButtons
          platform={"github"}
          onClick={() => window.open(githubLink)}
        />
        <span
          style={{ fontStyle: "italic" }}
        >Note: Taiyaki is currently in Beta. You may encounter bugs</span>

        {(context) &&
          <p style={{ fontStyle: "italic", color: "green" }}>Latest Version: {context}</p>
        }
      </div>
    </React.Fragment>
  );
}

const LogoView = () => {
  return (
    <React.Fragment>
      <div className="Logo-view">
        <img src={logo} className="Logo" alt="logo" />
        <Body />
      </div>
    </React.Fragment>
  );
}

function Image() {
  return (
    <img src={mock1} className="Mock1" alt="mock" style={{ alignSelf: "center" }} />
  );
}

const Features = () => {
  return (
    <div className="Feature-view" style={{ flexDirection: "column", flex: "display" }} >
      <div className={"Feature-header"}>
        <h2 className="Feature-title" style={{ justifyItems: "center", alignSelf: 'center' }}>App Features</h2>
      </div>
      <Row>
        <div className={["Feature-container", "Feature-margin-left"].join(" ")}>
          <h1>Queue Manager</h1>
          <span>No one likes to waste their time switching anime, especially on a cliffhanger. </span>
          <span>Binge up with all your favorites. Taiyaki allows you to queue up your anime so you can watch them all in one place, right after the other. So in shorter terms, binge watching.</span>
        </div>
        <img src={queueMock} className="Feature-mocks" alt="features" />
      </Row>

      <Row>
        <img src={genreMock} className="Feature-mock-genre" alt="features" />
        <div className={["Feature-container", "Feature-margin-right"].join(" ")}>
          <h1>Genre Discovery</h1>
          <span>Can't find the perfect anime?</span>
          <p>Discover anime based on your genre preference, with data straight from Anilist. With over a a thousand anime, you'll eventually find something interesting</p>
        </div>
      </Row>
      <TrackerSyncSupport />
    </div>
  )
}


const TrackerSyncSupport = () => {
  return (
    <Row align="center">
      <div className={["Feature-container", "Feature-margin-left"].join(" ")}>
        <h1>Multi Sync</h1>
        <span>Use a tracking service?</span>
        <p>Taiyaki supports multiple third party lists. And with smart automatic sync, that will only update your list when you're about to finish your episode, and even update to all services simutaenously. More support will be coming for even more tracking support</p>
      </div>
      <div>
        <img src={malLogo} className="Tracker-logo" alt="malLogo" />
        <img src={anilistLogo} className="Tracker-logo" alt="anilistLogo" />
      </div>
    </Row>
  );
}


const provider = createContext("");
function App() {
  const _ref = useRef(null);
  const _featureRef = useRef(null);
  const _scroll = (ref: any) => _scrollHere(ref);
  const [latestVersion, setVersion] = useState("");


  useEffect(() => {
    _findLatestRelease();
  }, []);

  const _findLatestRelease = () => {
    fetch("https://api.github.com/repos/Michael24884/TaiYakiAnime/releases")
      .then((response) => response.json())
      .then((json) => setVersion(json[0].name))
  }

  let config: ConfigProp = {
    num: [4, 7],
    rps: 1.2,
    radius: [5, 40],
    life: [1, 9],
    v: [2, 3],
    tha: [-40, 40],
    alpha: [1.0, 0.0],
    scale: [0, 1],
    f: [-1, -1],
    position: 'all',
    color: ["#3ddc97", "#ea638c"],
    cross: "cross",
    g: 0,
    random: 10,

  };

  return (
    <React.Fragment>

      <provider.Provider value={latestVersion}>
        <div className="App">
          <a style={{ backgroundColor: "#19154F", zIndex: -1, display: "flex", position: 'absolute', height: '100%', width: '100%' }} />
          <header className="App-header">

            <AppBar position="fixed">
              <Toolbar className="Tool-bar">{
                <>
                  <a href="/" style={{ textDecoration: "none", color: "white" }}>
                    <a className={["Header", "Roboto"].join(" ")}
                    >Taiyaki</a>
                    <span> - Watch and sync</span>
                  </a>

                  <div>
                    <a
                      className={["App-link", "smoothLink"].join(" ")}
                      style={{ marginRight: 50 }}
                      onClick={() => _scroll(_featureRef)}
                    >Features
   </a>
                    <a
                      className={["App-link", "smoothLink"].join(" ")}
                      onClick={() => _scroll(_ref)}
                    >About
   </a>
                  </div>
                </>
              }</Toolbar>
            </AppBar>
          </header>

          <Row align="center" className="Row-column" justify="center">
            <LogoView />
            <Image />
          </Row>

          <div ref={_featureRef}>
            <Features />
          </div>
          <Row align="center" justify="around" className="Row-second" >
            <div ref={_ref}><Grid key={"1"} data={_data1} title="About" /></div>
          </Row>




          <p style={{ fontStyle: "italic", color: "#FFFFFF", fontSize: 13 }}>This website is currently under maintenance and will be udpated soon.</p>
          <ParticlesBg type="custom" config={config} bg={true} />
        </div>
      </provider.Provider>
    </React.Fragment>
  )
}

export default App;

const _data1 = [
  "Taiyaki does not condone piracy, and is only intended to make it easier for the user to view content without the overbearing amount of advertisement these websites create for the user. Thus creating a safer and cleaner situation and reducing and even eliminating the risk of a/ny malicious virus(es)"
]