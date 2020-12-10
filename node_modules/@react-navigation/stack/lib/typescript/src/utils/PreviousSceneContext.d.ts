import * as React from 'react';
import type { Route } from '@react-navigation/native';
import type { Scene } from '../types';
declare const PreviousSceneContext: React.Context<Scene<Route<string, object | undefined>> | undefined>;
export default PreviousSceneContext;
