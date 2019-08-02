import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  margin: {
    height: theme.spacing(3),
  },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    const current = (popperRef.current as any)
    if (current) {
      current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};


interface SliderProps {
  title: string;
  disabled?: boolean;
  show: boolean;
  max?: number;
  min?: number;
  step?: number;
  onChange: (event: Object, value: any) => void;
}

export default function CustomizedSlider(props: SliderProps) {
  const { title, onChange, disabled, show } = props;
  const classes = useStyles();
  if (!show) {
    return null;
  }
  return (
    <Grid className={classes.root}>
      <Typography gutterBottom>{title}</Typography>
      <Slider
        ValueLabelComponent={ValueLabelComponent}
        max={props.max}
        min={props.min}
        step={props.step}
        aria-label="custom thumb label"
        defaultValue={0}
        onChange={onChange}
        disabled={disabled}
      />
    </Grid>
  );
}
