import AuthService from './auth.service';
import ChainsService from './chains.service';
import { chartService } from './chart.service';
import { OfferService } from './offer.service';
import { OrderService } from './order.service';
import { UserService } from './user.service';

export const Service = Object.freeze({
  order: new OrderService(),
  chain: new ChainsService(),
  offer: new OfferService(),
  user: new UserService(),
  auth: new AuthService(),
  chart: chartService,
});
