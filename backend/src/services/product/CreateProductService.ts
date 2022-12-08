import prismaClient from "../../prisma";

interface ProductRequest{
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
}

class CreateProductService{
    async execute({ name, price, description, banner, category_id }: ProductRequest){
        
        if(name === '' || price ==='' || description ==='' || 
            banner ==='' || category_id ===''){
            throw new Error("Name invalid")
        }

        const product = await prismaClient.product.create({
            data:{
                name: name,
                price: price,
                description: description,
                banner: banner,
                category_id: category_id
            },
            select:{
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                category_id: true
            }
        })

        return product;
    }
}

export { CreateProductService }