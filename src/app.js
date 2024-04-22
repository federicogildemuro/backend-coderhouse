import { program } from 'commander';
import initializePersistence from './dao/factory.js';
import express from 'express';
import cors from 'cors';
import { __dirname } from './utils.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import handlebars from 'express-handlebars';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import SessionsRouter from './routes/sessions.router.js';
import ViewsRouter from './routes/views.router.js';
import initializeSocket from './config/socket.config.js';

program.option('-p, --persistence <type>', 'Tipo de persistencia (mongo o fs)').parse();
if (!program.opts().persistence) {
    console.log('El parámetro --persistence es obligatorio y debe ser mongo o fs');
    process.exit(1);
}
initializePersistence(program.opts().persistence);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser(config.cookieSecret));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

initializePassport();
app.use(passport.initialize());

app.use('/api/products', ProductsRouter.getInstance().getRouter());
app.use('/api/carts', CartsRouter.getInstance().getRouter());
app.use('/api/sessions', SessionsRouter.getInstance().getRouter());
app.use('/', ViewsRouter.getInstance().getRouter());

const httpServer = app.listen(config.port, () => console.log(`Servidor escuchando en el puerto ${config.port}`));

initializeSocket(httpServer);