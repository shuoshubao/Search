import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form, Input, Select, DatePicker } from 'antd';
import { omit } from 'lodash';
import { mergeColumns, getInitialValues, getSearchValues, isEveryFalsy } from './config';
import './index.scss';

const { RangePicker } = DatePicker;

class Index extends Component {
    static displayName = 'DynaSearch';

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
            columns: [],
            initialValues: {}
        };
        this.formRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    async componentDidMount() {
        const columns = mergeColumns(this.props.columns);
        // 初始值
        const initialValues = getInitialValues(columns);
        this.setState({ columns, initialValues });
    }

    getCustomEvents() {
        return {};
    }

    getDomEvents() {
        return {
            // 查询
            onSearch: () => {
                const { state } = this;
                const { columns } = state;
                const params = this.formRef.current.getFieldsValue();
                console.log(params);
                console.log(getSearchValues(params, columns));
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
                const { state } = this;
                const { columns } = state;
                return columns.map((v, i) => {
                    const { label, prop, template } = v;
                    const { tpl, width, ...restProps } = template;
                    let formItemNode = null;
                    let formItemName = prop;
                    // Input
                    if (tpl === 'input') {
                        const formItemNodeProps = restProps;
                        formItemNode = <Input {...formItemNodeProps} style={{ width }} />;
                    }
                    // Select
                    if (tpl === 'select') {
                        const formItemNodeProps = restProps;
                        const { data = [] } = template;
                        formItemNode = (
                            <Select {...formItemNodeProps} style={{ width }}>
                                {data.map((v2, i2) => {
                                    const { value, label } = v2;
                                    const key = [i2, label, value].join('_');
                                    return (
                                        <Select.Option value={value} key={key}>
                                            {label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        );
                    }
                    // DatePicker
                    if (tpl === 'date-picker') {
                        const formItemNodeProps = restProps;
                        console.log(111, restProps);
                        formItemNode = <DatePicker {...formItemNodeProps} style={{ width }} />;
                    }
                    // RangePicker
                    if (tpl === 'range-picker') {
                        const formItemNodeProps = omit(restProps, ['startTimeKey', 'endTimeKey']);
                        console.log(222, restProps);
                        formItemNode = <RangePicker {...formItemNodeProps} style={{ width }} />;
                    }
                    const key = [i, label, prop || formItemName].join('_');
                    return (
                        <Form.Item label={label} name={formItemName} key={key}>
                            {formItemNode}
                        </Form.Item>
                    );
                });
            },
            renderSearchReset: () => {
                const { state, domEvents, renderResult } = this;
                const { onSearch, onReset } = domEvents;
                const { showSearchBtn, showResetBtn } = this.props;
                if (isEveryFalsy(showSearchBtn, showResetBtn)) {
                    return null;
                }
                const btns = [];
                if (showSearchBtn) {
                    btns.push(
                        <Button type="primary" htmlType="submit" key="submit">
                            查询
                        </Button>
                    );
                }
                if (showResetBtn) {
                    btns.push(
                        <Button style={{ marginLeft: 5 }} onClick={onReset} key="reset">
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
        const { columns, initialValues } = state;
        const { onSearch, onReset } = domEvents;
        if (!columns.length) {
            return null;
        }
        return (
            <Card size="small" className="dyna-search-container" bordered={false}>
                <Form layout="inline" ref={this.formRef} onFinish={onSearch} initialValues={initialValues}>
                    {renderResult.renderColumns()}
                    {renderResult.renderSearchReset()}
                </Form>
            </Card>
        );
    }
}

export default Index;
