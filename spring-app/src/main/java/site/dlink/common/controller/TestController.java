package site.dlink.common.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @PostMapping("/hello")
    public String hello() {
        return "hello";
    }

    @GetMapping("/redirect")
    public void getMethodName(ServletServerHttpRequest req, ServletServerHttpResponse res) {
    }
    
}