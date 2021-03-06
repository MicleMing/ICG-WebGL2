import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '../../components/Slider';
import Select from '../../components/Select';
import transport, { IEvents, SETTINGS } from '../../transport';

import { selectItems } from './constant';

interface PanelProps {

}

interface Values {
  viewInRadians: number;
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
  select: string,
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
    viewInRadians: true,
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
  [SETTINGS.image2d]: {
    select: 'normal',
  }
}

class Panel extends Component<PanelProps, PanelState> {

  constructor(props: PanelProps) {
    super(props);
    this.state = {
      setting: {},
      values: {
        viewInRadians: 30,
        x: 200,
        y: 160,
        z: -500,
        sx: 1,
        sy: 1,
        sz: 1,
        angle: 0,
        anglex: 0,
        angley: 0,
        anglez: 0,
        select: '',
      }
    };
    transport.setPort(window.parent);
    this.createChange = this.createChange.bind(this);
  }

  componentDidMount() {
    transport.onMessage(IEvents.setting, (data) => {
      console.log('setting: ', data)
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
          <Select
            label="kenel"
            onSelect={this.createChange('select')}
            show={setting.select}
            items={selectItems}
          />
        </Grid>
        <Grid item xs={12}>
          <Slider title="viewInRadians" defaultValue={30} step={0.1} max={180} onChange={this.createChange('viewInRadians')} show={setting.viewInRadians} />
          <Slider title="x" defaultValue={200} max={400} onChange={this.createChange('x')} show={setting.x} />
          <Slider title="y" defaultValue={160} max={400} onChange={this.createChange('y')} show={setting.y} />
          <Slider title="z" defaultValue={-500} min={-1000} max={1} onChange={this.createChange('z')} show={setting.z} />
          <Slider title="scaleX" step={0.2} min={1} max={3} onChange={this.createChange('sx')} show={setting.sx} />
          <Slider title="scaleY" step={0.2} min={1} max={3} onChange={this.createChange('sy')} show={setting.sy} />
          <Slider title="scaleZ" step={0.2} min={1} max={3} onChange={this.createChange('sz')} show={setting.sz} />
          <Slider title="angle" max={360} onChange={this.createChange('angle')} show={setting.angle} />
          <Slider title="angleX" max={360} onChange={this.createChange('anglex')} show={setting.anglex} />
          <Slider title="angleY" max={360} onChange={this.createChange('angley')} show={setting.angley} />
          <Slider title="angleZ" max={360} onChange={this.createChange('anglez')} show={setting.anglez} />
        </Grid>
      </Grid>
    );
  }
}

export default Panel;
