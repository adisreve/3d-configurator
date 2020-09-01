const express = require('express')
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express()

app.use(bodyParser({limit: '500mb'}));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./images")
  },
  filename: (req, file, callback) => {
    callback(null, req.params.name + '_' + file.originalname)
  }
});

const dom = new JSDOM('<html>');
window = dom.window;
console.log(dom.window.document.getElementsByTagName('input'));
var something = dom.window.document.getElementsByTagName('p');

const upload = multer({
  storage: Storage
}).single('image')

const upperBound = '1gb';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/test/', (req, res) => {
  const farbe = req.body.farbe;
  const data = req.body.data;
  const creds = req.body.creds;

  const transporter = nodemailer.createTransport({
    host: 'smtp host', 
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
   //  Uncomment the line below if you want to use GMail address instead
   //  service: 'Gmail',
    auth: {
      user: 'email@email.com',
      pass: 'password'
    }
  });

  const options = {
    from: 'info@sonneo.ch',
    to: creds.email,
    cc: 'info@sonneo.ch',
    subject: 'Pergola 3D Email',
    text: `
      Kontakt:
      Name: ${creds.name}
      Email: ${creds.email}
      Stadt: ${creds.city}
      Telefon: ${creds.phone}    

      Farbe:
      Basisfarbe: ${creds.basisfarbe}
      Lamellen: ${creds.lamellen}
      Markisen: ${creds.markisen}

      Grösse:
      Breite: ${creds.breite} cm
      Höhe: ${creds.hohe} cm
      Tiefe: ${creds.tiefe} cm

      Mauerwerk:
      Vorn: ${creds.vorn} cm
      Hinten: ${creds.hinten} cm
      Links: ${creds.links} cm
      Rechts: ${creds.rechts} cm
      Wand: ${creds.wand}
      RAL: ${creds.ral}

      ${creds.drop1} ${creds.dots1} ${creds.element1}
      ${creds.drop2} ${creds.dots2} ${creds.element2}
      ${creds.drop3} ${creds.dots3} ${creds.element3}
      ${creds.drop4} ${creds.dots4} ${creds.element4}
      `,
    attachments: [
      {
        path: data,
      }
    ]
  };

  transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});

  transporter.sendMail(options, (error, info) => {
    if(error) {
      console.log(error);
      res.send('Error', 400);
    } else {
      console.log('Success! Read more: ', info);
      transporter.close();        
      res.send('Success!', 200);      
    }
  });
});

app.post('/r/brustor/brustor/de/designer/image/:name', (req, res) => {
  upload(req, res, err => {
    if(err) {
      console.log(err)
      return res.end("Something went wrong")
    }

    return res.json({
      url: `/images/${req.params.name}_${req.file.originalname}`
    })
  })
})

app.get('/images/:name', (req, res) => res.sendFile(__dirname + `/images/${req.params.name}`))

app.use(express.static('public'))

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
