import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      width: '100%'
    },
  }),
);

interface SelectProps {
  show: boolean;
  label: string;
  items: {
    value: string;
    name: string;
  }[];
  onSelect: (event: Object, value: any) => void;
}

export default function ControlledOpenSelect(props: SelectProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState<string>('');

  function createItems() {
    return props.items.map((item, index) => {
      const { value, name } = item;
      return <MenuItem key={`item-${index}`} value={value}>{name}</MenuItem>
    })
  }

  function handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const value = event.target.value as string;
    setValue(value)
    props.onSelect(event, value);
  }

  if (!props.show) {
    return null;
  }
  return (
    <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="controlled-open-select">{props.label}</InputLabel>
        <Select
          value={value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: 'controlled-open-select',
          }}
        >
          {createItems()}
        </Select>
      </FormControl>
    </form>
  );
}