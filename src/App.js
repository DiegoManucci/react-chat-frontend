import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function InfoMessage({connected, login}){

	const spacer = {
		display: "flex",
		flexDirection: "column",
		gap: "10px"
	}

	return(
		<div style={spacer}>
			<p>Conectado : {connected.toString()}</p>
			<p>Logado : {login.toString()}</p>
		</div>
	);
}

function LoginForm({socket, connected, login}){

	const loginForm = {
		position: "absolute",
		height: "200px",
		width: "200px",
		right: "0",
		left: "0",
		top: "0",
		bottom: "0",
		margin: "auto",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		textAlign: "center",
		gap: "10px"
	}

	const loginButtom = {
		width: "50%",
		margin: "0 auto"
	}

	const [name, setName] = useState({name: ""});

	const handleNameInput = (e) => {
		setName(e.target.value);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		socket.emit('login', {data: name});
	}

	return(
		<form onSubmit={handleSubmit} style={loginForm}>
			<input type="text" placeholder={"Insira o nome"} onChange={handleNameInput}/>
			<button type='submit' style={loginButtom}>Entrar</button>
		</form>
	)
}

function ChatSendMessage({socket}){

	const [message, setMessage] = useState("");

	const handleMessageInput = (e) => {
		setMessage(e.target.value);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		socket.emit('message', {data: message});
	}

	return(
		<form onSubmit={handleSubmit}>
			<input type="text" onChange={handleMessageInput} placeholder={"Mensagem"}/>
			<button type="submit">Enviar</button>
		</form>
	);
}

function Message({message}){
	return(
		<div>
			<p value={message}/>
		</div>
	);
}

function ChatMessages({socket}){

	const [messages, setMessages] = useState([]);

	socket.on("message", ({data}) => {
		//setMessages([]);
		setMessages(messages.concat(data));
	});

	return( 
		<div>
			{messages.map((message, i) => {
				return(
					<div key={i}>
						<p key={i}>{message}</p><br/>
					</div>);
				})
			}
		</div>
	);

}

const socket = io('https://diego-react-chat-backend.herokuapp.com'); // Deixar fora do App caso contrario efetua multiplas requisicoes

function App() {

	const container = {
		padding: "10px"
	}

	const spacer = {
		display: "flex",
		flexDirection: "column",
		gap: "10px"
	}

	const [connected, setConnected] = useState(false);
	const [login, setLogin] = useState(false);

	useEffect(() => {

		socket.on("connect", () => {
			setConnected(true);
		});

		socket.on("disconnect", () => {
			socket.removeAllListeners();
			setConnected(false);
		});

		socket.on("loginConfirmation", () => {
			setLogin(true);
		});

	});

	return (
		<div style={container}>
			<div style={spacer}>
				<InfoMessage
					connected={connected}
					login={login}
				/>
				{!login &&
					<LoginForm
						socket={socket}
						connected={connected}
						login={login}
					/>
				}
				{login &&
					<div>
						<ChatMessages socket={socket}/>
						<ChatSendMessage socket={socket}/>
					</div>
				}
			</div>
		</div>
	);
}

export default App;
