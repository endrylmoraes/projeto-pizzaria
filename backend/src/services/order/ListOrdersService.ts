import prismaClient from "../../prisma";

class ListOrdersService{
    async execute(){
        const ordersList = prismaClient.order.findMany({
            where:{
                draft: false,
                status: false
            },
            orderBy:{
                created_at: "desc"
            }
        });

        return ordersList;
    }
}

export { ListOrdersService }