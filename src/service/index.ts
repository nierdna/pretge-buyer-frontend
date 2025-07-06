import ChainsService from './chains.service';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { SellerService } from './seller.service';

export const Service = Object.freeze({
  order: new OrderService(),
  chain: new ChainsService(),
  product: new ProductService(),
  seller: new SellerService(),
});
