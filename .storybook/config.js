import { configure } from '@storybook/react';

configure(require.context('../src/test', true, /\.stories\.(js|jsx|ts|tsx)$/), module);