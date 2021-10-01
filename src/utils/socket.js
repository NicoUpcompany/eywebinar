import io from "socket.io-client";

const Socket = io("http://localhost:8080/");
// const Socket = io("https://govdays.upwebinar.cl/");

export default Socket;
