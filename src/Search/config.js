import { merge, cloneDeep, flatten } from 'lodash';
import { formatTime } from '@nbfe/tools';

// 全真
export const isEveryTruthy = (...args) => {
    return flatten(args).every(Boolean);
};

// 全假
export const isEveryFalsy = (...args) => {
    return flatten(args).every(v => !Boolean(v));
};

// 部分真
export const isSomeTruthy = (...args) => {
    return flatten(args).some(Boolean);
};

// 部分假
export const isSomeFalsy = (...args) => {
    return flatten(args).some(v => !Boolean(v));
};

// 默认 column
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
        tpl: 'input',
        width: 200
    }
};

const pickerFormatMap = {
    date: 'YYYY-MM-DD',
    year: 'YYYY',
    month: 'YYYY-MM',
    week: 'YYYY-wo',
    quarter: 'quarter' // todo: Q1,Q2,Q3,Q4
};

// 处理 props.columns
export const mergeColumns = columns => {
    return cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { label, template } = column;
            const { tpl } = template;
            if (tpl === 'input') {
                column.placeholder = label ? ['请输入', label].join('') : '';
            }
            if (tpl === 'date-picker') {
                // picker: date | week | month | quarter | year
                const picker = template.picker || 'date';
                const format = template.format || pickerFormatMap[picker];
                template.picker = picker;
                template.format = format;
            }
            if (tpl === 'range-picker') {
                const { startTimeKey, endTimeKey } = template;
                if (isSomeFalsy(startTimeKey, endTimeKey)) {
                    throw new Error('range-picker 必须传参数: startTimeKey, endTimeKey');
                }
                const format = template.format || 'YYYY-MM-DD HH:mm:ss';
                template.format = format;
            }
            // startTime
            return column;
        })
        .filter(v => Boolean(v.visible));
};

// 表单初始值
export const getInitialValues = columns => {
    return cloneDeep(columns).reduce((prev, cur) => {
        const { prop, defaultValue } = cur;
        prev[prop] = defaultValue;
        return prev;
    }, {});
};

// 处理提交的值
export const getSearchValues = (params, columns) => {
    const result = {};
    columns.forEach(v => {
        const { prop, template } = v;
        const { tpl } = template;
        const value = params[prop];
        if (tpl === 'date-picker') {
            const { format } = template;
            if (value) {
                result[prop] = formatTime(value, format);
                return;
            }
        }
        if (tpl === 'range-picker') {
            const { format, startTimeKey, endTimeKey } = template;
            if (value) {
                result[startTimeKey] = formatTime(value[0], format);
                result[endTimeKey] = formatTime(value[1], format);
                return;
            }
        }
        result[prop] = value;
    });
    return result;
};
