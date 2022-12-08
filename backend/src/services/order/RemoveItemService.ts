import prismaClient from "../../prisma";

interface RemoveItemRequest{
    item_id: string;
}

class RemoveItemService{
    async execute({ item_id }: RemoveItemRequest){

        const item = await prismaClient.item.delete({
            where:{
                id: item_id
            }
        });

        return item;
    }
}

export { RemoveItemService }