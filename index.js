// Load polyfills before anything else
import './global';

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
