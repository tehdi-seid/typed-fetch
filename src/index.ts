


interface RequestOption {

    method?: "GET" | "POST" | "PUT" | "DELETE",
    params?: Record<string, number|string>,
    body?:unknown,
    headers?: Record<string,string>
}

type result<T> = {ok:false, error:string} | {ok:true, data:T}

async function request<T>(url:string, option:RequestOption = {}): Promise<result<T>> {

    const {method="GET", params, body, headers = {}} = option

    const u =new URL(url)
    if(params){

        for(const [name, value] of Object.entries(params)){
            u.searchParams.set(name, String(value))
        }
    }
    try{

        const res=await fetch(u, {
            method,
            headers: {"content-type": "application/json", ...headers},
            ...body !== undefined && method !=="GET" ? {body: JSON.stringify(body)} : {}

        })
        if(!res.ok) return {ok: false, error:`HTTP ERROR: ${res.status} ${res.statusText}`}
        const data = await res.json()
        return {ok:true, data:data}
    }
    catch(err){
        return {ok: false, error: err instanceof Error ? `${err.message}` : "Network error"
    }

}
}


const respose=await request("https://jsonplaceholder.typicode.com/posts",{
})

console.log(respose)