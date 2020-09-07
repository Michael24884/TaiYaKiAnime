import * as React from 'react';
import { Props } from './Pager';
import { Route } from './types';
declare type State = {
    initialOffset: {
        x: number;
        y: number;
    };
};
export default class ScrollPager<T extends Route> extends React.Component<Props<T> & {
    overscroll?: boolean;
}, State> {
    static defaultProps: {
        bounces: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props<T>): void;
    componentWillUnmount(): void;
    private initialOffset;
    private wasTouched;
    private interactionHandle;
    private scrollViewRef;
    private jumpTo;
    private scrollTo;
    private enterListeners;
    private addListener;
    private removeListener;
    private position;
    private onScroll;
    private layoutWidthNode;
    private relativePosition;
    render(): React.ReactNode;
}
export {};
