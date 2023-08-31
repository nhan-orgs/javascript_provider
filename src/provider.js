const { io } = require("socket.io-client");
const socket = io("https://bridge.digitalauto.tech");
// const socket = io("https://bridge.digitalauto.asia");

const PROVIDER_ID = "JAVASCRIPT-CLIENT-SAMPLE"

socket.on("error", (err) => {
    console.log("error", err)
})

const simulate_run = async () => {
    for(let i=0;i<10;i++) {
        console.log("running ", i)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        socket.emit("sent_to_my_clients", {
            "provider_id": PROVIDER_ID,
            "cmd": "showSpeed",
            "data": i
        });
    }
}

socket.on("connect", () => {
    console.log(`Connected to server: ${socket.id}`);
    socket.emit("register_provider", {
        provider_id: PROVIDER_ID,
        name: "Javascript Provider Sample",
    });

    socket.on("new_request", (data) => {
        console.log("on new_request");
        if(!data || !data.cmd || !data.request_from) return
        try {
            switch(data.cmd) {
                case "Start":
                    console.log("got request to start")
                    socket.emit("provider_reply", {
                        ...data,
                        result: "Starting"
                    })
                    simulate_run()
                    break;
                case "double_me":
                        console.log("got request double_me")
                        socket.emit("provider_reply", {
                            ...data,
                            result: Number(data.data)*2
                        })
                        break;
                default:
                    socket.emit("provider_reply", {
                        ...data,
                        result: `cmd ${data.cmd} is not supported`
                    })
                    break;
            }
        } catch(err) {
            console.log("error on deploy", err)
        }
        
    })
});

socket.on("disconnect", () => {
    console.log(`Disconnected to server`);
});

console.log("Try to connect to server...")