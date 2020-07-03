import React, {FC} from 'react';
import '../styles/grid.css';
import { Container } from 'react-grid-system';

interface Props {
    key: string;
    title: string;
    data?: string[];
}

const Grid:FC<Props> = (props) => {
    return (
        <Container id={props.key} className="smooth-link">
        <div className="Grid-view" key={props.key}>
        <h1>
            {props.title}
        </h1>
                <div className="Grid-desc">
                   {props.data?.map((i) => (
                       <p>{i}</p>
                   ))}
                </div>
            </div>
        </Container>
    );
}

export default Grid;