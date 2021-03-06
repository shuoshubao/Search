import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from './antd';
import { isFunction, omit } from 'lodash';
import { setAsyncState } from '@nbfe/tools';
import { getDisplayName } from './util.jsx';

class Index extends Component {
    static displayName = getDisplayName('Input');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        onSearch: PropTypes.func,
        column: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            inputValue: ''
        };
    }

    componentDidMount() {
        const { props, state, onSelectChange, onInputChange } = this;
        const { column, value, style } = props;
        const { selectValue, inputValue } = state;
        const { name, defaultValue, inline, template } = column;
        const { inputType, options, selectWidth, inputWidth } = template;
        if (['select-search', 'select-input'].includes(inputType)) {
            if (defaultValue === '') {
                this.setState({
                    selectValue: options[0].value
                });
            }
            if (Array.isArray(defaultValue) && defaultValue.length === 2) {
                this.setState({
                    selectValue: defaultValue[0],
                    inputValue: defaultValue[1]
                });
            }
        }
        if (['input', 'textarea', 'password'].includes(inputType)) {
            this.setState({
                inputValue: defaultValue
            });
        }
    }

    onSelectChange = async value => {
        await setAsyncState(this, { selectValue: value });
        this.onChange();
    };

    onInputChange = async e => {
        await setAsyncState(this, { inputValue: e.target.value });
        this.onChange();
    };

    onSearch = () => {
        const { props, state } = this;
        const { onSearch } = props;
        if (!isFunction(onSearch)) {
            return;
        }
        onSearch();
    };

    onChange = () => {
        const { props, state } = this;
        const { onChange } = props;
        if (!isFunction(onChange)) {
            return;
        }
        const { column, value, style } = props;
        const { selectValue, inputValue } = state;
        const { name, inline, template } = column;
        const { inputType } = template;
        if (['select-search', 'select-input'].includes(inputType)) {
            onChange([selectValue, inputValue]);
            return;
        }
        onChange(inputValue);
    };

    render() {
        const { props, state, onSelectChange, onInputChange, onSearch } = this;
        const { column, defaultValue, value, style } = props;
        const { selectValue, inputValue } = state;
        const { name, inline, template } = column;
        const { inputType, options, selectWidth, inputWidth } = template;
        const inputProps = omit(props, [
            'column',
            'defaultValue',
            'value',
            'onChange',
            'onSearch',
            'style',
            'inputType',
            'inputWidth',
            'selectWidth'
        ]);
        inputProps.style = { width: inputWidth };
        if (inputType === 'search') {
            return (
                <Input.Search
                    {...inputProps}
                    defaultValue={defaultValue}
                    value={inputValue}
                    onChange={onInputChange}
                    onSearch={() => {
                        onSearch();
                    }}
                />
            );
        }
        if (['select-search', 'select-input'].includes(inputType)) {
            const { label } = options.find(v => v.value === selectValue) || {};
            return (
                <Input.Group compact>
                    <Select value={selectValue} onChange={onSelectChange} style={{ width: selectWidth }}>
                        {options.map(v => {
                            return (
                                <Select.Option value={v.value} key={v.value}>
                                    {v.label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                    {inputType === 'select-search' ? (
                        <Input.Search
                            {...inputProps}
                            value={inputValue}
                            onChange={onInputChange}
                            onSearch={() => {
                                onSearch();
                            }}
                            placeholder={['?????????', label].join('')}
                        />
                    ) : (
                        <Input
                            {...omit(inputProps, ['enterButton'])}
                            value={inputValue}
                            onChange={onInputChange}
                            placeholder={['?????????', label].join('')}
                        />
                    )}
                </Input.Group>
            );
        }
        if (inputType === 'textarea') {
            return (
                <Input.TextArea {...omit(inputProps, ['enterButton'])} value={inputValue} onChange={onInputChange} />
            );
        }

        if (inputType === 'password') {
            return (
                <Input.Password {...omit(inputProps, ['enterButton'])} value={inputValue} onChange={onInputChange} />
            );
        }
        return <Input {...omit(inputProps, ['enterButton'])} value={inputValue} onChange={onInputChange} />;
    }
}

export default Index;
