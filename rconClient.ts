
import * as net from 'net';

export class RconClient {
  private socket: net.Socket | null = null;
  private authenticated: boolean = false;

  constructor(private host: string, private port: number, private password: string) {}

  public async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socket = net.connect(this.port, this.host, () => {
        this.sendAuthRequest();
      });

      this.socket.on('data', (data) => {
        this.handleData(data);
      });

      this.socket.on('close', () => {
        console.log('Connection closed.');
      });

      this.socket.on('error', (error) => {
        reject(error);
      });

      this.socket.on('end', () => {
        console.log('Connection ended.');
      });
    });
  }

  private sendAuthRequest(): void {
    if (this.socket) {
      this.sendPacket(3, this.password);
    }
  }

  private sendPacket(type: number, payload: string): void {
    if (this.socket) {
      const length = Buffer.byteLength(payload) + 10;
      const buffer = Buffer.alloc(length);

      buffer.writeInt32LE(length - 4, 0);
      buffer.writeInt32LE(0, 4);
      buffer.writeInt32LE(type, 8);
      buffer.write(payload, 12);

      this.socket.write(buffer);
    }
  }

  private handleData(data: Buffer): void {
    // Handle received data
    console.log(data.toString());
  }

  public async sendCommand(command: string): Promise<void> {
    if (!this.authenticated) {
      throw new Error('Not authenticated. Call connect() first.');
    }

    return new Promise<void>((resolve) => {
      this.socket?.once('data', () => {
        resolve();
      });

      this.sendPacket(2, command);
    });
  }

  public async disconnect(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.socket?.end(() => {
        resolve();
      });
    });
  }
}
