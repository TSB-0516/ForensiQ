package com.investigation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InvestigationApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvestigationApplication.class, args);
    }

}
