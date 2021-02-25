import React, { FC } from 'react';
import {View} from 'react-native';
import {BarChart, XAxis} from 'react-native-svg-charts';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { AnilistStatsScoreDistributionModel } from '../../Models/Anilist';
import { useThemeComponentState } from './storeConnect';
import { ThemedText } from './base';
import {Text,} from 'react-native-svg';
import * as scale from 'd3-scale'


type BarChartDataConfigModel = {
    labels: string[];
    datasets: {data: number[]}[]
}

interface RatingDecBarChartProps {
    data: AnilistStatsScoreDistributionModel[]
}
export const RatingDecBarChart: FC<RatingDecBarChartProps> = (props) => {
    const anilistScoreColors = [
        '#d2492d',
        '#d3642c',
        '#d2802a',
        '#cf9c2c',
        '#d1b82a',
        '#d2d12c',
        '#b7d22f',
        '#9cd12d',
        '#81d02c',
        '#66d12f',
    ]
    const {data} = props;
    const {theme} = useThemeComponentState();
    if (!data || data.length === 0) return null;
    const mappedLabels: string[] = data.flatMap((i) => (i.score.toString()));
    const mappedData: {value: number, svg: {fill: string}}[] = data.map((i, index) => ({value: i.amount, svg: {fill: anilistScoreColors[index]}}));
    
    // return <BarChart 

    //     chartConfig={{

    //         color: () => theme.colors.accent,
    //         backgroundColor: theme.colors.backgroundColor,
    //         backgroundGradientFrom: theme.colors.backgroundColor,
    //         backgroundGradientTo: theme.colors.backgroundColor,
    //         labelColor: () => theme.colors.text,
            
    //         style: {width: '100%'},
    //         barPercentage: 0.6,
    //         linejoinType: 'round',
            
            
            
    //     }}
    //     style={{alignSelf: 'center', paddingRight: -heightPercentageToDP(0.0000001) }}
    //     data={dataSet}
    //     width={widthPercentageToDP(100)}
    //     height={heightPercentageToDP(25)}
    //     yAxisLabel={''}
    //     yAxisSuffix={''}
    //     withHorizontalLabels={false}
    //     withInnerLines={false}
    //     showValuesOnTopOfBars
        


    // />
    const Labels = ({x, y, bandwidth, data} : {x: any, y:number, bandwidth: any, data: {value: number, svg: {fill: string}}[]}) => {
        
        return data.map((i, index) => {
            return <Text
            key={index.toString()}
            x={x(index)}
             y={y(i.value)}
            fontSize={heightPercentageToDP(1.1)}
            fill={theme.colors.text}
            translateY={-heightPercentageToDP(0.95)}
            >{i.value.toLocaleString(undefined)}</Text>
        });
    }

    return mappedData.length > 4 ? <View style={{height: heightPercentageToDP(26), marginBottom: heightPercentageToDP(2)}}>
    <ThemedText style={{
        fontSize: heightPercentageToDP(2.5),
        fontWeight: 'bold',
        paddingLeft: heightPercentageToDP(2)
    }}>Score Distribution</ThemedText>
    <BarChart
    style={{flex: 1}}
    
    data={mappedData}
    svg={{fill: theme.colors.accent, }}
    spacingInner={0.4}
    numberOfTicks={5}
    spacingOuter={0.4}
    animate
    animationDuration={1500}
    contentInset={{top: heightPercentageToDP(2)}}
    yAccessor={({item}) => item.value}
    >
        <Labels /> 
    </BarChart>
        <XAxis
                    style={{ marginTop: 10 }}
                    data={ mappedLabels }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => {
                        return mappedLabels[index];
                    } }
                    svg={{fill: theme.colors.text, fontSize: heightPercentageToDP(1.2)}}
                />
    </View> : null
}