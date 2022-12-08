import { Router } from "express";
import multer from "multer";

// USER
import { CreateUserController }     from "./controllers/user/CreateUserController";
import { AuthUserController }       from "./controllers/user/AuthUserController";
import { DetailUserController }     from "./controllers/user/DetailUserController";

// CATEGORY
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController }   from "./controllers/category/ListCategoryController";

// PRODUCT
import { CreateProductController }  from "./controllers/product/CreateProductController";
import { ListByCategoryController } from "./controllers/product/ListByCategoryController";

// ORDER
import { CreateOrderController }    from "./controllers/order/CreateOrderController";
import { RemoveOrderController }    from "./controllers/order/RemoveOrderController";
import { AddItemController }        from "./controllers/order/AddItemController";
import { RemoveItemController }     from "./controllers/order/RemoveItemController";
import { SendOrderController }      from "./controllers/order/SendOrderController";
import { ListOrdersController }     from "./controllers/order/ListOrdersController";
import { OrderDetailsController }   from "./controllers/order/OrderDetailsController";
import { FinishOrderController }    from "./controllers/order/FinishOrderController";

// MIDDLEWARE
import { isAuthenticated } from "./middlewares/idAuthenticated";

import uploadConfig from "./config/multer";



const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

// -- ROUTES USER --
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);

router.get("/me", isAuthenticated, new DetailUserController().handle);

// -- ROUTES CATEGORY --
router.post("/category", isAuthenticated, new CreateCategoryController().handle);
router.get("/category", isAuthenticated, new ListCategoryController().handle);

// -- ROUTES PRODUCT --
router.post("/product", isAuthenticated, upload.single("file"), new CreateProductController().handle);
router.get("/category/products", isAuthenticated, new ListByCategoryController().handle);

// -- ROUTES ORDER --
router.post("/order", isAuthenticated, new CreateOrderController().handle);
router.delete("/order", isAuthenticated, new RemoveOrderController().handle);
router.post("/order/add", isAuthenticated, new AddItemController().handle);
router.delete("/order/remove", isAuthenticated, new RemoveItemController().handle);
router.put("/order/send", isAuthenticated, new SendOrderController().handle);
router.get("/orders", isAuthenticated, new ListOrdersController().handle);
router.get("/order/details", isAuthenticated, new OrderDetailsController().handle);
router.put("/order/finish", isAuthenticated, new FinishOrderController().handle);


export default router;