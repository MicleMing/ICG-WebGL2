import React from 'react';
import * as ReactDOM from 'react-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Panel from './container/Panel';

function InteractiveUI() {
  return (
    <Container maxWidth={false}>
      <Typography variant="h6" color="inherit">
        Control Panel
      </Typography>
      <Panel />
    </Container>
  );
}

ReactDOM.render(
  <InteractiveUI />,
  document.getElementById('interactive-ui'),
);
