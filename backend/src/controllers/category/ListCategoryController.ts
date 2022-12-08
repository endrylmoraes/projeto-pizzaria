import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController{
    async handle(req: Request, res: Response){
        const createCategoryService = new ListCategoryService();

        const categories = await createCategoryService.execute();

        return res.json(categories);
    }
}

export { ListCategoryController }