const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;


// homepage view route
app.get('/', async (req, res) => {
    const spaceships = 'https://api.hubspot.com/crm/v3/objects/spaceships';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }   
    const params = {
        properties:"name,length,width,has_light_speed_drive,hs_object_id"
    }
    try {
        const resp = await axios.get(spaceships, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Spaceships', data });
    } catch (error) {
        console.error(error);
    }
});

// 'add' view route
app.get('/add-cobj', async (req, res) => {
    let getUrl = 'https://api.hubspot.com/crm/v3/objects/spaceships';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }   
    const params = {
        properties:"name,length,width,has_light_speed_drive"
    }
    try {
        const resp = await axios.get(getUrl, { headers, params });
        const data = resp.data.results;
        res.render('add', { title: 'Spaceships', data });
    } catch (error) {
        console.error(error);
    }
})

//'add' route
app.post('/add-cobj', async (req, res) => {
    const spaceship = {
        properties: {
            "name" : req.body.name,
            "length": req.body.length,
            "width": req.body.width,
            "has_light_speed_drive": req.body.has_light_speed_drive=="on" ? "true" : "false"
        }
    }

    const createUrl = `https://api.hubapi.com/crm/v3/objects/spaceships`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createUrl, spaceship, { headers } );
        res.redirect('http://localhost:3000');
    } catch(err) {
        console.error(err);
    }

});

// get 'update' view route
app.get('/update-cobj/:name', async (req, res) => {
    const params = {
        properties:"name,length,width,has_light_speed_drive"
    }
    const getUrl = `https://api.hubspot.com/crm/v3/objects/spaceships/${req.params.name}?idProperty=name`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(getUrl, { headers,params });
        let data = resp.data.properties;
        
        res.render('update', { title: 'Update Spaceship | Integrating With HubSpot I Practicum',data });
    } catch (error) {
        // console.error(error);
    }
})

// 'update'  route
app.post('/update-cobj/:name', async (req, res) => {
    const update = {
        properties: {
            hs_object_id: req.body.hs_object_id,
            name: req.body.name,
            length: req.body.length,
            width: req.body.width,
            has_light_speed_drive: req.body.has_light_speed_drive=="on" ? "true" : "false"
        }
    }
    
    const updateUrl = `https://api.hubapi.com/crm/v3/objects/spaceships/${req.params.name}?idProperty=name`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateUrl, update, { headers } );
        res.redirect('http://localhost:3000');
    } catch(err) {
        console.error(err);
    }

});

// delete route

app.get('/delete-cobj/:id', async (req, res) => {
    
    const  delUrl= `https://api.hubapi.com/crm/v3/objects/spaceships/${req.params.id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.delete(delUrl,  { headers } );
        res.redirect('http://localhost:3000');
    } catch(err) {
        console.error(err);
    }

});




// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));