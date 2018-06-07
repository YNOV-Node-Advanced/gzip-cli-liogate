const { walk } = require('../index');

test('Test walk function', async () => {
    const files = await walk('./src');
    expect(files.length).toBe(2);
})
