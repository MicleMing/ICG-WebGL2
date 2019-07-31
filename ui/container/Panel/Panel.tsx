import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slider from '../../components/Slider';
import transport, { IEvents, SETTINGS } from '../../transport';

interface PanelProps {

}

interface PanelState {
  setting: any;
  values: {
    x: number;
    y: number;
    sx: number;
    sy: number;
    angle: number;
  }
}

const settingMaps = {
  [SETTINGS.matrix2d]: {
    slider1: true,
    slider2: true,
  }
}

class Panel extends Component<PanelProps, PanelState> {

  constructor(props: PanelProps) {
    super(props);
    this.state = {
      setting: {},
      values: {
        x: 0,
        y: 0,
        sx: 1,
        sy: 1,
        angle: 0,
      }
    };
    transport.setPort(window.parent);
  }

  componentDidMount() {
    transport.onMessage(IEvents.setting, (data) => {
      // console.log('===', data)
      const setting = settingMaps[data];
      this.setState({ setting });
    })
  }

  onChangeX(event: Object, value: any) {
    const values = this.state.values;
    values.x = value;
    this.setState({
      values
    });
    transport.send({
      type: IEvents.progress,
      data: values,
    })
  }

  onChangeY(event: Object, value: any) {
    const values = this.state.values;
    values.y = value;
    this.setState({
      values
    });
    transport.send({
      type: IEvents.progress,
      data: values,
    })
  }

  onChangeSX(event: Object, value: any) {
    const values = this.state.values;
    values.sx = value;
    this.setState({
      values
    });
    transport.send({
      type: IEvents.progress,
      data: values,
    })
  }

  onChangeSY(event: Object, value: any) {
    const values = this.state.values;
    values.sy = value;
    this.setState({
      values
    });
    transport.send({
      type: IEvents.progress,
      data: values,
    })
  }

  onChangeAngle(event: Object, value: any) {
    const values = this.state.values;
    values.angle = value;
    this.setState({
      values
    });
    transport.send({
      type: IEvents.progress,
      data: values,
    })
  }

  render() {
    const { setting } = this.state;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Slider title="x" onChange={this.onChangeX.bind(this)} disabled={!setting.slider1} />
          <Slider title="y" onChange={this.onChangeY.bind(this)} disabled={!setting.slider1} />
          <Slider title="sx" onChange={this.onChangeSX.bind(this)} disabled={!setting.slider1} />
          <Slider title="sy" onChange={this.onChangeSY.bind(this)} disabled={!setting.slider1} />
          <Slider title="angle" onChange={this.onChangeAngle.bind(this)} disabled={!setting.slider1} />
        </Grid>
      </Grid>
    );
  }
}

export default Panel;
