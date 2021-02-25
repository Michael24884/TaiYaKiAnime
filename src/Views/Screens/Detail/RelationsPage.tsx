import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import { AnilistRelations } from '../../../Models/Anilist';
import { MapAnilistRelationsToString } from '../../../Util';
import { BaseCards, ThemedSurface, ThemedText } from '../../Components';
import { ThemeModal } from '../../Components/Settings/themeComponent';
import { useThemeComponentState } from '../../Components/storeConnect';

interface Props {
    route: {params: {relations: AnilistRelations}}
}

const excludedFormats = ['ADAPTATION', 'ALTERNATIVE', 'OTHER'];

const RelationsPage: FC<Props> = (props) => {
    const {theme} = useThemeComponentState();
    const {relations} = props.route.params;

    const getLineColor = (type: string): string | undefined => {
        switch(type) {
            case 'SEQUEL': return 'green';
            case 'PREQUEL': return 'orange';
            case 'SIDE_STORY': return 'purple';
            case 'CHARACTER': return 'pink'
            default: return;
        }
    }

    const data = relations.edges.filter((i) => !excludedFormats.includes(i.relationType)).map((i) => ({data: i.node, time: MapAnilistRelationsToString.get(i.relationType) ?? '??', lineColor: getLineColor(i.relationType), circleColor: getLineColor(i.relationType)}));
  
    const renderDetail = (rowData: any) => {
        const {title, coverImage, id} = rowData.data;
        return (
            <View style={{marginBottom: heightPercentageToDP(10)}}>
                <BaseCards 
                image={coverImage.extraLarge}
                title={title.romaji}
                id={id}
            />
            </View>
        )
    }

    return (
        <ThemedSurface style={styles.view}>
            <Timeline
            //  renderTime={(rowData) => <ThemedText>{rowData.relation}</ThemedText>}
                showTime
                timeStyle={{color: theme.colors.text, fontSize: heightPercentageToDP(1.75), fontWeight: '600'}}
                data={data}
                renderDetail={renderDetail}
                columnFormat={'two-column'}
                innerCircle={'dot'}
                dotColor={'white'}
            />
        </ThemedSurface>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    }
});

export default RelationsPage;
