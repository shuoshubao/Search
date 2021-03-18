import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form, Input, Select, DatePicker } from 'antd';
import { isFunction, omit, merge } from 'lodash';
import { isEmptyArray, setAsyncState } from '@nbfe/tools';
import { defaulCardProps, defaulFormProps } from './config';
import {
    isEveryFalsy,
    mergeColumns,
    getInitialValues,
    getSearchValues,
    getFormItemLabelWidth,
    renderFormItemLabel,
    getFormItemNodeStyle
} from './util';
import './index.scss';

const { RangePicker } = DatePicker;

class Index extends Component {
    static displayName = 'DynaSearch';

    static defaultProps = {
        autoSubmit: true,
        showSearchBtn: true,
        showResetBtn: true,
        cardProps: {},
        formProps: {},
        labelWidth: 0
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        // 自动触发搜索
        autoSubmit: PropTypes.bool,
        // 展示搜索按钮
        showSearchBtn: PropTypes.bool,
        // 展示重置按钮
        showResetBtn: PropTypes.bool,
        // 事件: 提交 (submitData, formData) => {}
        onSubmit: PropTypes.func,
        // Card 的属性 https://ant.design/components/card-cn/#API
        cardProps: PropTypes.object,
        // Form 的属性 https://ant.design/components/form-cn/#API
        formProps: PropTypes.object,
        // Form.Item label 的宽度
        labelWidth: PropTypes.number
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
        const { columns, autoSubmit } = this.props;
        const innerColumns = mergeColumns(columns);
        // 初始值
        const initialValues = getInitialValues(innerColumns);
        await setAsyncState(this, { columns: innerColumns, initialValues });
        if (isEmptyArray(innerColumns)) {
            return;
        }
        if (autoSubmit) {
            this.domEvents.onSearch();
        }
    }

    getCustomEvents() {
        return {};
    }

    getDomEvents() {
        return {
            // 查询
            onSearch: () => {
                const { state, props } = this;
                const { columns } = state;
                const params = this.formRef.current.getFieldsValue();
                console.log(getSearchValues(params, columns));
                if (isFunction(props.onSubmit)) {
                    props.onSubmit(getSearchValues(params, columns), params);
                }
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
                const { props, state } = this;
                const { columns } = state;
                const labelWidth = props.labelWidth || getFormItemLabelWidth(columns);
                return columns.map((v, i) => {
                    const { label, prop, placeholder, template } = v;
                    const { tpl } = template;
                    let formItemNodeProps = { placeholder, ...omit(template, ['tpl', 'width']) };
                    let formItemNode = null;
                    let formItemName = prop;
                    // Input
                    if (tpl === 'input') {
                        formItemNode = <Input {...formItemNodeProps} style={getFormItemNodeStyle(v)} />;
                    }
                    // Select
                    if (tpl === 'select') {
                        const { data = [] } = template;
                        formItemNode = (
                            <Select {...formItemNodeProps} style={getFormItemNodeStyle(v)}>
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
                        formItemNode = <DatePicker {...formItemNodeProps} style={getFormItemNodeStyle(v)} />;
                    }
                    // RangePicker
                    if (tpl === 'range-picker') {
                        formItemNodeProps = omit(formItemNodeProps, ['startTimeKey', 'endTimeKey']);
                        formItemNode = <RangePicker {...formItemNodeProps} style={getFormItemNodeStyle(v)} />;
                    }

                    const labelNode = renderFormItemLabel(v, { labelWidth });

                    const key = [i, label, prop || formItemName].join('_');
                    return (
                        <Form.Item label={labelNode} name={formItemName} key={key}>
                            {formItemNode}
                        </Form.Item>
                    );
                });
            },
            renderSearchReset: () => {
                const { domEvents } = this;
                const { onReset } = domEvents;
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
        const { props, state, domEvents, renderResult } = this;
        const { columns, initialValues } = state;
        const { onSearch } = domEvents;
        if (isEmptyArray(columns)) {
            return null;
        }
        const cardProps = merge({}, props.cardProps, defaulCardProps);
        const formProps = merge({}, props.formProps, defaulFormProps);
        return (
            <Card className="dyna-search-container" {...cardProps}>
                <Form
                    {...omit(formProps, ['ref', 'onFinish', 'initialValues'])}
                    ref={this.formRef}
                    onFinish={onSearch}
                    initialValues={initialValues}
                >
                    {renderResult.renderColumns()}
                    {renderResult.renderSearchReset()}
                </Form>
            </Card>
        );
    }
}

export default Index;
