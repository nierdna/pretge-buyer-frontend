import AuthService from './auth.service';
import ChainsService from './chains.service';
import { OfferService } from './offer.service';
import { OrderService } from './order.service';
import { SellerService } from './seller.service';

export const Service = Object.freeze({
  order: new OrderService(),
  chain: new ChainsService(),
  offer: new OfferService(),
  seller: new SellerService(),
  auth: new AuthService(),
});
