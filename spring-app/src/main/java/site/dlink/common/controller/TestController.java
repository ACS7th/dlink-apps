package site.dlink.common.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @PostMapping("/hello")
    public String hello() {
        return "hello";
    }

    @GetMapping("/redirect")
    public void getMethodName(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.sendRedirect("http://localhost:3000/test");
    }
    
}