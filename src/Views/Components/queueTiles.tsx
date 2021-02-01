import React, { FC } from 'react';
import { Dimensions, LayoutAnimation, Platform, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useQueueStore, useTheme } from '../../Stores';
import { ThemedSurface, ThemedText } from './base';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');
interface Props {
    onPress: () => void;
}

const QueueTiles: FC<Props> = (props) => {
    const {onPress} = props;
    const {myQueue} = useQueueStore();
    const theme = useTheme((_) => _.theme);
    const queueObj = Object.entries(myQueue);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    
    if (queueObj.length === 0 ) return null;

    const remainingQueue = queueObj.slice(4).flatMap((i) => i[0]).length
    const totalQueueEpisodes = queueObj.flatMap((i) => i[1]).length

    const renderExtraView = () => {
        return (
            <View style={[styles.smallerImage, {backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center'}]}>
                <ThemedText style={{color: 'white', fontWeight: '600', fontSize: 25}}>+{remainingQueue}</ThemedText>
            </View>
        )
    }


    return (
           <TouchableOpacity onPress={onPress}>
                <View style={[styles.view, styles.shadow]}>
            <View style={[styles.textView, {backgroundColor: theme.colors.accent}]}>
                <ThemedText style={[styles.title, {color: 'white'}]}>Your Queue</ThemedText>
                <ThemedText style={[styles.subtitle, {color: 'white'}]}>{totalQueueEpisodes} total episodes</ThemedText>
            </View>

            <View style={styles.imageView}>
                <DangoImage url={queueObj[0][1][0].detail.coverImage} style={styles.primaryImage}/>
                <View style={styles.smallerImageView}>
                    {queueObj.slice(1, 5).map((i, index) => {
                        if (index === 3)
                            return renderExtraView();
                        return <DangoImage key={index.toString()} url={i[1][0].detail.coverImage} style={styles.smallerImage} />
                    })}
                </View>
            </View>
        </View>
           </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shadow: {
        ...Platform.select({
            android: {
                elevation: 4,
                backgroundColor: 'white'
            },
            ios: {
                shadowColor: 'black',
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4
            }
        })
    },
    view: {
        marginBottom: 12,
        height: height * 0.32,
        width: width * 0.88,
        alignSelf: 'center',
    },

    textView: {
        height: '25%',
        padding: width * 0.03,
        justifyContent: 'center'
    },
    title: {
        fontSize: 19,
        fontWeight: '600',
    },
    subtitle: {

    },
    imageView: {
        flex: 1,
        height: '80%',
        flexDirection: 'row',
    },
    primaryImage: {
        height: '100%',
        width: '50%',
    },
    smallerImageView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    smallerImage: {
        height: '50%',
        width: width * 0.22,
    }
});

export default QueueTiles;
