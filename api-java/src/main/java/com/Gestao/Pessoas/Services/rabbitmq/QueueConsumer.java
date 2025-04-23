package com.Gestao.Pessoas.Services.rabbitmq;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.stereotype.Component;

@Component
public class QueueConsumer {

    @RabbitListener(queues = "person_created",containerFactory = "rabbitListenerContainerFactory")
    public void receiveMessagePersonCreated(Message message,
                                            Channel channel,
                                            @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        try {
            byte[] body = message.getBody();
            String content = new String(body, "UTF-8");
            System.out.println("Mensagem recebida: " + content);

            channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            // Em caso de erro, rejeita a mensagem e decide se deve reencaminhá-la
            try {
                channel.basicNack(deliveryTag, false, true); // true para reencaminhar
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @RabbitListener(queues = "person_updated")
    public void receiveMessagePersonUpdated(PersonCreatedEvent event) {
        System.out.println("Received message: " + event);
    }

    @RabbitListener(queues = "person_deleted")
    public void receiveMessagePersonDeleted(PersonCreatedEvent event) {
        System.out.println("Received message: " + event);
    }

}
