import Search from './Search';

const columns = [
    {
        label: 'test',
        prop: 'test',
    },
    {
        label: '姓名',
        prop: 'a',
        defaultValue: 'aa'
    },
    {
        label: '性别',
        prop: 'b',
        template: {
            tpl: 'select',
            data: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ]
        }
    },
    {
        label: '创建时间',
        prop: 'c',
        template: {
            tpl: 'date-picker',

        }
    },
    {
        label: '时间区间',
        prop: 'd',
        template: {
            tpl: 'range-picker',

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
