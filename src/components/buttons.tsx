import React, {FC} from 'react';
import { PlatformTypes, platformToText, platformToIcon } from '../models/platform_enums';
import '../styles/buttons.css';


interface Props {
    platform: PlatformTypes;
    onClick: () => void;
    
}

const PlatformButtons: FC<Props> = (props) => {

    return (
    
        <div className={["Button-outline", props.platform].join(" ")} 
        key={props.platform}
        onClick={props.onClick}
        >
            <a>{props.platform === "github" ? "View on" : "Download for"} {platformToText.get(props.platform)}</a>
            <img src={platformToIcon.get(props.platform)} className={["logo", "logo-size"].join(" ")}/>
            </div> 
    
            
    );
}

export default PlatformButtons;