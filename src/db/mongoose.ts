import {connect} from 'mongoose';
// import {config} from 'dotenv';
// config();

// no se por que pero no me deja conectar a la base de datos en la nube
// la uri de la base de datos en la nube esta en el archivo .env en la raiz del proyecto
// solo hay que cambiar la url local en el connect por la de abajo
// process.env.MONGODB_URI!

connect('mongodb://127.0.0.1:27017/white-wolf-inn').then(() => {
  console.log('Connected to the White Wolf Inn database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});