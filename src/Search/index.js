import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, Select, Button } from 'antd';
import { flatten, cloneDeep, get, omit, isEqual, isUndefined, debounce, merge } from 'lodash';
import { setAsyncState, classNames } from '@nbfe/tools';
import './index.css';

const isAllTruthy = (...args) => {
    return flatten(args).every(Boolean);
};
const isAllFalsy = (...args) => {
    return flatten(args).every(v => !Boolean(v));
};

const defaultColumn = {
    label: '',
    prop: '',
    visible: true,
    defaultValue: '',
    immediate: true,
    tips: '',
    placeholder: '',
    isSearch: false,
    inline: true,
    style: {},
    formItemStyle: {},
    template: {
        tpl: 'input'
    }
};

class Index extends Component {
    static displayName = 'Search';

    static defaultProps = {
        autoSubmit: true,
        showSearchBtn: true,
        showResetBtn: true
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        autoSubmit: PropTypes.bool,
        showSearchBtn: PropTypes.bool,
        showResetBtn: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            columns: []
        };
        this.formRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    async componentDidMount() {
        const columns = cloneDeep(this.props.columns).map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const {
                label,
                template: { tpl }
            } = column;
            if (tpl === 'input') {
                column.placeholder = label ? ['请输入', label].join('') : '';
            }
            return column;
        });
        await setAsyncState(this, { columns });
    }

    getCustomEvents() {
        return {};
    }

    getDomEvents() {
        return {
            // 查询
            onSearch: () => {
                const params = this.formRef.current.getFieldsValue();
                console.log(params);
            },
            // 重置
            onReset: () => {
                this.formRef.current.resetFields();
            }
        };
    }

    getRenderResult() {
        return {
            renderColumns: () => {
                return this.state.columns.map((v, i) => {
                    const { label, prop, visible, defaultValue, template } = v;
                    const { tpl, ...restProps } = template;
                    console.log(template, tpl);
                    let formItemNode = null;
                    if (tpl === 'input') {
                        formItemNode = <Input defaultValue={defaultValue} {...restProps} style={{ width: 120 }} />;
                    }
                    if (tpl === 'select') {
                        const { data = [] } = template;
                        formItemNode = (
                            <Select defaultValue={defaultValue} style={{ width: 120 }}>
                                {data.map((v2, i2) => {
                                    const {value, label} = v2;
                                    const key = [i2, label, value].join('_');
                                    return <Select.Option value={value} key={key}>{label}</Select.Option>;
                                })}
                            </Select>
                        );
                    }
                    const key = [i, label, prop].join('_');
                    return (
                        <Form.Item label={label} name={prop} key={key}>
                            {formItemNode}
                        </Form.Item>
                    );
                });
            },
            renderSearchReset: () => {
                const { state, domEvents, renderResult } = this;
                const { onSearch, onReset } = domEvents;
                const { showSearchBtn, showResetBtn } = this.props;
                if (isAllFalsy(showSearchBtn, showResetBtn)) {
                    return null;
                }
                const btns = [];
                if (showSearchBtn) {
                    btns.push(
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    );
                }
                if (showResetBtn) {
                    btns.push(
                        <Button style={{ marginLeft: 5 }} onClick={onReset}>
                            重置
                        </Button>
                    );
                }
                return <Form.Item>{btns}</Form.Item>;
            }
        };
    }

    render() {
        const { state, domEvents, renderResult } = this;
        const { columns } = state;
        const { onSearch, onReset } = domEvents;
        return (
            <Card size="small">
                <Form layout="inline" ref={this.formRef} onFinish={onSearch}>
                    {renderResult.renderColumns()}
                    {renderResult.renderSearchReset()}
                </Form>
            </Card>
        );
    }
}

export default Index;
