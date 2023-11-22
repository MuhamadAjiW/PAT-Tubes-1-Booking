const App = Bun.serve({
    port: 3000,
    fetch(request){
        return new Response("Server has started!");
    },
})

console.log("Server started at port 3000")