import React from 'react';
import './MoneySelector.sass';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

/**
 * @flow
 */

type Props = {
  namePostfix: string,
  inputValue: number,
  onInputChange: Function,
  selectValue: string,
  selectOpts: {},
  onSelectChange: Function,
  valid: boolean,
};

const MoneySelector = (props: Props) => {
  const {
    namePostfix,
    inputValue,
    onInputChange,
    selectValue,
    selectOpts,
    onSelectChange,
    valid,
  } = props;
  return (
    <span className="MoneySelector">
      <input
        data-valid={valid}
        name={`amount-${namePostfix}`}
        type="number"
        value={inputValue}
        onChange={onInputChange}
      />
      <Select
        name={`currency-${namePostfix}`}
        value={selectValue}
        options={selectOpts}
        onChange={onSelectChange}
        searchable={false}
        clearable={false}
      />
    </span>
  );
}

export default MoneySelector;
