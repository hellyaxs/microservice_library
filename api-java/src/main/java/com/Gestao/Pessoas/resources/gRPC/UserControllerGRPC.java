package com.Gestao.Pessoas.resources.gRPC;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.Services.PersonService;
import com.example.user.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import reactor.core.publisher.Flux;

import java.util.UUID;

@GrpcService
public class UserControllerGRPC extends UserServiceGrpc.UserServiceImplBase {

    private final PersonService personService;

    public UserControllerGRPC(PersonService personService) {
        this.personService = personService;
    }

    @Override
    public void getUserById(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        personService.findPerson(UUID.fromString(request.getId())).subscribe(person -> {
            Flux.fromIterable(person.getPhones()).subscribe(phone -> {
                Phone phone1 = Phone.newBuilder()
                        .setId(phone.getId().toString())
                        .setDdd(phone.getDdd())
                        .setNumero(phone.getNumero())
                        .setType(TypePhone.valueOf(phone.getType().name()))
                        .build();
                UserResponse response = UserResponse.newBuilder()
                        .setUser(User.newBuilder()
                                .setId(person.getId().toString())
                                .setFirstName(person.getFirstName())
                                .setLastName(person.getLastName())
                                .setBirthdate(person.getBirthdate().toString())
                                .setEndereco(person.getEndereco())
                                .setCargo(person.getCargo())
                                .addPhones(phone1)
                                .build())
                        .build();
                responseObserver.onNext(response);
            });
        });
        responseObserver.onCompleted();
    }

    @Override
    public void getAllUsers(Empty request, StreamObserver<UserResponseList> responseObserver) {
        personService.findAllPerson().subscribe(person -> {
            Flux.fromIterable(person.getPhones()).subscribe(phone -> {
                Phone phone1 = Phone.newBuilder()
                        .setId(phone.getId().toString())
                        .setDdd(phone.getDdd())
                        .setNumero(phone.getNumero())
                        .setType(TypePhone.valueOf(phone.getType().name()))
                        .build();
                User user = User.newBuilder()
                        .setId(person.getId().toString())
                        .setFirstName(person.getFirstName())
                        .setLastName(person.getLastName())
                        .setBirthdate(person.getBirthdate().toString())
                        .setEndereco(person.getEndereco())
                        .setCargo(person.getCargo())
                        .addPhones(phone1)
                        .build();
                UserResponseList response = UserResponseList.newBuilder()
                        .addUsers(user)
                        .build();
                responseObserver.onNext(response);
            });
        });
            responseObserver.onCompleted();
    }

    @Override
    public void createUser(User request, StreamObserver<UserResponse> responseObserver) {
        PersonDTO personDTO = new PersonDTO();
        personDTO.setFirstName(request.getFirstName());
        personDTO.setLastName(request.getLastName());
        personDTO.setBirthdate(request.getBirthdate());
        personDTO.setEndereco(request.getEndereco());
        personDTO.setCargo(request.getCargo());

        personService.CreatePerson(personDTO).subscribe(person -> {
            UserResponse response = UserResponse.newBuilder()
                    .setUser(User.newBuilder()
                                .setId(person.getId().toString())
                                .setFirstName(person.getFirstName())
                                .setLastName(person.getLastName())
                                .setBirthdate(person.getBirthdate().toString())
                                .setEndereco(person.getEndereco())
                                .setCargo(person.getCargo())
                                .build()
                    )
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        });
    }

    @Override
    public void updateUser(User request, StreamObserver<UserResponse> responseObserver) {
        super.updateUser(request, responseObserver);
    }

    @Override
    public void deleteUser(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        personService.deleteById(UUID.fromString(request.getId())).subscribe(unused -> {
            UserResponse response = UserResponse.newBuilder()
                    .setUser(User.newBuilder()
                            .setId(request.getId())
                            .build()
                    )
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        });
    }
}
