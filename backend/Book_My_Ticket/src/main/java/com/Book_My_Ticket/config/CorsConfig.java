package com.Book_My_Ticket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Changed to "/**" to cover /auth, /api, and all other endpoints
        registry.addMapping("/**")
                // Removed the trailing slash from the Vercel URL
                .allowedOrigins("http://localhost:5173", "https://bookmyticket-seven.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}