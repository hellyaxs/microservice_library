import aio_pika
from config.setup import RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD

class AsyncRabbitMQClient:
    def __init__(self):
        self.connection = None
        self.channel = None

    async def connect(self):
        if self.connection and not self.connection.is_closed:
            return

        self.connection = await aio_pika.connect_robust(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            login=RABBITMQ_USER,
            password=RABBITMQ_PASSWORD
        )
        self.channel = await self.connection.channel()
        await self.channel.set_qos(prefetch_count=10)

    async def publish(self, queue_name: str, message: str):
        await self.connect()
        queue = await self.channel.declare_queue(queue_name, durable=True)
        await self.channel.default_exchange.publish(
            aio_pika.Message(body=message.encode()),
            routing_key=queue.name
        )

    async def consume(self, queue_name: str, callback):
        await self.connect()
        queue = await self.channel.declare_queue(queue_name, durable=True)
        print(f"Consumindo mensagens da fila: {queue_name}")
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    await callback(message.body.decode())