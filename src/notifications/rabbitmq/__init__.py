from .config import AsyncRabbitMQClient


client = AsyncRabbitMQClient()

connect = client.connect
publish = client.publish
consume = client.consume

 