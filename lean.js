const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose
const { PerformanceObserver, performance } = require('perf_hooks');
const _ = require('lodash');

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].name, items.getEntries()[0].duration);
    performance.clearMarks();
});

obs.observe({ type: 'measure' });

const RECORDS = 1_000;

const FIELDS = 10;

const cases = [
    { name: 'string', value: (i) => 'val' + i, type: String },
    { name: 'boolean', value: (i) => true, type: Boolean },
    { name: 'array', value: (i) => ['val' + i, '2val' + i, '3val' + i], type: [String] },
    {
        name: 'object', value: (i) => ({ field1: 'val' + i, field2: 'val' + i }), type: new Schema({
            field1: String,
            field2: String,
        })
    },
    {
        name: 'array-of-objects', value: (i) => [{ field: 'val' + i }, { field: '2val' + i }, { field: '3val' + i }], type: [{
            type: new Schema({
                field: String
            })
        }]
    },
]

async function run() {
    await connect();
    for (const useCase of cases) {
        const schema = {};
        _.times(FIELDS, (i) => {
            schema['field' + i] = useCase.type
        })

        const usersSchema = new Schema(schema);
        const User = mongoose.model(useCase.name + 'User', usersSchema);

        await User.deleteMany({})

        const documents = _.times(RECORDS, () => {
            const toInsert = {};
            _.times(FIELDS, (i) => {
                toInsert['field' + i] = useCase.value(i)
            })
            return toInsert
        })

        await User.insertMany(documents)

        await User.find({})
        performance.mark(useCase.name + 'non-lean');
        await User.find({})
        performance.measure(useCase.name + ' - Non lean perf', useCase.name + 'non-lean');

        await User.find({}).lean()

        performance.mark(useCase.name + 'lean');
        await User.find({}).lean()
        performance.measure(useCase.name + ' - Lean perf', useCase.name + 'lean');
    }

    mongoose.disconnect()
}

run().catch(console.error);