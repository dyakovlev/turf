const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const pointToLineDistance = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-point-to-line-distance', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [point, line] = geojson.features;
        let {units} = geojson.properties || {};
        if (!units) units = 'kilometers';
        const distance = pointToLineDistance(point, line, units);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        const expected = load.sync(directories.out + 'distances.json');
        t.deepEqual(distance, expected[name], name);
    }
    t.end();
});
