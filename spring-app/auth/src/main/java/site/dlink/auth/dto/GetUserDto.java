package site.dlink.auth.dto;

import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetUserDto {

    private String email;
    private String name;
    private String profileImageUri;
}
