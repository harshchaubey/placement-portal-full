package com.placement.portal;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_NAME:dummy_name}")
    private String cloudName;

    @Value("${CLOUDINARY_API_KEY:dummy_key}")
    private String apiKey;

    @Value("${CLOUDINARY_API_SECRET:dummy_secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }
}
