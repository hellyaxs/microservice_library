from rabbitmq import connect, publish, consume
import asyncio

async def main():
    await connect()

    async def tratar_mensagem(msg: str):
        print("Mensagem recebida:", msg)

    asyncio.create_task(consume("person_created", tratar_mensagem))
    asyncio.create_task(consume("person_updated", tratar_mensagem))
    asyncio.create_task(consume("person_deleted", tratar_mensagem))
    while True:
        await asyncio.sleep(1)

asyncio.run(main())

    