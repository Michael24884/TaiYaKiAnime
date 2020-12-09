import * as React from 'react';

export interface Props {
    time: string | number | Array<any> | Date;
    interval?: number;
    hideAgo?: boolean;
}

declare module 'react-native-timeago' {
    export default class TimeAgo extends React.Component<Props> {}
}
