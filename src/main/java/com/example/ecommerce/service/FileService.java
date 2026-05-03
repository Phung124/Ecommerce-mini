package com.example.ecommerce.service;

import com.example.ecommerce.payload.response.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    FileUploadResponse uploadFile(MultipartFile file) throws IOException;
    void deleteFile(String publicId) throws IOException;
}
