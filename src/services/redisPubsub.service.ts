import { createClient } from "redis";

class RedisPubSubService {
  private subscriber;
  private publisher;

  constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
  }

  async publish(channel: string, message: string) {
    try {
      (async () => {
        this.publisher.connect();
        this.subscriber.connect();
      })();
      console.log(`Publish message: ${message}`);

      return this.publisher.publish(channel, message);
    } catch (error) {
      console.log("This is error", error);
    }
  }

  subscribe(
    channel: string,
    callback: (channel: string, message: string) => void
  ) {
    this.subscriber.subscribe(channel, callback);

    this.subscriber.on(
      "message",
      (subscriberChannel: string, message: string) => {
        if (channel == subscriberChannel) {
          callback(channel, message);
        }
      }
    );
  }
}

export default new RedisPubSubService();
