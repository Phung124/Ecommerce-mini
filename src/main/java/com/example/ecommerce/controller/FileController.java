package com.example.ecommerce.controller;

import com.example.ecommerce.payload.response.FileUploadResponse;
import com.example.ecommerce.payload.response.MessageResponse;
import com.example.ecommerce.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            FileUploadResponse response = fileService.uploadFile(file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error uploading file: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{publicId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable String publicId) {
        try {
            fileService.deleteFile(publicId);
            return ResponseEntity.ok(new MessageResponse("File deleted successfully!"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error deleting file: " + e.getMessage()));
        }
    }
}
