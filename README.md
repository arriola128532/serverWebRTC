# WebRTC Signaling Server

Este proyecto es un servidor de señalización basado en React y Vite para facilitar la comunicación WebRTC entre clientes. La señalización es crucial para establecer conexiones peer-to-peer y gestionar eventos como ofertas, respuestas e intercambio de IceCandidates.

## Funcionalidades

### 1. Mantener una lista de clientes conectados

El servidor de señalización mantiene una lista actualizada de todos los clientes conectados, lo que facilita la gestión de la comunicación entre ellos.

### 2. Notificar a los clientes conectados cuando un nuevo cliente se conecta

Cuando un nuevo cliente se conecta al servidor de señalización, se notifica automáticamente a todos los clientes conectados para que estén al tanto de la nueva incorporación.

### 3. Transmitir ofertas de conexión de un cliente a otro

Cuando un cliente desea establecer una conexión, envía una oferta al servidor de señalización. Este servidor se encarga de transmitir la oferta al cliente destino para su procesamiento.

### 4. Transmitir respuestas a ofertas de conexión

Cuando un cliente recibe una oferta de conexión y responde afirmativamente, la respuesta se transmite de vuelta al cliente que realizó la oferta, estableciendo así la conexión.

### 5. Intercambiar eventos IceCandidate entre clientes

Durante el proceso de establecimiento de conexión, los clientes intercambian eventos IceCandidate para configurar las rutas de comunicación adecuadas.

### 6. Notificar al usuario cuando un cliente se desconecta

Cuando un cliente se desconecta, ya sea intencionalmente o debido a un problema de conexión, el servidor de señalización notifica a los demás clientes para que puedan manejar la desconexión de manera apropiada.

## Configuración y Uso

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Inicia el servidor de señalización con `npm run dev`.
4. Asegúrate de que tus aplicaciones cliente utilicen la dirección y puerto correctos para la señalización.

## Recursos

- [WebRTC Basics](https://webrtc.org/start/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
