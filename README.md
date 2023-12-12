# MCRCONMODULE
minecraft rcon module in ts


## Usage:
```TypeScript
// index.ts
import { RconClient } from './rconClient';

async function main() {
  const host = 'your_minecraft_server_ip';
  const port = 25575; // Minecraft RCON port
  const password = 'your_rcon_password';
  const command = 'say Hello from RCON!';

  const rconClient = new RconClient(host, port, password);

  try {
    await rconClient.connect();
    await rconClient.sendCommand(command);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await rconClient.disconnect();
  }
}

main();
```
