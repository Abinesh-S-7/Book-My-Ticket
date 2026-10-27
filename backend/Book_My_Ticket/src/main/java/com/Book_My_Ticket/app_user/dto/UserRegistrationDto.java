package com.Book_My_Ticket.app_user.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegistrationDto(

        @NotBlank(message = "First name is required")
        @Size(max = 20, message = "First name cannot exceed 20 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 20)
        String lastName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is Required")
        String email,

        @NotBlank(message = "Password is required")
        String password,

        @NotBlank(message = "Phone number is required")
        String phoneNumber
)

{
}
