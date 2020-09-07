import * as React from 'react';
import { StyleProp, ViewStyle, ViewProps } from 'react-native';
declare type Props = ViewProps & {
    onPress: () => void;
    onLongPress?: () => void;
    delayPressIn?: number;
    borderless?: boolean;
    pressColor: string;
    pressOpacity?: number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
export default class TouchableItem extends React.Component<Props> {
    static defaultProps: {
        pressColor: string;
    };
    render(): JSX.Element;
}
export {};
