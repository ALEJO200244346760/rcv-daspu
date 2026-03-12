package com.backend.rcv.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class RequestLoggerFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggerFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;

        // Esto va a salir en la consola de Railway
        logger.info("[REQUEST] Method: {} | URL: {} | IP: {} | Origin Header: {}",
                req.getMethod(),
                req.getRequestURL(),
                req.getRemoteAddr(),
                req.getHeader("Origin"));

        chain.doFilter(request, response);
    }
}