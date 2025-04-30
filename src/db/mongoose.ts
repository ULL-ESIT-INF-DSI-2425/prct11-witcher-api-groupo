import {connect} from 'mongoose';

connect('mongodb://127.0.0.1:27017/white-wolf-inn').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});