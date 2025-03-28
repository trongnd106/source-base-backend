import { App } from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { ValidateEnv } from '@utils/validateEnv';
import { CategoryController } from './controllers/admin/category.controller';
import { TierController } from './controllers/admin/tiers.controller';
import { SellerController } from './controllers/admin/sellers.controller';
import { OrderController } from './controllers/admin/orders.controller';
import { ProductController } from './controllers/admin/products.controller';

ValidateEnv();

const app = new App([AuthController, CategoryController, TierController, SellerController, OrderController, ProductController]);
app.listen();
