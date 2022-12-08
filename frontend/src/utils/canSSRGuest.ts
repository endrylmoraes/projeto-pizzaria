import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// Função para paginas que so podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        // Se tentar acessar a pagina com login salvo, redireciona
        if(cookies["@nextauth.token"]){
            return{
                redirect:{
                    destination: "/dashboard",
                    permanent: false
                }
            }
        }

        return await fn(ctx);
    }
}