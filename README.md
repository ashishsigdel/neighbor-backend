# chhimikee_backend

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
nodemon
npm run dev
```

### For Deployment (Production)

- Install [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

```bash
npm install pm2 -g
```

- Start the server

```bash
pm2 start app.js
```

- Stop the server

```bash
pm2 stop app.js
```

- Restart the server

```bash
pm2 restart app.js
```

- View logs

```bash
pm2 logs app.js
```

### Socket.io Connections

- socket.io url

  ```bash
  http://localhost:8080
  ```

  need to pass the token without the Bearer prefix during connection to the socket.io server
