package com.zaJava.ZaJava.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.MultiValueMap;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HttpRequest {
    private String baseUrl;
    private String endPoint;
    private MultiValueMap<String, String> queryParams;
}

