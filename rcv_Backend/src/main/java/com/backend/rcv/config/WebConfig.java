package com.backend.rcv.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Log para saber que la configuración cargó
        logger.info("Cargando configuración de CORS - MODO DEBUG");

        registry.addMapping("/**")
                .allowedOrigins("*") // Acepta cualquier origen
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false); // IMPORTANTE: Al ser false, ya no hay error 500
    }
}