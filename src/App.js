import Search from './Search';

const columns = [
    {
        label: '隐藏',
        prop: 'visibility',
        visible: false
    },
    {
        label: 'test',
        prop: 'a'
    },
    {
        label: '姓名',
        prop: 'b',
        defaultValue: 'bb'
    },
    {
        label: '性别',
        prop: 'c',
        template: {
            tpl: 'select',
            data: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ]
        }
    },
    {
        label: '创建时间-日',
        prop: 'd',
        template: {
            tpl: 'date-picker'
        }
    },
    {
        label: '创建时间-日-时分',
        prop: 'd1',
        template: {
            tpl: 'date-picker',
            format: 'YYYY-MM-DD HH:mm',
            showTime: true
        }
    },
    {
        label: '创建时间-月',
        prop: 'd2',
        template: {
            tpl: 'date-picker',
            picker: 'month'
        }
    },
    {
        label: '时间区间',
        prop: 'e',
        template: {
            tpl: 'range-picker',
            format: 'YYYY-MM-DD HH:mm',
            startTimeKey: 'sTime',
            endTimeKey: 'eTime'
        }
    }
];

const App = () => {
    return (
        <div className="App" style={{ padding: 10, background: '#edf0f3' }}>
            <Search columns={columns} />
        </div>
    );
};

export default App;
