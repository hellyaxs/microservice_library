package com.Gestao.Pessoas.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import javax.sql.DataSource;


@Configuration
public class FlywayConfiguration {

    @Value("${spring.flyway.url}")
    private String url;
    @Value("${spring.flyway.user}")
    private String user;
    @Value("${spring.flyway.password}")
    private String password;

    @Value("${spring.flyway.locations}")
    private String locations;



    @Bean
    @FlywayDataSource
    public DataSource flywayDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(this.url);
        dataSource.setUsername(this.user);
        dataSource.setPassword(this.password);
        return dataSource;
    }

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .baselineOnMigrate(true)  // Garante execução em bancos novos
                .load();
        flyway.migrate(); // Executa as migrations toda vez que o app inicia
        return flyway;
    }
}
