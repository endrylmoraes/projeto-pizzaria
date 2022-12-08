import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrdersService";

class ListOrdersController{
    async handle(req: Request, res: Response){

        const ordersList = await new ListOrdersService().execute();

        return res.json(ordersList);
    }
}

export { ListOrdersController }