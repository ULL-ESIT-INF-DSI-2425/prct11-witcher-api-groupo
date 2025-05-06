import {connect} from 'mongoose';
// import {config} from 'dotenv';
// config();

// no se por que pero no me deja conectar a la base de datos en la nube
// la uri de la base de datos en la nube esta en el archivo .env en la raiz del proyecto
// ES ALGO DE LA DNS DE LA ULL
// connect(process.env.MONGODB_URI!).then(() => {
//   console.log('Connected to the White Wolf Inn database in the cloud');
// }).catch((error) => {
//   console.log('Something went wrong when conecting to the database:', error);
// });


// este es que funciona para la base de datos local
// connect('mongodb://127.0.0.1:27017/white-wolf-inn').then(() => {
//   console.log('Connected to the White Wolf Inn database locally');
// }).catch((error) => {
//   console.log('Something went wrong when conecting to the database:', error);
// });

//esto es para poder separar la uri de la base de datos funcional y la de pruebas
try {
  await connect(process.env.MONGODB_URL!);
  console.log('Connected to the White Wolf Inn database in the cloud');
} catch (error) {
  console.log('Something went wrong when conecting to the database:', error);
}