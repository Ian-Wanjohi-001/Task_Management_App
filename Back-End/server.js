
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser'
import config from './src/database/config.js'
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import projectsRoutes from './src/routes/projectsRoutes.js';


const app = express();
app.use(
    cors({
      origin: 'http://localhost:5174',
    })
  );

  //middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//jwt middleware
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
          if (err) req.user = undefined;
          req.user = decode;
          next();
      });
  } else {
      req.user = undefined;
      next();
  }
});

//Routes
authRoutes(app);
userRoutes(app);
projectsRoutes(app);


//testing my server
app.get('/', (req, res) => {
    res.send(
        'Hello 😎 TaskManagerAPI 😮 Chege;'
    )
});

app.listen(config.port, () => {
    console.log(`Server is 😊 spinning on ${config.url}`);
});