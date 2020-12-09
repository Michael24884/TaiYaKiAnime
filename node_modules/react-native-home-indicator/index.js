import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NativeModules, Platform } from 'react-native'

const { RNHomeIndicator } = NativeModules
const isIos = Platform.OS === 'ios'


const propTypes = {
    autoHidden: PropTypes.bool.isRequired,
}

export class HomeIndicator extends Component {
    static propsHistory = [];

    static popAndGetPreviousProps() {
        HomeIndicator.propsHistory.pop()
        return HomeIndicator.propsHistory[HomeIndicator.propsHistory.length - 1] || {}
    }

    componentDidMount() {
        if (!isIos) return

        const { autoHidden } = this.props
        HomeIndicator.propsHistory.push(this.props)

        updateNativeHomeIndicator({ autoHidden })
    }

    componentWillUnmount() {
        if (!isIos) return

        const { autoHidden } = HomeIndicator.popAndGetPreviousProps()
        updateNativeHomeIndicator({ autoHidden })
    }

    render() { return null }
}

HomeIndicator.propTypes = propTypes

function updateNativeHomeIndicator({ autoHidden = false }) {
    if (autoHidden) {
        RNHomeIndicator.autoHidden()
    } else {
        RNHomeIndicator.alwaysVisible()
    }
}


// keep this for backwards compatibility
const PrefersHomeIndicatorAutoHidden = () => <HomeIndicator autoHidden />
export default PrefersHomeIndicatorAutoHidden
