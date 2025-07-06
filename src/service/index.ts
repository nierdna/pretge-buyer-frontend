import AuthService from './auth.service';

const Service = Object.freeze({
  auth: new AuthService(),
});

export default Service;
