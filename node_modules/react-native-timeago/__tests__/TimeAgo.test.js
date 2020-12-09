import React from 'react'
import { Text } from 'react-native'
import TestRenderer from 'react-test-renderer'
import moment from 'moment'
import TimeAgo from '../TimeAgo'

describe('TimeAgo', () => {
  test('Renders', () => {
    const timestamp = moment().subtract(10, 'days')
    const renderer = TestRenderer.create(
      <TimeAgo time={timestamp} />
    )
    const instance = renderer.root
    expect(instance.findByType(Text).props.children).toEqual('10 days ago')
    renderer.unmount()
  })
})
