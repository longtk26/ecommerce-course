import redisPubsubService from "../services/redisPubsub.service";

class InventoryServiceTest {
  constructor() {
    redisPubsubService.subscribe("purchase_events", (message, channel) => {
      InventoryServiceTest.updateInventory(JSON.parse(message));
    });
  }

  static updateInventory({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) {
    console.log(
      `Updated inventory for product ${productId} with quantity ${quantity}`
    );
  }
}

export default new InventoryServiceTest();
