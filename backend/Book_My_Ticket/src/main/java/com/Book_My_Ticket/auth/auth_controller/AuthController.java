package com.Book_My_Ticket.auth.auth_controller;

import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.auth.dto.AuthResponseDto;
import com.Book_My_Ticket.auth.dto.LoginRequestDto;
import com.Book_My_Ticket.auth.dto.RegisterRequestDto;
import com.Book_My_Ticket.enums.Role;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import com.Book_My_Ticket.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDto dto)
    {
        if(userRepository.existsByEmail(dto.email()))
        {
            throw new RuntimeException("Email is Already Registered");
        }
        User user = new User();

        user.setEmail(dto.email());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPhoneNumber(dto.phoneNumber());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);
        return new ResponseEntity<>("User Registred Successfully",HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto)
    {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(),dto.password())
        );
        if(authentication.isAuthenticated())
        {
            String token = jwtUtils.generateToken(dto.email());
            User user = userRepository.findByEmail(dto.email())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return new ResponseEntity<>(new AuthResponseDto(token,user.getRole()), HttpStatus.OK);
        }else{
            throw new RuntimeException("Invalid Access");
        }
    }

    @PostMapping("/register-admin")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody RegisterRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email is Already Registered");
        }

        User user = new User();
        user.setEmail(dto.email());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPhoneNumber(dto.phoneNumber());

        user.setRole(Role.ADMIN);

        user.setPassword(passwordEncoder.encode(dto.password()));

        userRepository.save(user);
        return new ResponseEntity<>("Admin Registered Successfully", HttpStatus.CREATED);
    }
}
