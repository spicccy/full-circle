import { monitor } from '@colyseus/monitor';
import { BACKEND_PORT, ROOM_NAME } from '@full-circle/shared/lib/constants';
import { Server } from 'colyseus';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';

// import socialRoutes from "@colyseus/social/express"
import { MyRoom } from './MyRoom';

const port = Number(process.env.PORT || BACKEND_PORT);
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html')
  )
);

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define(ROOM_NAME, MyRoom);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor());

app.get('/ping', (_req, res) => {
  return res.send('pong');
});

app.get('/', (_req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html')
  );
});

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
