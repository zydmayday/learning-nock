import nock from 'nock';
import axios from 'axios';

const scope = nock('http://localhost:8080');
scope.get('/api/user/1').reply(200, {'name': 'zyd'});

describe('test nock', () => {
    it('test nock get', async () => {
        let res = await axios.get('http://localhost:8080/api/user/1');
        expect(res.data).toEqual({'name': 'zyd'});
        
        res = await axios.get('http://localhost:8080/api/user/1');
        expect(res.data).toEqual({'name': 'zyd'});
    })
})