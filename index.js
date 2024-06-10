const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;


// homepage route
app.get('/', async (req, res) => {
    const spaceships = 'https://api.hubspot.com/crm/v3/objects/spaceships';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }   
    const params = {
        properties:"name,length,width,has_light_speed_drive"
    }
    try {
        const resp = await axios.get(spaceships, { headers, params });
        const data = resp.data.results;
        console.log(data);
        res.render('spaceships', { title: 'Spaceships', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', async (req, res) => {
    const spaceships = 'https://api.hubspot.com/crm/v3/objects/spaceships';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }   
    const params = {
        properties:"name,length,width,has_light_speed_drive"
    }
    try {
        const resp = await axios.get(spaceships, { headers, params });
        const data = resp.data.results;
        console.log(data);
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }

})

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "name" : req.body.name,
            "length": req.body.length,
            "width": req.body.width,
            "has_light_speed_drive": req.body.has_light_speed_drive
        }
    }

    const name = req.query.name;
    const updateSpaceships = `https://api.hubapi.com/crm/v3/objects/spaceships/${name}?idProperty=name`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateSpaceships, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));