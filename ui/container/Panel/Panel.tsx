import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '../../components/Slider';
import transport, { IEvents, SETTINGS } from '../../transport';

interface PanelProps {

}

interface Values {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number
  angle: number;
  anglex: number,
  angley: number,
  anglez: number,
}

interface PanelState {
  setting: any;
  values: Values;
}

const settingMaps = {
  [SETTINGS.matrix2d]: {
    x: true,
    y: true,
    sx: true,
    sy: true,
    angle: true
  },
  [SETTINGS.matrix3d]: {
    x: true,
    y: true,
    z: true,
    sx: true,
    sy: true,
    sz: true,
    anglex: true,
    angley: true,
    anglez: true,
  },
}

class Panel extends Component<PanelProps, PanelState> {

  constructor(props: PanelProps) {
    super(props);
    this.state = {
      setting: {},
      values: {
        x: 0,
        y: 0,
        z: 0,
        sx: 1,
        sy: 1,
        sz: 1,
        angle: 0,
        anglex: 0,
        angley: 0,
        anglez: 0
      }
    };
    transport.setPort(window.parent);
    this.createChange = this.createChange.bind(this);
  }

  componentDidMount() {
    transport.onMessage(IEvents.setting, (data) => {
      // console.log('===', data)
      const setting = settingMaps[data];
      this.setState({ setting });
    })
  }

  createChange(v: keyof Values) {
    return (e: Object, value: any) => {
      const values = this.state.values;
      values[v] = value;
      this.setState({
        values
      });
      transport.send({
        type: IEvents.progress,
        data: values,
      })
    }
  }
  render() {
    const { setting } = this.state;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Slider title="x" onChange={this.createChange('x')} show={setting.x} />
          <Slider title="y" onChange={this.createChange('y')} show={setting.y} />
          <Slider title="z" onChange={this.createChange('z')} show={setting.z} />
          <Slider title="sx" onChange={this.createChange('sx')} show={setting.sx} />
          <Slider title="sy" onChange={this.createChange('sy')} show={setting.sy} />
          <Slider title="sz" onChange={this.createChange('sz')} show={setting.sz} />
          <Slider title="angle" onChange={this.createChange('angle')} show={setting.angle} />
          <Slider title="anglex" onChange={this.createChange('anglex')} show={setting.anglex} />
          <Slider title="angley" onChange={this.createChange('angley')} show={setting.angley} />
          <Slider title="anglez" onChange={this.createChange('anglez')} show={setting.anglez} />
        </Grid>
      </Grid>
    );
  }
}

export default Panel;
