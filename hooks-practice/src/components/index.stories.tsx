import React from 'react';

import { Button } from '@storybook/react/demo';

export default { title: 'Button' };

export const Sample: React.FC = () => {
  return (
    <div>
      Sample
    </div>
  )
}

export const withEmoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);