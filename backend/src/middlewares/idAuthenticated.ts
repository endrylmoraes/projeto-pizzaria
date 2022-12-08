import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload{
    sub: string;
}

export function isAuthenticated(
    req: Request, 
    res: Response,
    next: NextFunction
){

    //receber token
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end();
    }

    // bearer token --- ignorar o bearer e pegar só o q tem após o espaço
    const [, token] =  authToken.split(" ");
    
    // verificar token
    try{

        const { sub } = verify(
            token, 
            process.env.JWT_SECRET
        ) as Payload;

        //recuperar o id do token e colocar dentro da req
        req.user_id = sub;
        
        return next();

    }catch(err){
        return res.status(401).end();
    }


    return next();
}